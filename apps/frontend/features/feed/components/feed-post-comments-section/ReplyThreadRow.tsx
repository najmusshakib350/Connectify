"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatFeedPostTime } from "@/features/feed/utils/format-feed-post-time";
import { cn } from "@/lib/utils";

import { commentActionClass, DEFAULT_AVATAR } from "./constants";
import { NestedReplyComposer } from "./NestedReplyComposer";
import type { ReplyNode } from "./types";

export function ReplyThreadRow({
  postId,
  commentId,
  node,
  depth,
  accessToken,
  showError,
}: {
  postId: string;
  commentId: string;
  node: ReplyNode;
  depth: number;
  accessToken: string;
  showError: (msg: string) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const avatarSrc = DEFAULT_AVATAR;
  const timeLabel = formatFeedPostTime(node.reply.createdAt);

  return (
    <div className={cn(depth > 0 && "mt-3")}>
      <div className="flex gap-2">
        <div className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-full border border-[var(--feed-border-subtle)]">
          <Button
            asChild
            variant="ghost"
            className="size-8 rounded-full p-0 hover:bg-transparent dark:hover:bg-transparent"
          >
            <Link
              href="#0"
              className="block size-full rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]"
              aria-label={`${node.reply.author.name} profile`}
            >
              <Image
                src={avatarSrc}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full object-cover"
              />
            </Link>
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "relative mb-2 w-full max-w-fit rounded-[18px] px-3 py-2.5",
              "bg-[var(--html-surface-muted)] dark:bg-[var(--bg6)]",
            )}
          >
            <div className="mb-1">
              <Link
                href="#0"
                className={cn(
                  "inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--html-surface-muted)] dark:focus-visible:ring-offset-[var(--bg6)]",
                  "active:opacity-90",
                )}
              >
                <span className="text-sm font-semibold text-[var(--feed-text-primary)]">
                  {node.reply.author.name}
                </span>
              </Link>
            </div>
            <p className="m-0 break-all text-sm leading-[1.2] font-normal text-[var(--feed-text-secondary)] dark:opacity-80">
              <span className="whitespace-pre-wrap">{node.reply.content}</span>
            </p>
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
          {replyOpen ? (
            <NestedReplyComposer
              postId={postId}
              commentId={commentId}
              accessToken={accessToken}
              parentReplyId={node.reply.id}
              onPosted={() => setReplyOpen(false)}
              onError={showError}
            />
          ) : null}
          {node.children.length > 0 ? (
            <div className="mt-1 border-l border-[var(--feed-border-subtle)] pl-3">
              {node.children.map((child) => (
                <ReplyThreadRow
                  key={child.reply.id}
                  postId={postId}
                  commentId={commentId}
                  node={child}
                  depth={depth + 1}
                  accessToken={accessToken}
                  showError={showError}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
