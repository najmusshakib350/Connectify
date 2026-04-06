"use client";

import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

import { Button } from "@/components/ui/button";
import type { FeedTimelinePostData } from "@/features/feed/types/feed";
import { formatFeedPostTime } from "@/features/feed/utils/format-feed-post-time";
import { cn } from "@/lib/utils";

import { DEFAULT_AVATAR, dropdownItems, feedEase } from "./constants";

export function FeedTimelinePostHeader({
  post,
  menuOpen,
  setMenuOpen,
  menuRef,
  menuId,
}: {
  post: FeedTimelinePostData;
  menuOpen: boolean;
  setMenuOpen: (next: boolean | ((prev: boolean) => boolean)) => void;
  menuRef: RefObject<HTMLDivElement | null>;
  menuId: string;
}) {
  const avatarSrc = post.author.avatar ?? DEFAULT_AVATAR;
  const timeLabel = formatFeedPostTime(post.createdAt);
  const visibilityLabel =
    post.visibility === "public" ? "Public" : "Private";

  return (
    <div className="_feed_inner_timeline_post_top mb-4 flex items-center justify-between">
      <Button
        type="button"
        variant="ghost"
        className={cn(
          "group/header _feed_inner_timeline_post_box h-auto min-h-0 w-fit cursor-pointer justify-start gap-0 rounded-[6px] p-0 text-left outline-none",
          "hover:bg-transparent dark:hover:bg-transparent",
          "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-0",
          "active:opacity-90",
        )}
      >
        <div className="_feed_inner_timeline_post_box_image mr-4 shrink-0">
          <Image
            src={avatarSrc}
            alt=""
            width={44}
            height={44}
            className="_post_img size-11 max-w-11 rounded-full object-cover hover:opacity-70"
            sizes="44px"
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt min-w-0 text-left">
          <h4
            className={cn(
              "_feed_inner_timeline_post_box_title m-0 text-base leading-[1.1] font-normal text-[var(--feed-text-body)]",
              feedEase,
              "group-hover/header:underline",
            )}
          >
            {post.author.name}
          </h4>
          <p className="_feed_inner_timeline_post_box_para m-0 text-sm leading-[1.2] font-normal text-[var(--feed-meta)]">
            {timeLabel}
            {timeLabel ? " · " : null}
            <Link
              href="#0"
              className={cn(
                "text-inherit underline-offset-2",
                feedEase,
                "hover:underline",
                "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                "active:opacity-80",
              )}
            >
              {visibilityLabel}
            </Link>
          </p>
        </div>
      </Button>
      <div
        ref={menuRef}
        className="_feed_inner_timeline_post_box_dropdown relative shrink-0"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          id={`${menuId}-trigger`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? `${menuId}-menu` : undefined}
          className={cn(
            "group/menu-trigger _feed_timeline_post_dropdown_link h-auto rounded-[6px] py-1 pr-px pl-px !outline-none",
            "hover:bg-transparent dark:hover:bg-transparent",
            "focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
            "active:scale-[0.98] active:opacity-80",
          )}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="4"
            height="17"
            fill="none"
            viewBox="0 0 4 17"
            aria-hidden
          >
            <circle
              className="fill-[var(--color3)] transition-opacity group-hover/menu-trigger:opacity-80"
              cx="2"
              cy="2"
              r="2"
            />
            <circle
              className="fill-[var(--color3)] transition-opacity group-hover/menu-trigger:opacity-80"
              cx="2"
              cy="8"
              r="2"
            />
            <circle
              className="fill-[var(--color3)] transition-opacity group-hover/menu-trigger:opacity-80"
              cx="2"
              cy="15"
              r="2"
            />
          </svg>
        </Button>
        <div
          role="menu"
          id={`${menuId}-menu`}
          aria-labelledby={`${menuId}-trigger`}
          aria-hidden={!menuOpen}
          className={cn(
            "_feed_timeline_dropdown _timeline_dropdown absolute top-0 right-0 z-50 min-w-[min(312px,calc(100vw-2rem))] translate-y-10 rounded-[6px] bg-[var(--feed-surface-elevated)] p-4 shadow-[var(--feed-shadow-popover)] sm:min-w-[312px]",
            feedEase,
            menuOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0",
          )}
        >
          <ul className="_feed_timeline_dropdown_list m-0 list-none p-0">
            {dropdownItems.map((item) => (
              <li
                key={item.label}
                className="_feed_timeline_dropdown_item mb-4 last:mb-0"
              >
                <Button
                  asChild
                  variant="ghost"
                  className="h-auto w-full min-w-0 justify-start p-0 hover:bg-transparent dark:hover:bg-transparent"
                >
                  <Link
                    href={item.href}
                    role="menuitem"
                    className={cn(
                      "_feed_timeline_dropdown_link flex w-full items-center text-left text-base leading-[1.2] font-medium text-[var(--feed-dropdown-link-text)] no-underline",
                      feedEase,
                      "hover:text-[var(--color5)]",
                      "rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                      "active:opacity-90",
                    )}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mr-2 inline-flex shrink-0 rounded-full bg-[var(--feed-timeline-dropdown-icon-bg)] p-2.5 [&>svg]:block">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
