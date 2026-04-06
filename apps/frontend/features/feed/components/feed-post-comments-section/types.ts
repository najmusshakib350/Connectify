export type CommentAuthor = {
  id: string;
  name: string;
  avatar: null;
};

export type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  replyCount: number;
};

export type ReplyItem = {
  id: string;
  parentReplyId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
};

export type ReplyNode = { reply: ReplyItem; children: ReplyNode[] };

export type RepliesPage = {
  replies: ReplyItem[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type CommentsPage = {
  comments: CommentItem[];
  nextCursor: string | null;
  hasMore: boolean;
};
