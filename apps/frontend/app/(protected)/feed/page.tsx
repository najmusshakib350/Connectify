import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/features/auth/api/auth-options"
import {
  FEED_POSTS_PAGE_SIZE,
  fetchPostsPage,
  type FeedPostsPageData,
} from "@/features/feed/api/posts.api"
import { FeedShell } from "@/features/feed/components/FeedShell"
import { feedPostsInfiniteQueryKey } from "@/features/feed/query-keys"

export default async function FeedPage() {
  const queryClient = new QueryClient()
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  if (token) {
    await queryClient.prefetchInfiniteQuery({
      queryKey: feedPostsInfiniteQueryKey,
      queryFn: ({ pageParam }) =>
        fetchPostsPage(token, {
          cursor: pageParam,
          limit: FEED_POSTS_PAGE_SIZE,
        }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage: FeedPostsPageData) =>
        lastPage.nextCursor && lastPage.nextCursor.length > 0
          ? lastPage.nextCursor
          : undefined,
    })
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedShell />
    </HydrationBoundary>
  )
}
