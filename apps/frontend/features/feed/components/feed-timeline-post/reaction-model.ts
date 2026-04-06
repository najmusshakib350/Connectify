import type { InfiniteData } from "@tanstack/react-query";

import type { FeedPostsPageData } from "@/features/feed/api/posts.api";
import type { FeedTimelinePostData } from "@/features/feed/types/feed";

export type PostReactionType = "LIKE" | "HAHA" | "LOVE";

export type TimelinePostReactions = FeedTimelinePostData & {
  reactionCounts?: { LIKE: number; HAHA: number; LOVE: number };
  myReaction?: PostReactionType | null;
};

export function feedApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (base && base.length > 0) {
    return base.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export type SetReactionApiData = {
  total: number;
  byType: { LIKE: number; HAHA: number; LOVE: number };
  myReaction: PostReactionType | null;
};

export async function putPostReaction(
  accessToken: string,
  postId: string,
  reaction: PostReactionType,
): Promise<SetReactionApiData> {
  const url = `${feedApiBaseUrl()}/posts/${encodeURIComponent(postId)}/reactions`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reaction }),
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    let msg = res.statusText || "Could not save reaction";
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
  const byType = d.byType as Record<string, unknown> | undefined;
  if (
    !byType ||
    typeof byType.LIKE !== "number" ||
    typeof byType.HAHA !== "number" ||
    typeof byType.LOVE !== "number"
  ) {
    throw new Error("Invalid response from server");
  }
  const mr = d.myReaction;
  const myReaction =
    mr === "LIKE" || mr === "HAHA" || mr === "LOVE" ? mr : null;
  return {
    total: Number(d.total),
    byType: {
      LIKE: byType.LIKE,
      HAHA: byType.HAHA,
      LOVE: byType.LOVE,
    },
    myReaction,
  };
}

export function asPostWithReactions(p: FeedTimelinePostData): TimelinePostReactions {
  return p as TimelinePostReactions;
}

export function normalizeCounts(p: TimelinePostReactions) {
  const c = p.reactionCounts;
  return {
    LIKE: c?.LIKE ?? 0,
    HAHA: c?.HAHA ?? 0,
    LOVE: c?.LOVE ?? 0,
  };
}

export function patchPostFromSummary(
  post: FeedTimelinePostData,
  summary: SetReactionApiData,
): FeedTimelinePostData {
  return {
    ...post,
    likeCount: summary.total,
    isLikedByMe: summary.myReaction !== null,
    reactionCounts: summary.byType,
    myReaction: summary.myReaction,
  } as FeedTimelinePostData;
}

export function optimisticallyReact(
  post: TimelinePostReactions,
  next: PostReactionType,
): FeedTimelinePostData {
  const counts = normalizeCounts(post);
  const prev = post.myReaction ?? null;
  if (prev !== null && prev !== next) {
    counts[prev] = Math.max(0, counts[prev] - 1);
  }
  if (prev !== next) {
    counts[next] = counts[next] + 1;
  }
  const total = counts.LIKE + counts.HAHA + counts.LOVE;
  return {
    ...post,
    reactionCounts: counts,
    myReaction: next,
    isLikedByMe: true,
    likeCount: total,
  } as FeedTimelinePostData;
}

export function updatePostInInfiniteCache(
  old: InfiniteData<FeedPostsPageData> | undefined,
  postId: string,
  updater: (p: FeedTimelinePostData) => FeedTimelinePostData,
): InfiniteData<FeedPostsPageData> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      posts: page.posts.map((p) => (p.id === postId ? updater(p) : p)),
    })),
  };
}
