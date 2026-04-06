import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostVisibility, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { FEED_PUBLIC_ROOT_CACHE_KEY } from './dto/comment.dto';


export const DEFAULT_COMMENTS_PAGE_LIMIT = 15;

export const DEFAULT_REPLIES_PAGE_LIMIT = 20;

export type CommentAuthorDto = {
  id: string;
  name: string;
  avatar: null;
};

export type CommentItemDto = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorDto;
  replyCount: number;
};

export type CommentsPageDto = {
  comments: CommentItemDto[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ReplyItemDto = {
  id: string;
  parentReplyId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthorDto;
};

export type RepliesPageDto = {
  replies: ReplyItemDto[];
  nextCursor: string | null;
  hasMore: boolean;
};

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private authorName(
    u: Pick<{ firstName: string; lastName: string | null }, 'firstName' | 'lastName'>,
  ): string {
    return [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.firstName;
  }

  private async invalidatePublicFeedRootCache(): Promise<void> {
    try {
      await this.redis.del(FEED_PUBLIC_ROOT_CACHE_KEY);
    } catch (e) {
      this.logger.warn(`Redis invalidation failed: ${(e as Error).message}`);
    }
  }

  private async findPostVisibleToViewer(
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

  private async assertCommentOnPost(
    postId: string,
    commentId: string,
  ): Promise<{ id: string }> {
    const row = await this.prisma.comment.findFirst({
      where: { id: commentId, postId },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException('Comment not found');
    }
    return row;
  }

  private commentSelect(): Prisma.CommentSelect {
    return {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: { id: true, firstName: true, lastName: true },
      },
      _count: { select: { replies: true } },
    };
  }

  private mapComment(row: {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: { id: string; firstName: string; lastName: string | null };
    _count: { replies: number };
  }): CommentItemDto {
    return {
      id: row.id,
      content: row.content,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      author: {
        id: row.author.id,
        name: this.authorName(row.author),
        avatar: null,
      },
      replyCount: row._count.replies,
    };
  }

  private mapReply(row: {
    id: string;
    parentReplyId: string | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: { id: string; firstName: string; lastName: string | null };
  }): ReplyItemDto {
    return {
      id: row.id,
      parentReplyId: row.parentReplyId,
      content: row.content,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      author: {
        id: row.author.id,
        name: this.authorName(row.author),
        avatar: null,
      },
    };
  }

  private async buildCommentCursorWhere(
    postId: string,
    cursor: string | undefined,
  ): Promise<Prisma.CommentWhereInput> {
    if (!cursor) return {};
    const c = await this.prisma.comment.findFirst({
      where: { id: cursor, postId },
      select: { createdAt: true, id: true },
    });
    if (!c) {
      throw new BadRequestException('Invalid cursor');
    }
    return {
      OR: [
        { createdAt: { lt: c.createdAt } },
        {
          AND: [{ createdAt: c.createdAt }, { id: { lt: c.id } }],
        },
      ],
    };
  }

  private async buildReplyCursorWhere(
    commentId: string,
    cursor: string | undefined,
  ): Promise<Prisma.CommentReplyWhereInput> {
    if (!cursor) return {};
    const r = await this.prisma.commentReply.findFirst({
      where: { id: cursor, commentId },
      select: { createdAt: true, id: true },
    });
    if (!r) {
      throw new BadRequestException('Invalid cursor');
    }
    return {
      OR: [
        { createdAt: { gt: r.createdAt } },
        {
          AND: [{ createdAt: r.createdAt }, { id: { gt: r.id } }],
        },
      ],
    };
  }

  private slicePage<T>(rows: T[], limit: number): {
    items: T[];
    nextCursor: string | null;
    hasMore: boolean;
  } {
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1] as { id: string } | undefined;
    const nextCursor = hasMore && last ? last.id : null;
    return { items, nextCursor, hasMore };
  }

  async createComment(
    viewerId: string,
    postId: string,
    content: string,
  ): Promise<CommentItemDto> {
    const post = await this.findPostVisibleToViewer(viewerId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const created = await this.prisma.comment.create({
      data: {
        postId,
        authorId: viewerId,
        content,
      },
      select: this.commentSelect(),
    });

    await this.invalidatePublicFeedRootCache();
    return this.mapComment(created);
  }

  /**
   * Cursor-paged top-level comments for a post (newest first).
   */
  async listComments(
    viewerId: string,
    postId: string,
    cursor: string | undefined,
    limitRaw: number | undefined,
  ): Promise<CommentsPageDto> {
    const post = await this.findPostVisibleToViewer(viewerId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const limit = Math.min(
      Math.max(limitRaw ?? DEFAULT_COMMENTS_PAGE_LIMIT, 1),
      50,
    );
    const take = limit + 1;
    const cursorWhere = await this.buildCommentCursorWhere(postId, cursor);

    const rows = await this.prisma.comment.findMany({
      where: { postId, ...cursorWhere },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      select: this.commentSelect(),
    });

    const page = this.slicePage(rows, limit);
    return {
      comments: page.items.map((r) => this.mapComment(r)),
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    };
  }

  async createReply(
    viewerId: string,
    postId: string,
    commentId: string,
    content: string,
    parentReplyId: string | undefined,
  ): Promise<ReplyItemDto> {
    const post = await this.findPostVisibleToViewer(viewerId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.assertCommentOnPost(postId, commentId);

    if (parentReplyId) {
      const parent = await this.prisma.commentReply.findFirst({
        where: { id: parentReplyId, commentId },
        select: { id: true },
      });
      if (!parent) {
        throw new BadRequestException(
          'parentReplyId must belong to this comment thread',
        );
      }
    }

    const created = await this.prisma.commentReply.create({
      data: {
        commentId,
        authorId: viewerId,
        content,
        parentReplyId: parentReplyId ?? null,
      },
      select: {
        id: true,
        parentReplyId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    await this.invalidatePublicFeedRootCache();
    return this.mapReply(created);
  }

  /**
   * Cursor-paged flat list of replies for one comment (oldest first).
   */
  async listReplies(
    viewerId: string,
    postId: string,
    commentId: string,
    cursor: string | undefined,
    limitRaw: number | undefined,
  ): Promise<RepliesPageDto> {
    const post = await this.findPostVisibleToViewer(viewerId, postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.assertCommentOnPost(postId, commentId);

    const limit = Math.min(
      Math.max(limitRaw ?? DEFAULT_REPLIES_PAGE_LIMIT, 1),
      100,
    );
    const take = limit + 1;
    const cursorWhere = await this.buildReplyCursorWhere(commentId, cursor);

    const rows = await this.prisma.commentReply.findMany({
      where: { commentId, ...cursorWhere },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take,
      select: {
        id: true,
        parentReplyId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    const page = this.slicePage(rows, limit);
    return {
      replies: page.items.map((r) => this.mapReply(r)),
      nextCursor: page.nextCursor,
      hasMore: page.hasMore,
    };
  }
}
