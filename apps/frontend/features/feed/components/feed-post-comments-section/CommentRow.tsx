"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { useAlert } from "@/components/ui/alerts/Alert";
import { Button } from "@/components/ui/button";
import { formatFeedPostTime } from "@/features/feed/utils/format-feed-post-time";
import { cn } from "@/lib/utils";

import {
  fetchRepliesPage,
  postCommentRepliesQueryKey,
} from "./api";
import { commentActionClass, DEFAULT_AVATAR } from "./constants";
import { NestedReplyComposer } from "./NestedReplyComposer";
import { buildReplyTree } from "./reply-tree";
import { ReplyThreadRow } from "./ReplyThreadRow";
import type { CommentItem } from "./types";

export function CommentRow({
  postId,
  comment,
}: {
  postId: string;
  comment: CommentItem;
}) {
  const { showError } = useAlert();
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? "";
  const avatarSrc = DEFAULT_AVATAR;
  const timeLabel = formatFeedPostTime(comment.createdAt);
  const [replyOpen, setReplyOpen] = useState(false);

  const repliesQuery = useInfiniteQuery({
    queryKey: postCommentRepliesQueryKey(postId, comment.id),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => {
      if (!accessToken) {
        throw new Error("You must be signed in to load replies.");
      }
      return fetchRepliesPage(accessToken, postId, comment.id, pageParam);
    },
    getNextPageParam: (last) =>
      last.hasMore && last.nextCursor ? last.nextCursor : undefined,
    enabled: Boolean(accessToken) && (comment.replyCount > 0 || replyOpen),
    staleTime: 60_000,
  });

  const flatReplies = useMemo(
    () => repliesQuery.data?.pages.flatMap((p) => p.replies) ?? [],
    [repliesQuery.data?.pages],
  );
  const replyTree = useMemo(
    () => buildReplyTree(flatReplies),
    [flatReplies],
  );

  return (
    <div className="_comment_main flex gap-0">
      <div className="_comment_image relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-full border border-[var(--feed-border-subtle)]">
        <Button
          asChild
          variant="ghost"
          className="size-10 rounded-full p-0 hover:bg-transparent dark:hover:bg-transparent"
        >
          <Link
            href="#0"
            className="_comment_image_link block size-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]"
            aria-label={`${comment.author.name} profile`}
          >
            <Image
              src={avatarSrc}
              alt=""
              width={40}
              height={40}
              className="_comment_img1 size-10 max-w-10 rounded-full object-cover"
            />
          </Link>
        </Button>
      </div>
      <div className="_comment_area ml-5 min-w-0 flex-1">
        <div
          className={cn(
            "_comment_details relative mb-2 w-full max-w-fit rounded-[18px] px-3 py-3",
            "bg-[var(--html-surface-muted)] dark:bg-[var(--bg6)]",
          )}
        >
          <div className="_comment_details_top mb-1 flex">
            <div className="_comment_name min-w-0 flex-1 overflow-hidden pr-4">
              <Link
                href="#0"
                className={cn(
                  "inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--html-surface-muted)] dark:focus-visible:ring-offset-[var(--bg6)]",
                  "active:opacity-90",
                )}
              >
                <h4 className="_comment_name_title m-0 break-all text-sm leading-[1.3] font-semibold text-[var(--feed-text-primary)]">
                  {comment.author.name}
                </h4>
              </Link>
            </div>
          </div>
          <div className="_comment_status mb-0">
            <p className="_comment_status_text m-0 break-all text-sm leading-[1.2] font-normal text-[var(--feed-text-secondary)] dark:opacity-80">
              <span className="whitespace-pre-wrap">{comment.content}</span>
            </p>
          </div>
        </div>
        <div className="mb-1 flex flex-wrap items-center gap-x-0 text-sm text-[var(--feed-meta)]">
          <Button
            type="button"
            variant="ghost"
            className={cn("h-auto min-h-0", commentActionClass)}
          >
            Like.
          </Button>
          <span className="px-0.5" aria-hidden>
            .
          </span>
          <Button
            type="button"
            variant="ghost"
            className={cn("h-auto min-h-0", commentActionClass)}
            onClick={() => setReplyOpen((o) => !o)}
          >
            Reply.
          </Button>
          <span className="px-0.5" aria-hidden>
            .
          </span>
          <Button
            type="button"
            variant="ghost"
            className={cn("h-auto min-h-0", commentActionClass)}
          >
            Share
          </Button>
          <span className="px-0.5" aria-hidden>
            .
          </span>
          <span className="text-[var(--feed-meta)]">{timeLabel}</span>
        </div>
        {replyOpen && accessToken ? (
          <NestedReplyComposer
            postId={postId}
            commentId={comment.id}
            accessToken={accessToken}
            onPosted={() => setReplyOpen(false)}
            onError={showError}
          />
        ) : null}
        {replyOpen && !accessToken ? (
          <p className="mt-2 m-0 text-sm text-[var(--feed-meta)]">
            Sign in to reply.
          </p>
        ) : null}
        {accessToken && (comment.replyCount > 0 || replyOpen) ? (
          <>
            {repliesQuery.isPending ? (
              <p className="mt-2 m-0 text-sm text-[var(--feed-meta)]">
                Loading replies…
              </p>
            ) : repliesQuery.isError ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 h-8 w-fit rounded-[6px] text-sm"
                onClick={() => repliesQuery.refetch()}
              >
                Could not load replies — try again
              </Button>
            ) : (
              <>
                {replyTree.length > 0 ? (
                  <div className="mt-2 space-y-0">
                    {replyTree.map((n) => (
                      <ReplyThreadRow
                        key={n.reply.id}
                        postId={postId}
                        commentId={comment.id}
                        node={n}
                        depth={0}
                        accessToken={accessToken}
                        showError={showError}
                      />
                    ))}
                  </div>
                ) : null}
                {repliesQuery.hasNextPage ? (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={repliesQuery.isFetchingNextPage}
                      className={cn(
                        "h-auto min-h-9 rounded-[6px] px-1 text-sm font-semibold text-[var(--feed-text-secondary)] shadow-none",
                        "hover:bg-transparent hover:text-[var(--color5)] hover:underline dark:hover:bg-transparent",
                        "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                      )}
                      onClick={() => repliesQuery.fetchNextPage()}
                    >
                      {repliesQuery.isFetchingNextPage
                        ? "Loading…"
                        : "Load more replies"}
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
