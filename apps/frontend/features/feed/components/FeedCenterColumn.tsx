"use client"

import { useRef } from "react"

import { FeedComposer } from "./FeedComposer"
import { FeedStoriesDesktop, FeedStoriesMobile } from "./FeedStoriesSection"
import { FeedTimeline } from "./FeedTimeline"

export function FeedCenterColumn() {
  const scrollRootRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRootRef}
      className="_layout_middle_wrap flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-lg:h-full lg:h-[calc(100vh-75px)] pt-2.5"
    >
      <div className="_layout_middle_inner flex min-h-0 h-full w-full flex-1 flex-col px-0 pt-[18px] pb-[68px] lg:h-[calc(100vh-108px)] lg:pt-2 lg:pb-0">
        <FeedStoriesDesktop />
        <FeedStoriesMobile />
        <FeedComposer />
        <div role="feed" aria-label="Timeline">
          <FeedTimeline scrollRootRef={scrollRootRef} />
        </div>
      </div>
    </div>
  )
}
