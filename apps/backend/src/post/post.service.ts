import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  PostReactionType,
  PostVisibility,
  Prisma,
} from '../../generated/prisma/client.js';
import { PostReactionService } from '../reaction/post-reaction.service';
import type { PostReactionCountsDto } from '../reaction/post-reaction.types';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type { CreatePostDto, PostVisibilityInput } from './dto/create-post.dto';

export type { PostReactionCountsDto } from '../reaction/post-reaction.types';

const FEED_PUBLIC_PREFIX = 'feed:public:';

const FEED_CACHE_TTL_SEC = 45;

export type PostAuthorDto = {
  id: string;
  name: string;
  avatar: null;
};

export type PostItemDto = {
  id: string;
  text: string;
  imageUrl: string | null;
  visibility: PostVisibilityInput;
  createdAt: string;
  author: PostAuthorDto;
  likeCount: number;
  reactionCounts: PostReactionCountsDto;
  commentCount: number;
  isLikedByMe: boolean;
  myReaction: PostReactionType | null;
};

export type FeedPageDto = {
  posts: PostItemDto[];
  nextCursor: string | null;
};

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly postReactionService: PostReactionService,
  ) {}

  private feedPublicKey(cursor: string | undefined): string {
    return `${FEED_PUBLIC_PREFIX}${cursor ?? 'start'}`;
  }

  private toPrismaVisibility(v: PostVisibilityInput | undefined): PostVisibility {
    return v === 'private' ? PostVisibility.PRIVATE : PostVisibility.PUBLIC;
  }

  private toApiVisibility(v: PostVisibility): PostVisibilityInput {
    return v === PostVisibility.PRIVATE ? 'private' : 'public';
  }

  private authorName(
    u: Pick<{ firstName: string; lastName: string | null }, 'firstName' | 'lastName'>,
  ): string {
    return [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.firstName;
  }

  private mapRowToItem(
    row: {
      id: string;
      content: string | null;
      visibility: PostVisibility;
      createdAt: Date;
      author: { id: string; firstName: string; lastName: string | null };
      images: { url: string }[];
      _count: { likes: number; comments: number };
    },
    reactionCounts: PostReactionCountsDto,
    myReaction: PostReactionType | null,
  ): PostItemDto {
    return {
      id: row.id,
      text: row.content ?? '',
      imageUrl: row.images[0]?.url ?? null,
      visibility: this.toApiVisibility(row.visibility),
      createdAt: row.createdAt.toISOString(),
      author: {
        id: row.author.id,
        name: this.authorName(row.author),
        avatar: null,
      },
      likeCount:
        reactionCounts.LIKE + reactionCounts.HAHA + reactionCounts.LOVE,
      reactionCounts,
      commentCount: row._count.comments,
      isLikedByMe: myReaction !== null,
      myReaction,
    };
  }

  private postSelect(): Prisma.PostSelect {
    return {
      id: true,
      content: true,
      visibility: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { url: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    };
  }

  private async userHasPrivatePosts(userId: string): Promise<boolean> {
    const row = await this.prisma.post.findFirst({
      where: {
        authorId: userId,
        visibility: PostVisibility.PRIVATE,
      },
      select: { id: true },
    });
    return !!row;
  }

  private async buildPublicCursorWhere(
    cursor: string | undefined,
  ): Promise<Prisma.PostWhereInput> {
    if (!cursor) return {};
    const cursorPost = await this.prisma.post.findFirst({
      where: { id: cursor, visibility: PostVisibility.PUBLIC },
      select: { createdAt: true, id: true },
    });
    if (!cursorPost) {
      throw new BadRequestException('Invalid cursor');
    }
    return {
      OR: [
        { createdAt: { lt: cursorPost.createdAt } },
        {
          AND: [
            { createdAt: cursorPost.createdAt },
            { id: { lt: cursorPost.id } },
          ],
        },
      ],
    };
  }

  private async buildMergedCursorWhere(
    userId: string,
    cursor: string | undefined,
  ): Promise<Prisma.PostWhereInput> {
    if (!cursor) return {};
    const cursorPost = await this.prisma.post.findFirst({
      where: {
        id: cursor,
        OR: [
          { visibility: PostVisibility.PUBLIC },
          {
            visibility: PostVisibility.PRIVATE,
            authorId: userId,
          },
        ],
      },
      select: { createdAt: true, id: true },
    });
    if (!cursorPost) {
      throw new BadRequestException('Invalid cursor');
    }
    return {
      OR: [
        { createdAt: { lt: cursorPost.createdAt } },
        {
          AND: [
            { createdAt: cursorPost.createdAt },
            { id: { lt: cursorPost.id } },
          ],
        },
      ],
    };
  }

  private async invalidatePublicFeedCache(): Promise<void> {
    try {
      await this.redis.del(this.feedPublicKey(undefined));
    } catch (e) {
      this.logger.warn(`Redis invalidation failed: ${(e as Error).message}`);
    }
  }

  private async enrichPostsWithReactions<
    T extends {
      id: string;
      content: string | null;
      visibility: PostVisibility;
      createdAt: Date;
      author: { id: string; firstName: string; lastName: string | null };
      images: { url: string }[];
      _count: { likes: number; comments: number };
    },
  >(viewerId: string, rows: T[]): Promise<PostItemDto[]> {
    if (rows.length === 0) return [];
    const ids = rows.map((r) => r.id);
    const [countsMap, mineByPost] = await Promise.all([
      this.postReactionService.loadAggregatesForPostIds(ids),
      this.postReactionService.getViewerReactionsForPosts(viewerId, ids),
    ]);
    return rows.map((row) =>
      this.mapRowToItem(
        row,
        countsMap.get(row.id) ?? this.postReactionService.emptyReactionCounts(),
        mineByPost.get(row.id) ?? null,
      ),
    );
  }

  private async attachViewerReactionFields(
    viewerId: string,
    items: Array<
      Omit<PostItemDto, 'isLikedByMe' | 'myReaction'> & {
        reactionCounts?: PostReactionCountsDto;
      }
    >,
  ): Promise<PostItemDto[]> {
    if (items.length === 0) return [];
    const ids = items.map((p) => p.id);
    const mineByPost =
      await this.postReactionService.getViewerReactionsForPosts(viewerId, ids);
    return items.map((p) => {
      const myReaction = mineByPost.get(p.id) ?? null;
      return {
        ...p,
        reactionCounts:
          p.reactionCounts ?? this.postReactionService.emptyReactionCounts(),
        isLikedByMe: myReaction !== null,
        myReaction,
      };
    });
  }

  async create(
    userId: string,
    dto: CreatePostDto,
    imageRelPath: string | null,
  ): Promise<PostItemDto> {
    const visibility = this.toPrismaVisibility(dto.visibility);

    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        visibility,
        content: dto.text,
        ...(imageRelPath
          ? {
              images: {
                create: [{ url: imageRelPath, sortOrder: 0 }],
              },
            }
          : {}),
      },
      select: this.postSelect(),
    });

    await this.invalidatePublicFeedCache();

    const [item] = await this.enrichPostsWithReactions(userId, [post]);
    return item;
  }

  async findAll(
    userId: string,
    cursor: string | undefined,
    limitRaw: number | undefined,
  ): Promise<FeedPageDto> {
    const limit = Math.min(Math.max(limitRaw ?? 10, 1), 50);
    const take = limit + 1;

    const canUsePublicCache = !(await this.userHasPrivatePosts(userId));

    if (canUsePublicCache) {
      const cacheKey = this.feedPublicKey(cursor);
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as {
            posts: Omit<PostItemDto, 'isLikedByMe' | 'myReaction'>[];
            nextCursor: string | null;
          };
          const posts = await this.attachViewerReactionFields(
            userId,
            parsed.posts,
          );
          return { posts, nextCursor: parsed.nextCursor };
        }
      } catch (e) {
        this.logger.warn(`Redis get failed: ${(e as Error).message}`);
      }

      const cursorWhere = await this.buildPublicCursorWhere(cursor);
      const where: Prisma.PostWhereInput = {
        visibility: PostVisibility.PUBLIC,
        ...cursorWhere,
      };

      const rows = await this.prisma.post.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take,
        select: this.postSelect(),
      });

      const page = this.slicePage(rows, limit);
      const enriched = await this.enrichPostsWithReactions(
        userId,
        page.items,
      );
      const payload: FeedPageDto = {
        posts: enriched,
        nextCursor: page.nextCursor,
      };

      try {
        const postsForCache = payload.posts.map(
          ({ isLikedByMe: _i, myReaction: _m, ...rest }) => rest,
        );
        await this.redis.setex(
          cacheKey,
          FEED_CACHE_TTL_SEC,
          JSON.stringify({
            posts: postsForCache,
            nextCursor: payload.nextCursor,
          }),
        );
      } catch (e) {
        this.logger.warn(`Redis set failed: ${(e as Error).message}`);
      }

      return payload;
    }

    const cursorWhere = await this.buildMergedCursorWhere(userId, cursor);
    const visibilityOr: Prisma.PostWhereInput = {
      OR: [
        { visibility: PostVisibility.PUBLIC },
        {
          visibility: PostVisibility.PRIVATE,
          authorId: userId,
        },
      ],
    };
    const where: Prisma.PostWhereInput =
      Object.keys(cursorWhere).length === 0
        ? visibilityOr
        : { AND: [visibilityOr, cursorWhere] };

    const rows = await this.prisma.post.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      select: this.postSelect(),
    });

    const page = this.slicePage(rows, limit);
    const posts = await this.enrichPostsWithReactions(userId, page.items);
    return {
      posts,
      nextCursor: page.nextCursor,
    };
  }

  private slicePage<T>(rows: T[], limit: number): {
    items: T[];
    nextCursor: string | null;
  } {
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1] as { id: string } | undefined;
    const nextCursor =
      hasMore && last ? last.id : null;
    return { items, nextCursor };
  }
}
