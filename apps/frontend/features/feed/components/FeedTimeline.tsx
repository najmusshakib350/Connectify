"use client"

import type { RefObject } from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"
import type { FeedPostItem } from "@/features/feed/api/posts.api"
import { useFeedPostsInfinite } from "@/features/feed/hooks/useFeedPostsInfinite"

import { FeedTimelinePost } from "./FeedTimelinePost"

function dedupePosts(pages: { posts: FeedPostItem[] }[]): FeedPostItem[] {
  const seen = new Set<string>()
  const out: FeedPostItem[] = []
  for (const page of pages) {
    for (const p of page.posts) {
      if (seen.has(p.id)) continue
      seen.add(p.id)
      out.push(p)
    }
  }
  return out
}

export function FeedTimeline({
  scrollRootRef,
}: {
  scrollRootRef?: RefObject<HTMLElement | null>
}) {
  const {
    data,
    isPending,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFeedPostsInfinite()

  const posts = useMemo(
    () => (data?.pages ? dedupePosts(data.pages) : []),
    [data?.pages]
  )

  const sentinelRef = useRef<HTMLDivElement>(null)

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (
        !entry?.isIntersecting ||
        !hasNextPage ||
        isFetchingNextPage ||
        isPending
      ) {
        return
      }
      void fetchNextPage()
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, isPending]
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const root = scrollRootRef?.current ?? null
    const obs = new IntersectionObserver(onIntersect, {
      root,
      rootMargin: "200px",
      threshold: 0,
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [onIntersect, scrollRootRef])

  if (isPending) {
    return (
      <div
        className="px-1 py-6 text-center text-sm text-[var(--feed-meta)]"
        role="status"
        aria-live="polite"
      >
        Loading posts…
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        role="alert"
      >
        {error instanceof Error ? error.message : "Could not load posts."}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <p className="px-1 py-8 text-center text-sm text-[var(--feed-meta)]">
        No posts yet. Be the first to share something.
      </p>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <FeedTimelinePost key={post.id} post={post} />
      ))}
      <div
        ref={sentinelRef}
        className="h-4 w-full shrink-0"
        aria-hidden
      />
      {isFetchingNextPage ? (
        <p
          className={cn(
            "py-4 text-center text-sm text-[var(--feed-meta)]",
            "motion-safe:animate-pulse"
          )}
          role="status"
          aria-live="polite"
        >
          Loading more…
        </p>
      ) : null}
    </>
  )
}
