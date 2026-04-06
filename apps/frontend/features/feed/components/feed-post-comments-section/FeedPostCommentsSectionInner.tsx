"use client";

import { useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useAlert } from "@/components/ui/alerts/Alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { fetchCommentsPage, postCommentsQueryKey } from "./api";
import { CommentRow } from "./CommentRow";
import { feedEase } from "./constants";

export function FeedPostCommentsSectionInner({
  postId,
  commentCount,
  expanded,
  onExpandedChange,
}: {
  postId: string;
  commentCount: number;
  expanded: boolean;
  onExpandedChange: (next: boolean) => void;
}) {
  const { showError } = useAlert();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const loadErrorAlertedRef = useRef<string | null>(null);

  const commentsQuery = useInfiniteQuery({
    queryKey: postCommentsQueryKey(postId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => {
      if (!accessToken) {
        throw new Error("You must be signed in to view comments.");
      }
      return fetchCommentsPage(accessToken, postId, pageParam);
    },
    getNextPageParam: (last) =>
      last.hasMore && last.nextCursor ? last.nextCursor : undefined,
    enabled: expanded && Boolean(accessToken),
    staleTime: 60_000,
  });

  const comments = useMemo(
    () => commentsQuery.data?.pages.flatMap((p) => p.comments) ?? [],
    [commentsQuery.data?.pages],
  );

  useEffect(() => {
    if (!expanded) {
      loadErrorAlertedRef.current = null;
      return;
    }
    if (!commentsQuery.isError || !commentsQuery.error) {
      loadErrorAlertedRef.current = null;
      return;
    }
    const msg = (commentsQuery.error as Error).message;
    if (loadErrorAlertedRef.current === msg) return;
    loadErrorAlertedRef.current = msg;
    showError(msg);
  }, [
    expanded,
    commentsQuery.isError,
    commentsQuery.error,
    showError,
  ]);

  if (!expanded) {
    return null;
  }

  return (
    <div className="_timline_comment_main px-6 pt-6 pb-2.5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          aria-expanded
          className={cn(
            "h-auto min-h-0 rounded-[6px] p-0 text-sm leading-[1.2] font-semibold text-[var(--feed-text-secondary)] underline-offset-2 shadow-none outline-none",
            feedEase,
            "hover:bg-transparent hover:underline hover:text-[var(--color5)] dark:hover:bg-transparent dark:hover:text-[var(--color5)]",
            "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
            "active:opacity-90",
          )}
          onClick={() => onExpandedChange(false)}
        >
          Hide comments
          {commentCount > 0 ? (
            <span className="ml-1 tabular-nums text-[var(--feed-meta)]">
              ({commentCount})
            </span>
          ) : null}
        </Button>
      </div>

      {!accessToken ? (
        <p className="m-0 text-sm text-[var(--feed-meta)]">
          Sign in to load comments.
        </p>
      ) : null}

      {accessToken ? (
        <>
          {commentsQuery.isPending ? (
            <p className="m-0 text-sm text-[var(--feed-meta)]" aria-busy>
              Loading comments…
            </p>
          ) : commentsQuery.isError ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-fit rounded-[6px] text-sm"
              onClick={() => commentsQuery.refetch()}
            >
              Try again
            </Button>
          ) : (
            <>
              {comments.length === 0 ? (
                <p className="m-0 text-sm text-[var(--feed-meta)]">
                  No comments yet.
                </p>
              ) : (
                <div className="space-y-5">
                  {comments.map((c) => (
                    <CommentRow key={c.id} postId={postId} comment={c} />
                  ))}
                </div>
              )}

              {commentsQuery.hasNextPage ? (
                <div
                  className={cn(
                    comments.length > 0 ? "mt-5" : "mt-2",
                  )}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={commentsQuery.isFetchingNextPage}
                    className={cn(
                      "h-auto min-h-9 rounded-[6px] px-1 text-sm font-semibold text-[var(--feed-text-secondary)] shadow-none",
                      "hover:bg-transparent hover:text-[var(--color5)] hover:underline dark:hover:bg-transparent",
                      "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                    )}
                    onClick={() => commentsQuery.fetchNextPage()}
                  >
                    {commentsQuery.isFetchingNextPage
                      ? "Loading…"
                      : "Load more comments"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
