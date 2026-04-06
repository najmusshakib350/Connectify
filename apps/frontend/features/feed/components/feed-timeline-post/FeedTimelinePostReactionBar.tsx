"use client";

import type { InfiniteData, UseMutationResult } from "@tanstack/react-query";
import type { RefObject } from "react";

import type { FeedPostsPageData } from "@/features/feed/api/posts.api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { feedEase } from "./constants";
import type {
  PostReactionType,
  SetReactionApiData,
  TimelinePostReactions,
} from "./reaction-model";

type ReactionMutationContext = {
  previous: InfiniteData<FeedPostsPageData> | undefined;
};

export function FeedTimelinePostReactionBar({
  post,
  reactionMutation,
  reactionPickerOpen,
  setReactionPickerOpen,
  reactionPickerRef,
  accessToken,
  commentsExpanded,
  setCommentsExpanded,
}: {
  post: TimelinePostReactions;
  reactionMutation: UseMutationResult<
    SetReactionApiData,
    Error,
    PostReactionType,
    ReactionMutationContext
  >;
  reactionPickerOpen: boolean;
  setReactionPickerOpen: (next: boolean | ((prev: boolean) => boolean)) => void;
  reactionPickerRef: RefObject<HTMLDivElement | null>;
  accessToken: string | undefined;
  commentsExpanded: boolean;
  setCommentsExpanded: (next: boolean | ((prev: boolean) => boolean)) => void;
}) {
  return (
    <div className="_feed_inner_timeline_reaction flex w-full gap-1 bg-[var(--feed-reaction-bg)] p-2">
      <div
        ref={reactionPickerRef}
        className="_feed_inner_timeline_reaction_emoji_wrap relative flex min-h-12 min-w-0 flex-1 flex-col justify-end"
        onMouseEnter={() => setReactionPickerOpen(true)}
        onMouseLeave={() => setReactionPickerOpen(false)}
      >
        <div
          className={cn(
            "absolute bottom-full left-1/2 z-50 flex -translate-x-1/2 flex-col items-center",
            reactionPickerOpen
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-0.5 opacity-0",
            feedEase,
            "transition-[opacity,visibility,transform] duration-200 ease-out",
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            role="toolbar"
            aria-label="Choose a reaction"
            aria-hidden={!reactionPickerOpen}
            className={cn(
              "flex items-center gap-1 rounded-full border border-[var(--feed-border-subtle)] bg-[var(--feed-surface-elevated)] px-2 py-1.5",
              "shadow-[var(--feed-shadow-dropdown)]",
            )}
          >
            <button
              type="button"
              title="Like"
              aria-label="React with Like"
              disabled={reactionMutation.isPending || !accessToken}
              className={cn(
                "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--html-surface-muted)] outline-none transition-transform dark:bg-[var(--bg6)]",
                feedEase,
                "hover:scale-110 hover:brightness-[0.98] dark:hover:brightness-110",
                "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-95",
              )}
              onClick={() => {
                setReactionPickerOpen(false);
                reactionMutation.mutate("LIKE");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </button>
            <button
              type="button"
              title="Haha"
              aria-label="React with Haha"
              disabled={reactionMutation.isPending || !accessToken}
              className={cn(
                "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--html-surface-muted)] outline-none transition-transform dark:bg-[var(--bg6)]",
                feedEase,
                "hover:scale-110 hover:brightness-[0.98] dark:hover:brightness-110",
                "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-95",
              )}
              onClick={() => {
                setReactionPickerOpen(false);
                reactionMutation.mutate("HAHA");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 19 19"
                aria-hidden
              >
                <path
                  fill="var(--feed-emoji-yellow)"
                  d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
                />
                <path
                  fill="var(--feed-emoji-brown)"
                  d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
                />
                <path
                  fill="var(--html-white)"
                  d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
                />
                <path
                  fill="var(--feed-emoji-brown)"
                  d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
                />
              </svg>
            </button>
            <button
              type="button"
              title="Love"
              aria-label="React with Love"
              disabled={reactionMutation.isPending || !accessToken}
              className={cn(
                "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--html-surface-muted)] outline-none transition-transform dark:bg-[var(--bg6)]",
                feedEase,
                "hover:scale-110 hover:brightness-[0.98] dark:hover:brightness-110",
                "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-95",
              )}
              onClick={() => {
                setReactionPickerOpen(false);
                reactionMutation.mutate("LOVE");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500"
                aria-hidden
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          <div
            className="h-14 w-[min(100%,10rem)] shrink-0"
            aria-hidden
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          disabled={reactionMutation.isPending || !accessToken}
          className={cn(
            "_feed_inner_timeline_reaction_emoji _feed_reaction h-12 min-h-12 w-full rounded-[6px] border-0 px-2 shadow-none outline-none",
            post.isLikedByMe || post.myReaction
              ? "_feed_reaction_active bg-[var(--feed-reaction-active-bg)] hover:bg-[var(--feed-reaction-hover-bg)] dark:hover:bg-[var(--feed-reaction-hover-bg)]"
              : "bg-transparent hover:bg-[var(--feed-reaction-hover-bg)] dark:hover:bg-[var(--feed-reaction-hover-bg)]",
            "hover:text-[var(--feed-text-body)]",
            feedEase,
            "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color5)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-reaction-bg)]",
            "active:scale-[0.99] active:opacity-95",
            "disabled:opacity-60",
          )}
          onPointerDown={(e) => {
            if (e.pointerType === "touch") {
              setReactionPickerOpen((o) => !o);
            }
          }}
        >
          <span className="_feed_inner_timeline_reaction_link inline-flex items-center gap-2 text-sm leading-[21px] font-normal text-[var(--feed-text-body)] max-[355px]:text-xs">
            {post.myReaction === "LIKE" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color5)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="shrink-0"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            ) : post.myReaction === "LOVE" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-red-500"
                aria-hidden
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                fill="none"
                viewBox="0 0 19 19"
                aria-hidden
                className="shrink-0"
              >
                <path
                  fill="var(--feed-emoji-yellow)"
                  d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
                />
                <path
                  fill="var(--feed-emoji-brown)"
                  d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
                />
                <path
                  fill="var(--html-white)"
                  d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
                />
                <path
                  fill="var(--feed-emoji-brown)"
                  d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
                />
              </svg>
            )}
            {post.myReaction === "LIKE"
              ? "Like"
              : post.myReaction === "LOVE"
                ? "Love"
                : post.myReaction === "HAHA"
                  ? "Haha"
                  : "Haha"}
          </span>
        </Button>
      </div>
      <Button
        type="button"
        variant="ghost"
        aria-expanded={commentsExpanded}
        className={cn(
          "_feed_inner_timeline_reaction_comment _feed_reaction h-12 min-h-12 flex-1 rounded-[6px] border-0 bg-transparent px-2 shadow-none outline-none",
          "hover:bg-[var(--feed-reaction-hover-bg)] dark:hover:bg-[var(--feed-reaction-hover-bg)]",
          "hover:text-[var(--feed-text-body)]",
          feedEase,
          "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color5)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-reaction-bg)]",
          "active:scale-[0.99] active:opacity-95",
        )}
        onClick={() => setCommentsExpanded((e) => !e)}
      >
        <span className="_feed_inner_timeline_reaction_link inline-flex items-center gap-2 text-sm leading-[21px] font-normal text-[var(--feed-text-body)] max-[355px]:text-xs">
          <svg
            className="_reaction_svg shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="none"
            viewBox="0 0 21 21"
            aria-hidden
          >
            <path
              stroke="var(--feed-reaction-icon-stroke)"
              d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
            />
            <path
              stroke="var(--feed-reaction-icon-stroke)"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.938 9.313h7.125M10.5 14.063h3.563"
            />
          </svg>
          Comment
        </span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "_feed_inner_timeline_reaction_share _feed_reaction h-12 min-h-12 flex-1 rounded-[6px] border-0 bg-transparent px-2 shadow-none outline-none",
          "hover:bg-[var(--feed-reaction-hover-bg)] dark:hover:bg-[var(--feed-reaction-hover-bg)]",
          "hover:text-[var(--feed-text-body)]",
          feedEase,
          "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color5)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-reaction-bg)]",
          "active:scale-[0.99] active:opacity-95",
        )}
      >
        <span className="_feed_inner_timeline_reaction_link inline-flex items-center gap-2 text-sm leading-[21px] font-normal text-[var(--feed-text-body)] max-[355px]:text-xs">
          <svg
            className="_reaction_svg shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="21"
            fill="none"
            viewBox="0 0 24 21"
            aria-hidden
          >
            <path
              stroke="var(--feed-reaction-icon-stroke)"
              strokeLinejoin="round"
              d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
            />
          </svg>
          Share
        </span>
      </Button>
    </div>
  );
}
