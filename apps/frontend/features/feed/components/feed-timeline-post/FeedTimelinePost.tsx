"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { Card } from "@/components/ui/card";
import { resolvePostMediaUrl } from "@/features/feed/api/posts.api";
import type { FeedTimelinePostData } from "@/features/feed/types/feed";
import { cn } from "@/lib/utils";

import { FeedInlineCommentForm } from "../FeedInlineCommentForm";
import { FeedPostCommentsSection } from "../FeedPostCommentsSection";
import { feedEase } from "./constants";
import { FeedTimelinePostBody } from "./FeedTimelinePostBody";
import { FeedTimelinePostHeader } from "./FeedTimelinePostHeader";
import { FeedTimelinePostReactionBar } from "./FeedTimelinePostReactionBar";
import { FeedTimelinePostStatsRow } from "./FeedTimelinePostStatsRow";
import { asPostWithReactions } from "./reaction-model";
import { useFeedTimelinePostReactionMutation } from "./use-feed-timeline-post-reaction-mutation";

export function FeedTimelinePost({ post: postProp }: { post: FeedTimelinePostData }) {
  const post = asPostWithReactions(postProp);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const reactionMutation = useFeedTimelinePostReactionMutation(post, accessToken);

  const imageSrc = resolvePostMediaUrl(post.imageUrl);
  const postReactions = asPostWithReactions(post);
  const totalReactions = Math.max(
    0,
    postReactions.reactionCounts
      ? postReactions.reactionCounts.LIKE +
        postReactions.reactionCounts.HAHA +
        postReactions.reactionCounts.LOVE
      : post.likeCount,
  );
  const reactionCountLabel =
    totalReactions > 99 ? "99+" : String(totalReactions);

  useEffect(() => {
    if (!reactionPickerOpen) return;
    function onDocPointerDown(e: PointerEvent) {
      const el = reactionPickerRef.current;
      if (el && !el.contains(e.target as Node)) {
        setReactionPickerOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [reactionPickerOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onDocMouseDown(e: MouseEvent) {
      const el = menuRef.current;
      if (el && !el.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <Card
      className={cn(
        "_feed_inner_timeline_post_area _b_radious6 _mar_b16 mb-4 gap-0 rounded-[6px] border-0 bg-[var(--feed-surface-elevated)] py-0 shadow-none",
        feedEase,
      )}
    >
      <div className="flex flex-col pt-6 pb-6">
        <div className="_feed_inner_timeline_content px-6">
          <FeedTimelinePostHeader
            post={post}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            menuRef={menuRef}
            menuId={menuId}
          />
          <FeedTimelinePostBody text={post.text} imageSrc={imageSrc} />
        </div>

        <FeedTimelinePostStatsRow
          totalReactions={totalReactions}
          reactionCountLabel={reactionCountLabel}
          commentCount={post.commentCount}
          commentsExpanded={commentsExpanded}
          onToggleComments={() => setCommentsExpanded((e) => !e)}
        />

        <FeedTimelinePostReactionBar
          post={postReactions}
          reactionMutation={reactionMutation}
          reactionPickerOpen={reactionPickerOpen}
          setReactionPickerOpen={setReactionPickerOpen}
          reactionPickerRef={reactionPickerRef}
          accessToken={accessToken}
          commentsExpanded={commentsExpanded}
          setCommentsExpanded={setCommentsExpanded}
        />

        <div className="_feed_inner_timeline_cooment_area px-6 pt-6 pb-2.5">
          <div className="_feed_inner_comment_box rounded-[18px] bg-[var(--html-surface-muted)] dark:bg-[var(--bg6)]">
            <FeedInlineCommentForm
              id={`timeline-${post.id}-composer`}
              postId={post.id}
            />
          </div>
        </div>

        <FeedPostCommentsSection
          postId={post.id}
          commentCount={post.commentCount}
          expanded={commentsExpanded}
          onExpandedChange={setCommentsExpanded}
        />
      </div>
    </Card>
  );
}
