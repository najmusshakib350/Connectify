import { COMMENTS_PAGE_LIMIT, REPLIES_PAGE_LIMIT } from "./constants";
import type {
  CommentItem,
  CommentsPage,
  RepliesPage,
  ReplyItem,
} from "./types";

function feedApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (base && base.length > 0) {
    return base.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export function postCommentsQueryKey(postId: string) {
  return ["feed", "post-comments", postId] as const;
}

export function postCommentRepliesQueryKey(postId: string, commentId: string) {
  return ["feed", "post-comment-replies", postId, commentId] as const;
}

export async function fetchCommentsPage(
  accessToken: string,
  postId: string,
  cursor: string | undefined,
): Promise<CommentsPage> {
  const params = new URLSearchParams();
  params.set("limit", String(COMMENTS_PAGE_LIMIT));
  if (cursor) params.set("cursor", cursor);
  const url = `${feedApiBaseUrl()}/posts/${encodeURIComponent(postId)}/comments?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    let msg = res.statusText || "Could not load comments";
    if (body && typeof body === "object" && "message" in body) {
      const m = (body as { message: unknown }).message;
      if (typeof m === "string" && m.length > 0) msg = m;
    }
    throw new Error(msg);
  }
  if (
    !body ||
    typeof body !== "object" ||
    (body as { success?: unknown }).success !== true
  ) {
    throw new Error("Invalid response from server");
  }
  const data = (body as { data?: unknown }).data;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from server");
  }
  const d = data as Record<string, unknown>;
  const comments = d.comments;
  if (!Array.isArray(comments)) {
    throw new Error("Invalid response from server");
  }
  return {
    comments: comments as CommentItem[],
    nextCursor: (d.nextCursor as string | null) ?? null,
    hasMore: Boolean(d.hasMore),
  };
}

export async function fetchRepliesPage(
  accessToken: string,
  postId: string,
  commentId: string,
  cursor: string | undefined,
): Promise<RepliesPage> {
  const params = new URLSearchParams();
  params.set("limit", String(REPLIES_PAGE_LIMIT));
  if (cursor) params.set("cursor", cursor);
  const url = `${feedApiBaseUrl()}/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/replies?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    let msg = res.statusText || "Could not load replies";
    if (body && typeof body === "object" && "message" in body) {
      const m = (body as { message: unknown }).message;
      if (typeof m === "string" && m.length > 0) msg = m;
    }
    throw new Error(msg);
  }
  if (
    !body ||
    typeof body !== "object" ||
    (body as { success?: unknown }).success !== true
  ) {
    throw new Error("Invalid response from server");
  }
  const data = (body as { data?: unknown }).data;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from server");
  }
  const d = data as Record<string, unknown>;
  const replies = d.replies;
  if (!Array.isArray(replies)) {
    throw new Error("Invalid response from server");
  }
  return {
    replies: replies as ReplyItem[],
    nextCursor: (d.nextCursor as string | null) ?? null,
    hasMore: Boolean(d.hasMore),
  };
}

export async function postReplyRequest(
  accessToken: string,
  postId: string,
  commentId: string,
  content: string,
  parentReplyId: string | undefined,
): Promise<void> {
  const url = `${feedApiBaseUrl()}/posts/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}/replies`;
  const payload: { content: string; parentReplyId?: string } = { content };
  if (parentReplyId) payload.parentReplyId = parentReplyId;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    let msg = res.statusText || "Could not post reply";
    if (body && typeof body === "object") {
      const o = body as { message?: unknown };
      if (typeof o.message === "string" && o.message.length > 0) {
        msg = o.message;
      }
    }
    throw new Error(msg);
  }
  if (
    !body ||
    typeof body !== "object" ||
    (body as { success?: unknown }).success !== true
  ) {
    throw new Error("Invalid response from server");
  }
}
