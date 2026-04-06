import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  PostReactionType,
  PostVisibility,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type {
  PostReactionCountsDto,
  PostReactionSummaryDto,
} from './post-reaction.types';

const FEED_PUBLIC_PREFIX = 'feed:public:';
const REACTION_AGG_CACHE_TTL_SEC = 45;
const POST_REACTION_AGG_PREFIX = 'post:reactions:agg:';

@Injectable()
export class PostReactionService {
  private readonly logger = new Logger(PostReactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private feedPublicKey(cursor: string | undefined): string {
    return `${FEED_PUBLIC_PREFIX}${cursor ?? 'start'}`;
  }

  private reactionAggregateKey(postId: string): string {
    return `${POST_REACTION_AGG_PREFIX}${postId}`;
  }

  emptyReactionCounts(): PostReactionCountsDto {
    return { LIKE: 0, HAHA: 0, LOVE: 0 };
  }

  private async invalidateCachesAfterReactionChange(
    postId: string,
  ): Promise<void> {
    try {
      await Promise.all([
        this.redis.del(this.reactionAggregateKey(postId)),
        this.redis.del(this.feedPublicKey(undefined)),
      ]);
    } catch (e) {
      this.logger.warn(`Redis invalidation failed: ${(e as Error).message}`);
    }
  }

  private isReactionCountsPayload(v: unknown): v is PostReactionCountsDto {
    if (!v || typeof v !== 'object') return false;
    const o = v as Record<string, unknown>;
    return (
      typeof o.LIKE === 'number' &&
      typeof o.HAHA === 'number' &&
      typeof o.LOVE === 'number'
    );
  }

  /**
   * Loads per-post reaction aggregates from Redis; on miss, fills from DB and populates cache.
   * Does not load per-user reactions.
   */
  async loadAggregatesForPostIds(
    postIds: string[],
  ): Promise<Map<string, PostReactionCountsDto>> {
    if (postIds.length === 0) return new Map();

    const entries = await Promise.all(
      postIds.map(async (id) => {
        try {
          const raw = await this.redis.get(this.reactionAggregateKey(id));
          return { id, raw };
        } catch (e) {
          this.logger.warn(
            `Redis get reaction agg failed: ${(e as Error).message}`,
          );
          return { id, raw: null as string | null };
        }
      }),
    );

    const map = new Map<string, PostReactionCountsDto>();
    const missed: string[] = [];

    for (const { id, raw } of entries) {
      if (raw === null) {
        missed.push(id);
        continue;
      }
      try {
        const parsed: unknown = JSON.parse(raw);
        if (this.isReactionCountsPayload(parsed)) {
          map.set(id, parsed);
        } else {
          missed.push(id);
        }
      } catch {
        missed.push(id);
      }
    }

    if (missed.length === 0) {
      return map;
    }

    const groups = await this.prisma.postLike.groupBy({
      by: ['postId', 'reactionType'],
      where: { postId: { in: missed } },
      _count: { _all: true },
    });

    const filled = this.buildReactionCountsMap(missed, groups);

    await Promise.all(
      missed.map(async (id) => {
        const counts = filled.get(id) ?? this.emptyReactionCounts();
        map.set(id, counts);
        try {
          await this.redis.setex(
            this.reactionAggregateKey(id),
            REACTION_AGG_CACHE_TTL_SEC,
            JSON.stringify(counts),
          );
        } catch (e) {
          this.logger.warn(
            `Redis set reaction agg failed: ${(e as Error).message}`,
          );
        }
      }),
    );

    return map;
  }

  private buildReactionCountsMap(
    postIds: string[],
    groups: {
      postId: string;
      reactionType: PostReactionType;
      _count: { _all: number };
    }[],
  ): Map<string, PostReactionCountsDto> {
    const map = new Map<string, PostReactionCountsDto>();
    for (const id of postIds) {
      map.set(id, this.emptyReactionCounts());
    }
    for (const g of groups) {
      const row = map.get(g.postId);
      if (!row) continue;
      if (g.reactionType === PostReactionType.LIKE) row.LIKE = g._count._all;
      else if (g.reactionType === PostReactionType.HAHA)
        row.HAHA = g._count._all;
      else if (g.reactionType === PostReactionType.LOVE)
        row.LOVE = g._count._all;
    }
    return map;
  }

  async getViewerReactionsForPosts(
    viewerId: string,
    postIds: string[],
  ): Promise<Map<string, PostReactionType>> {
    if (postIds.length === 0) return new Map();
    const rows = await this.prisma.postLike.findMany({
      where: { userId: viewerId, postId: { in: postIds } },
      select: { postId: true, reactionType: true },
    });
    return new Map(rows.map((m) => [m.postId, m.reactionType] as const));
  }

  private async findPostVisibleToUser(
    viewerId: string,
    postId: string,
  ): Promise<{ id: string } | null> {
    return this.prisma.post.findFirst({
      where: {
        id: postId,
        OR: [
          { visibility: PostVisibility.PUBLIC },
          {
            visibility: PostVisibility.PRIVATE,
            authorId: viewerId,
          },
        ],
      },
      select: { id: true },
    });
  }

  async getReactionSummary(
    viewerId: string,
    postId: string,
  ): Promise<PostReactionSummaryDto> {
    const post = await this.findPostVisibleToUser(viewerId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [aggMap, mine] = await Promise.all([
      this.loadAggregatesForPostIds([postId]),
      this.prisma.postLike.findUnique({
        where: {
          userId_postId: { userId: viewerId, postId },
        },
        select: { reactionType: true },
      }),
    ]);

    const byType = aggMap.get(postId) ?? this.emptyReactionCounts();
    const total = byType.LIKE + byType.HAHA + byType.LOVE;

    return {
      total,
      byType,
      myReaction: mine?.reactionType ?? null,
    };
  }

  async setReaction(
    userId: string,
    postId: string,
    reactionType: PostReactionType,
  ): Promise<PostReactionSummaryDto> {
    const post = await this.findPostVisibleToUser(userId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.postLike.upsert({
      where: {
        userId_postId: { userId, postId },
      },
      create: {
        userId,
        postId,
        reactionType,
      },
      update: {
        reactionType,
      },
    });

    await this.invalidateCachesAfterReactionChange(postId);
    return this.getReactionSummary(userId, postId);
  }

  async removeReaction(userId: string, postId: string): Promise<void> {
    const post = await this.findPostVisibleToUser(userId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.postLike.deleteMany({
      where: { userId, postId },
    });

    await this.invalidateCachesAfterReactionChange(postId);
  }
}
