"use client";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import type { FeedPostsPageData } from "@/features/feed/api/posts.api";
import { feedPostsInfiniteQueryKey } from "@/features/feed/query-keys";
import type { FeedTimelinePostData } from "@/features/feed/types/feed";

import {
  asPostWithReactions,
  optimisticallyReact,
  patchPostFromSummary,
  putPostReaction,
  type PostReactionType,
  updatePostInInfiniteCache,
} from "./reaction-model";

export function useFeedTimelinePostReactionMutation(
  post: FeedTimelinePostData,
  accessToken: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reaction: PostReactionType) => {
      if (!accessToken) {
        throw new Error("You must be signed in to react.");
      }
      return putPostReaction(accessToken, post.id, reaction);
    },
    onMutate: async (reaction) => {
      await queryClient.cancelQueries({ queryKey: feedPostsInfiniteQueryKey });
      const previous =
        queryClient.getQueryData<InfiniteData<FeedPostsPageData>>(
          feedPostsInfiniteQueryKey,
        );
      queryClient.setQueryData<InfiniteData<FeedPostsPageData>>(
        feedPostsInfiniteQueryKey,
        (old) =>
          updatePostInInfiniteCache(old, post.id, (p) =>
            optimisticallyReact(asPostWithReactions(p), reaction),
          ),
      );
      return { previous };
    },
    onError: (_err, _reaction, context) => {
      if (context?.previous) {
        queryClient.setQueryData(feedPostsInfiniteQueryKey, context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<FeedPostsPageData>>(
        feedPostsInfiniteQueryKey,
        (old) =>
          updatePostInInfiniteCache(old, post.id, (p) =>
            patchPostFromSummary(p, data),
          ),
      );
    },
  });
}
