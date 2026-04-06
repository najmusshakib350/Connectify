"use client"

import { Button } from "@/components/ui/button"
import { useFeedTheme } from "@/components/providers/ThemeProvider"
import { cn } from "@/lib/utils"

export function FeedModeSwitch() {
  const { theme, toggleTheme } = useFeedTheme()
  const isDark = theme === "dark"

  return (
    <div className="fixed top-1/2 right-0 z-[1] max-md:hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer max-[1540px]:-right-[50px]">
      <Button
        type="button"
        variant="ghost"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggleTheme}
        className="relative flex h-8 min-h-0 w-[66px] cursor-pointer rotate-90 items-center justify-center rounded-[40px] border border-[var(--color5)] bg-[var(--color5)] p-0 shadow-none hover:bg-[var(--color5)] dark:border-[var(--bg6)] dark:bg-[var(--bg6)] dark:hover:bg-[var(--bg6)]"
      >
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 transition-[left] duration-200 ease-in-out",
            isDark ? "left-[calc(100%-28px)]" : "left-[10px]"
          )}
        >
          <span
            className={cn(
              "block size-[18px] rounded-full",
              isDark ? "bg-[var(--color5)]" : "bg-[var(--bg2)]"
            )}
          />
        </span>
        <span
          className={cn(
            "-rotate-90 transition-opacity duration-200",
            isDark
              ? "pointer-events-none absolute right-4 opacity-0"
              : "absolute right-4 opacity-100"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="16"
            fill="none"
            viewBox="0 0 11 16"
            aria-hidden
          >
            <path
              fill="var(--html-white)"
              d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z"
            />
          </svg>
        </span>
        <span
          className={cn(
            "-rotate-90 transition-opacity duration-200",
            isDark
              ? "absolute left-2 opacity-100"
              : "pointer-events-none absolute left-2 opacity-0"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="4.389"
              stroke="var(--html-white)"
              transform="rotate(-90 12 12)"
            />
            <path
              stroke="var(--html-white)"
              strokeLinecap="round"
              d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05"
            />
          </svg>
        </span>
      </Button>
    </div>
  )
}
