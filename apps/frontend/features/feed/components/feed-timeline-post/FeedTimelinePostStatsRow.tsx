"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeedTimelinePostStatsRow({
  totalReactions,
  reactionCountLabel,
  commentCount,
  commentsExpanded,
  onToggleComments,
}: {
  totalReactions: number;
  reactionCountLabel: string;
  commentCount: number;
  commentsExpanded: boolean;
  onToggleComments: () => void;
}) {
  return (
    <div className="_feed_inner_timeline_total_reacts _mar_b26 mb-[26px] flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-6">
      <div className="_feed_inner_timeline_total_reacts_image flex min-w-0 max-w-full cursor-pointer items-center">
        <div className="flex shrink-0 items-center">
          <Image
            src="/images/react_img1.png"
            alt=""
            width={32}
            height={32}
            className="_react_img1 z-[5] size-8 max-w-8 rounded-[40px] border border-[var(--feed-avatar-pile-border)] bg-[var(--feed-react-pile-bg)] object-cover dark:border-2"
          />
          <Image
            src="/images/react_img2.png"
            alt=""
            width={32}
            height={32}
            className="_react_img z-[4] -ml-4 size-8 max-w-8 rounded-[40px] border border-[var(--feed-avatar-pile-border)] bg-[var(--feed-react-pile-bg)] object-cover"
          />
          <Image
            src="/images/react_img3.png"
            alt=""
            width={32}
            height={32}
            className="_react_img _rect_img_mbl_none z-[3] -ml-4 hidden size-8 max-w-8 rounded-[40px] border border-[var(--feed-avatar-pile-border)] bg-[var(--feed-react-pile-bg)] object-cover min-[576px]:block"
          />
          <Image
            src="/images/react_img4.png"
            alt=""
            width={32}
            height={32}
            className="_react_img _rect_img_mbl_none z-[2] -ml-4 hidden size-8 max-w-8 rounded-[40px] border border-[var(--feed-avatar-pile-border)] bg-[var(--feed-react-pile-bg)] object-cover min-[576px]:block"
          />
          <Image
            src="/images/react_img5.png"
            alt=""
            width={32}
            height={32}
            className="_react_img _rect_img_mbl_none z-[1] -ml-4 hidden size-8 max-w-8 rounded-[40px] border border-[var(--feed-avatar-pile-border)] bg-[var(--feed-react-pile-bg)] object-cover min-[576px]:block"
          />
        </div>
        <span
          className="_feed_inner_timeline_total_reacts_count ml-3 shrink-0 text-sm leading-[21px] font-semibold tabular-nums text-red-600 dark:text-red-400"
          aria-label={`${totalReactions} reactions`}
        >
          {reactionCountLabel}
        </span>
      </div>
      <div className="_feed_inner_timeline_total_reacts_txt flex">
        <Button
          type="button"
          variant="ghost"
          aria-expanded={commentsExpanded}
          className={cn(
            "_feed_inner_timeline_total_reacts_para1 m-0 mr-4 h-auto min-h-0 rounded-[6px] p-0 text-sm leading-[1.2] font-normal not-italic text-[var(--feed-meta)] shadow-none",
            "hover:bg-transparent hover:underline dark:hover:bg-transparent",
            "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
          )}
          onClick={onToggleComments}
        >
          <span className="text-[var(--feed-stat-emphasis)]">
            {commentCount}
          </span>{" "}
          {commentCount === 1 ? "Comment" : "Comments"}
        </Button>
        <p className="_feed_inner_timeline_total_reacts_para2 m-0 text-sm leading-[1.2] font-normal not-italic text-[var(--feed-meta)]">
          <span className="text-[var(--feed-stat-emphasis)]">122</span> Share
        </p>
      </div>
    </div>
  );
}
