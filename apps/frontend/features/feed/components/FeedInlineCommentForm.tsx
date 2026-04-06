"use client";

import * as React from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";

import { Alert, useAlert } from "@/components/ui/alerts/Alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  FEED_COMMENT_ALERT_STACK_CLASS,
  postCommentsQueryKey,
} from "./FeedPostCommentsSection";

const feedEase =
  "transition-[background-color,color,opacity,transform,box-shadow] duration-200 ease-in-out";

const timelineInlineCommentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, { message: "Write something before posting" })
    .max(8000, { message: "Comment is too long" }),
});

type TimelineInlineCommentValues = z.infer<typeof timelineInlineCommentSchema>;

function feedApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (base && base.length > 0) {
    return base.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

async function postCommentRequest(
  accessToken: string,
  postId: string,
  content: string,
): Promise<void> {
  const url = `${feedApiBaseUrl()}/posts/${encodeURIComponent(postId)}/comments`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    let msg = res.statusText || "Could not post comment";
    if (body && typeof body === "object") {
      const o = body as { message?: unknown };
      if (typeof o.message === "string" && o.message.length > 0) {
        msg = o.message;
      } else if (Array.isArray(o.message)) {
        const first = o.message[0];
        if (
          first &&
          typeof first === "object" &&
          "constraints" in first &&
          typeof (first as { constraints?: unknown }).constraints === "object"
        ) {
          const c = (first as { constraints: Record<string, string> })
            .constraints;
          const v = Object.values(c)[0];
          if (typeof v === "string") msg = v;
        }
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
  const data = (body as { data?: unknown }).data;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from server");
  }
}


const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    data-slot="textarea"
    className={cn(
      "_comment_textarea form-control flex min-h-[22px] w-full min-w-0 cursor-text rounded-none border-0 border-transparent bg-transparent text-sm shadow-none",
      "!outline-none focus:!outline-none focus-visible:!outline-none",
      "focus:border-0 focus:border-transparent focus:bg-transparent focus:shadow-none focus:ring-0 focus:ring-offset-0",
      "focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
      "max-h-24 resize-none px-0 py-1 leading-normal font-normal [field-sizing:content] sm:py-1.5",
      "text-[var(--feed-text-primary)]",
      "placeholder:text-[var(--feed-comment-placeholder)] placeholder:text-sm placeholder:font-normal",
      "dark:focus:text-[var(--bg2)]",
      "aria-invalid:border-0 aria-invalid:ring-0 aria-invalid:outline-none",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      feedEase,
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/** Shadcn-style Avatar. */
function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-7 shrink-0 overflow-hidden rounded-full sm:size-8",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  alt,
}: {
  className?: string;
  src: string;
  alt: string;
}) {
  return (
    <Image
      data-slot="avatar-image"
      src={src}
      alt={alt}
      width={32}
      height={32}
      sizes="32px"
      className={cn(
        "_comment_img aspect-square h-full w-full object-cover",
        className,
      )}
    />
  );
}

function FeedInlineCommentFormInner({
  id,
  postId,
}: {
  id: string;
  postId: string;
}) {
  const queryClient = useQueryClient();
  const { showError } = useAlert();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const form = useForm<TimelineInlineCommentValues>({
    resolver: zodResolver(timelineInlineCommentSchema),
    defaultValues: { comment: "" },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (comment: string) => {
      if (!accessToken) {
        throw new Error("You must be signed in to comment.");
      }
      return postCommentRequest(accessToken, postId, comment);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: postCommentsQueryKey(postId),
      });
      form.reset({ comment: "" });
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const commentValue = useWatch({
    control: form.control,
    name: "comment",
    defaultValue: "",
  });
  const trimmedLen = (commentValue ?? "").trim().length;
  const commentField = form.register("comment");

  return (
    <form
      onSubmit={form.handleSubmit((values) => {
        mutation.reset();
        mutation.mutate(values.comment);
      })}
      noValidate
      className="w-full min-w-0"
    >
      <div
        className={cn(
          "_feed_inner_comment_box_form _feed_inline_comment_pill",
          "flex w-full min-w-0 items-center gap-1.5 rounded-full border-0",
          "bg-[var(--bg1)] px-2.5 py-1.5 shadow-none sm:gap-2 sm:px-3 sm:py-2",
          "dark:bg-[var(--bg6)]",
          feedEase,
        )}
      >
        <div className="_feed_inner_comment_box_content_image shrink-0">
          <Avatar className="_feed_comment_avatar ring-0">
            <AvatarImage src="/images/comment_img.png" alt="" />
          </Avatar>
        </div>

        <div className="_feed_inner_comment_box_content_txt relative min-w-0 flex-1 self-center">
          <Textarea
            id={id}
            rows={1}
            autoComplete="off"
            placeholder="Write a comment"
            aria-invalid={Boolean(form.formState.errors.comment)}
            disabled={mutation.isPending}
            {...commentField}
            onChange={(e) => {
              commentField.onChange(e);
              mutation.reset();
            }}
          />
        </div>

        <div className="flex shrink-0 items-center pl-0.5 sm:pl-1">
          <Button
            type="submit"
            disabled={
              mutation.isPending ||
              trimmedLen === 0 ||
              !accessToken
            }
            className={cn(
              "h-8 shrink-0 rounded-full px-3 text-sm font-semibold sm:h-9 sm:px-4",
              feedEase,
            )}
          >
            {mutation.isPending ? "Posting…" : "Post"}
          </Button>
        </div>
      </div>
      {form.formState.errors.comment ? (
        <p className="mt-1.5 m-0 px-1 text-xs text-red-600 dark:text-red-400">
          {form.formState.errors.comment.message}
        </p>
      ) : null}
    </form>
  );
}

export function FeedInlineCommentForm({
  id,
  postId,
}: {
  id: string;
  postId: string;
}) {
  return (
    <Alert stackClassName={FEED_COMMENT_ALERT_STACK_CLASS}>
      <FeedInlineCommentFormInner id={id} postId={postId} />
    </Alert>
  );
}
