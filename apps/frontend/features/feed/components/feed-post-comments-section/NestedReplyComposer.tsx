"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  postCommentRepliesQueryKey,
  postCommentsQueryKey,
  postReplyRequest,
} from "./api";
import { feedEase } from "./constants";

export function NestedReplyComposer({
  postId,
  commentId,
  accessToken,
  parentReplyId,
  onPosted,
  onError,
}: {
  postId: string;
  commentId: string;
  accessToken: string;
  parentReplyId?: string;
  onPosted: () => void;
  onError: (msg: string) => void;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const mutation = useMutation({
    mutationFn: (content: string) =>
      postReplyRequest(accessToken, postId, commentId, content, parentReplyId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: postCommentRepliesQueryKey(postId, commentId),
      });
      await queryClient.invalidateQueries({
        queryKey: postCommentsQueryKey(postId),
      });
      setDraft("");
      onPosted();
    },
    onError: (err) => {
      onError((err as Error).message);
    },
  });

  const trimmed = draft.trim();
  const canSubmit =
    trimmed.length > 0 && trimmed.length <= 8000 && !mutation.isPending;

  return (
    <div className="mt-2 flex gap-2">
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-[var(--feed-border-subtle)]">
        <Image
          src="/images/comment_img.png"
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      </div>
      <form
        className="flex min-w-0 flex-1 items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          mutation.mutate(trimmed);
        }}
      >
        <div
          className={cn(
            "flex min-h-9 min-w-0 flex-1 items-center rounded-full px-3 py-1.5",
            "bg-[var(--html-surface-muted)] dark:bg-[var(--bg6)]",
            feedEase,
          )}
        >
          <input
            type="text"
            value={draft}
            disabled={mutation.isPending}
            onChange={(e) => {
              setDraft(e.target.value);
              mutation.reset();
            }}
            placeholder="Write a comment"
            className={cn(
              "m-0 w-full min-w-0 border-0 bg-transparent p-0 text-sm leading-normal font-normal text-[var(--feed-text-primary)] outline-none",
              "placeholder:text-[var(--feed-comment-placeholder)] placeholder:font-normal",
              feedEase,
            )}
            aria-label="Write a reply"
          />
        </div>
        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "h-8 shrink-0 rounded-full px-3 text-sm font-semibold",
            feedEase,
          )}
        >
          {mutation.isPending ? "Posting…" : "Post"}
        </Button>
      </form>
    </div>
  );
}
