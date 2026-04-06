"use client"

import Image from "next/image"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function FeedHeaderMobile() {
  return (
    <header className="fixed top-0 right-0 left-0 z-[1030] block bg-[var(--bg2)] px-4 pt-4 pb-0 lg:hidden dark:bg-[var(--bg5)]">
      <div className="mb-4 flex min-h-0 items-center justify-between">
        <div className="flex min-w-0 shrink-0 items-center">
          <Link href="/feed" className="inline-flex max-w-[169px]">
            <Image
              src="/images/logo.svg"
              alt="Buddy Script"
              width={169}
              height={48}
              className="h-auto w-full max-w-[169px]"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <form className="relative m-0">
            <Link
              href="#0"
              className="block cursor-pointer leading-none"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                fill="none"
                viewBox="0 0 17 17"
                aria-hidden
              >
                <circle
                  cx="7"
                  cy="7"
                  r="6"
                  className="stroke-[var(--color7)] dark:stroke-[var(--color5)]"
                />
                <path
                  className="stroke-[var(--color7)] dark:stroke-[var(--color5)]"
                  strokeLinecap="round"
                  d="M16 16l-3-3"
                />
              </svg>
            </Link>
          </form>
          <button
            type="button"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent leading-none text-[var(--html-blue-alt)] outline-none ring-offset-2 ring-offset-[var(--bg2)] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 dark:text-[var(--html-dark-blue)] dark:ring-offset-[var(--bg5)]"
            aria-label="Log out"
            onClick={() => void signOut({ callbackUrl: "/login" })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              fill="none"
              viewBox="0 0 19 19"
              aria-hidden
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667"
              />
            </svg>
          </button>
          <Link
            href="#0"
            className="size-10 shrink-0 overflow-hidden rounded-full leading-none outline-none ring-offset-2 ring-offset-[var(--bg2)] focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 dark:ring-offset-[var(--bg5)]"
            aria-label="Profile"
          >
            <Image
              src="/images/profile.png"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
