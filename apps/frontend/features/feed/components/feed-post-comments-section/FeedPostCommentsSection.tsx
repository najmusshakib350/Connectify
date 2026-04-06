"use client";

import { Alert } from "@/components/ui/alerts/Alert";

import { FEED_COMMENT_ALERT_STACK_CLASS } from "./constants";
import { FeedPostCommentsSectionInner } from "./FeedPostCommentsSectionInner";

export function FeedPostCommentsSection(props: {
  postId: string;
  commentCount: number;
  expanded: boolean;
  onExpandedChange: (next: boolean) => void;
}) {
  return (
    <Alert stackClassName={FEED_COMMENT_ALERT_STACK_CLASS}>
      <FeedPostCommentsSectionInner {...props} />
    </Alert>
  );
}
