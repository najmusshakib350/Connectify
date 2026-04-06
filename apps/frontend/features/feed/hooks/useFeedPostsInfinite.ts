import { useInfiniteQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import {
  FEED_POSTS_PAGE_SIZE,
  fetchPostsPage,
  type FeedPostsPageData,
} from "@/features/feed/api/posts.api"
import { feedPostsInfiniteQueryKey } from "@/features/feed/query-keys"

export function useFeedPostsInfinite() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  return useInfiniteQuery({
    queryKey: feedPostsInfiniteQueryKey,
    queryFn: async ({ pageParam }): Promise<FeedPostsPageData> => {
      if (!accessToken) {
        throw new Error("You must be signed in to view the feed.")
      }
      return fetchPostsPage(accessToken, {
        cursor: pageParam,
        limit: FEED_POSTS_PAGE_SIZE,
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor && lastPage.nextCursor.length > 0
        ? lastPage.nextCursor
        : undefined,
    enabled: status !== "loading" && !!accessToken,
    staleTime: 60 * 1000,
  })
}
