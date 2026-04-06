import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const storyEase = "duration-200 ease-in-out"

const cardFocusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-page-bg)]"

const mobileStoryPressable = cn(
  "h-auto p-0 hover:bg-transparent dark:hover:bg-transparent",
  storyEase,
  "hover:opacity-95 active:opacity-90"
)

const feedStoryShadow = "shadow-[var(--feed-shadow-card)]"

export function FeedStoriesDesktop() {
  return (
    <div className="_feed_inner_ppl_card _mar_b16 relative mb-4 hidden min-[992px]:block">
      <div className="_feed_inner_story_arrow pointer-events-none absolute top-1/2 right-[-5px] z-[18] -translate-y-1/2">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "_feed_inner_story_arrow_btn pointer-events-auto flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full border border-solid border-[var(--bg1)] bg-[var(--color5)] p-0 px-[7px] shadow-none transition-all",
            storyEase,
            "hover:bg-[var(--html-blue-deep)] active:scale-95 active:brightness-95",
            "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-page-bg)]"
          )}
          aria-label="Scroll stories"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="8"
            fill="none"
            viewBox="0 0 9 8"
            className="[-mt-0.5] shrink-0"
            aria-hidden
          >
            <path
              fill="var(--html-white)"
              d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
            />
          </svg>
        </Button>
      </div>
      <div className="grid w-full grid-cols-4 gap-4">
        <div className="min-w-0">
          <div
            className={cn(
              "_feed_inner_profile_story _b_radious6 group/prof relative cursor-pointer overflow-hidden rounded-md transition-all",
              storyEase,
              feedStoryShadow
            )}
          >
            <div
              className={cn(
                "_feed_inner_profile_story_image relative z-[2] overflow-hidden rounded-md",
                "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-md before:bg-[var(--html-black)] before:opacity-50"
              )}
            >
              <Image
                src="/images/card_ppl1.png"
                alt=""
                width={200}
                height={280}
                className="_profile_story_img relative z-0 block h-auto w-full rounded-md"
                sizes="(min-width: 992px) 25vw, 50vw"
              />
              <div className="_feed_inner_story_txt absolute inset-x-0 bottom-0 z-[2] rounded-[25.5px_25.5px_6px_6px] bg-[var(--feed-story-caption-bg)] pt-[30px]">
                <div className="_feed_inner_story_btn absolute -top-3 left-1/2 z-[5] -translate-x-1/2">
                  <Button
                    type="button"
                    size="icon-sm"
                    className={cn(
                      "_feed_inner_story_btn_link relative z-[5] size-8 min-h-8 min-w-8 rounded-full border-2 border-[#112032] bg-[var(--color5)] p-0 shadow-none transition-all dark:border-[var(--feed-story-caption-bg)]",
                      storyEase,
                      "hover:bg-[var(--html-blue-deep)] active:scale-95",
                      "focus-visible:ring-2 focus-visible:ring-[var(--html-white)]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-story-caption-bg)]"
                    )}
                    aria-label="Add to your story"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 10 10"
                      aria-hidden
                    >
                      <path
                        stroke="var(--html-white)"
                        strokeLinecap="round"
                        d="M.5 4.884h9M4.884 9.5v-9"
                      />
                    </svg>
                  </Button>
                </div>
                <p className="_feed_inner_story_para relative z-[2] m-0 mb-2.5 text-center text-xs font-medium leading-[19px] text-[var(--html-white)]">
                  Your Story
                </p>
              </div>
            </div>
          </div>
        </div>
        {(["card_ppl2", "card_ppl3", "card_ppl4"] as const).map((src) => (
          <div key={src} className="min-w-0">
            <Button
              asChild
              variant="ghost"
              className="h-auto w-full min-w-0 p-0 hover:bg-transparent dark:hover:bg-transparent"
            >
              <Link
                href="#0"
                className={cn(
                  "_feed_inner_public_story group/pub _b_radious6 block cursor-pointer overflow-hidden rounded-md text-left transition-all",
                  storyEase,
                  feedStoryShadow,
                  "hover:bg-transparent focus-visible:bg-transparent",
                  cardFocusRing,
                  "active:brightness-[0.99]"
                )}
              >
                <div
                  className={cn(
                    "_feed_inner_public_story_image relative z-[2] overflow-hidden rounded-md",
                    "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-md before:bg-[var(--html-black)] before:opacity-50 before:transition-opacity before:duration-200 before:ease-in-out",
                    "group-hover/pub:before:opacity-70 group-focus-visible/pub:before:opacity-70"
                  )}
                >
                  <Image
                    src={`/images/${src}.png`}
                    alt=""
                    width={200}
                    height={280}
                    className="_public_story_img relative z-0 block h-auto w-full rounded-md"
                    sizes="(min-width: 992px) 25vw, 50vw"
                  />
                  <div className="_feed_inner_pulic_story_txt pointer-events-none absolute inset-x-0 bottom-0 z-[2]">
                    <p className="_feed_inner_pulic_story_para m-0 mb-2.5 text-center text-xs font-medium leading-[19px] text-[var(--html-white)]">
                      Ryan Roslansky
                    </p>
                  </div>
                  <div className="_feed_inner_public_mini absolute top-3 right-3 z-[3] size-7 overflow-hidden rounded-full border-2 border-[var(--bg2)] bg-[var(--color3)]">
                    <Image
                      src="/images/mini_pic.png"
                      alt=""
                      width={28}
                      height={28}
                      className="_public_mini_img size-full max-h-7 max-w-7 rounded-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

type MobileStory =
  | { kind: "yours" }
  | { kind: "active"; src: string }
  | { kind: "inactive"; src: string }
  | { kind: "plain"; src: string }

const mobileStories: MobileStory[] = [
  { kind: "yours" },
  { kind: "active", src: "mobile_story_img1.png" },
  { kind: "inactive", src: "mobile_story_img2.png" },
  { kind: "active", src: "mobile_story_img1.png" },
  { kind: "inactive", src: "mobile_story_img2.png" },
  { kind: "active", src: "mobile_story_img1.png" },
  { kind: "plain", src: "mobile_story_img.png" },
  { kind: "active", src: "mobile_story_img1.png" },
]

function MobileStoryBody({ story }: { story: MobileStory }) {
  if (story.kind === "yours") {
    return (
      <>
        <div className="relative mx-auto size-[60px]">
          <Link
            href="#0"
            className={cn(
              "relative z-0 block size-[60px] rounded-full no-underline outline-none",
              cardFocusRing
            )}
            aria-label="Open your story"
          >
            <div
              className={cn(
                "_feed_inner_ppl_card_area_story relative size-[60px]",
                "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-full before:bg-[var(--html-black)] before:opacity-50"
              )}
            >
              <Image
                src="/images/mobile_story_img.png"
                alt=""
                width={60}
                height={60}
                className="_card_story_img relative z-0 size-[60px] rounded-full object-cover"
              />
            </div>
          </Link>
          <div className="_feed_inner_ppl_btn pointer-events-none absolute top-[54%] left-[44%] z-[2] -translate-x-[44%] -translate-y-[54%]">
            <Button
              type="button"
              size="icon-xs"
              className={cn(
                "_feed_inner_ppl_btn_link pointer-events-auto flex size-6 min-h-6 min-w-6 items-center justify-center rounded-full border border-solid border-[var(--bg2)] bg-[var(--color5)] shadow-none transition-all",
                storyEase,
                "hover:bg-[var(--html-blue-deep)] active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-[var(--html-white)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-page-bg)]"
              )}
              aria-label="Add to your story"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 12 12"
                aria-hidden
              >
                <path
                  stroke="var(--html-white)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 2.5v7M2.5 6h7"
                />
              </svg>
            </Button>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className={cn("mt-3 h-auto min-h-0 w-full", mobileStoryPressable)}>
          <Link
            href="#0"
            className={cn(
              "_feed_inner_ppl_card_area_link_txt block w-full text-center text-xs leading-[1.2] font-medium text-[var(--color5)] no-underline",
              cardFocusRing
            )}
          >
            Your Story
          </Link>
        </Button>
      </>
    )
  }

  if (story.kind === "plain") {
    return (
      <>
        <div className="relative mx-auto size-[60px]">
          <div
            className={cn(
              "_feed_inner_ppl_card_area_story relative size-[60px]",
              "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-full before:bg-[var(--html-black)] before:opacity-50"
            )}
          >
            <Image
              src={`/images/${story.src}`}
              alt=""
              width={60}
              height={60}
              className="_card_story_img relative z-0 size-[60px] rounded-full object-cover"
            />
          </div>
        </div>
        <p className="_feed_inner_ppl_card_area_txt m-0 mt-3 w-[60px] max-w-[60px] overflow-hidden text-center text-xs leading-[1.2] font-medium text-ellipsis whitespace-nowrap text-[var(--feed-mobile-story-label)]">
          Ryan...
        </p>
      </>
    )
  }

  if (story.kind === "active") {
    return (
      <>
        <div className="relative mx-auto size-[60px]">
          <div
            className={cn(
              "_feed_inner_ppl_card_area_story_active relative size-[60px]",
              "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-full before:bg-gradient-to-b before:from-[rgba(17,32,50,0)] before:to-[#112032] before:opacity-50"
            )}
          >
            <Image
              src={`/images/${story.src}`}
              alt=""
              width={60}
              height={60}
              className="_card_story_img1 relative z-0 size-[60px] rounded-full border-[3px] border-solid border-[#1890FF] object-cover dark:border-[var(--color5)]"
            />
          </div>
        </div>
        <p className="_feed_inner_ppl_card_area_txt m-0 mt-3 w-[60px] max-w-[60px] overflow-hidden text-center text-xs leading-[1.2] font-medium text-ellipsis whitespace-nowrap text-[var(--feed-mobile-story-label)]">
          Ryan...
        </p>
      </>
    )
  }

  return (
    <>
      <div className="relative mx-auto size-[60px]">
        <div
          className={cn(
            "_feed_inner_ppl_card_area_story_inactive relative size-[60px]",
            "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-full before:bg-gradient-to-b before:from-[rgba(17,32,50,0)] before:to-[#112032] before:opacity-50"
          )}
        >
          <Image
            src={`/images/${story.src}`}
            alt=""
            width={60}
            height={60}
            className="_card_story_img1 relative z-0 size-[60px] rounded-full border-[3px] border-solid border-[#C5C5C5] object-cover dark:border-[var(--color3)]"
          />
        </div>
      </div>
      <p className="_feed_inner_ppl_card_area_txt m-0 mt-3 w-[60px] max-w-[60px] overflow-hidden text-center text-xs leading-[1.2] font-medium text-ellipsis whitespace-nowrap text-[var(--feed-mobile-story-label)]">
        Ryan...
      </p>
    </>
  )
}

export function FeedStoriesMobile() {
  return (
    <div className="_feed_inner_ppl_card_mobile _mar_b16 mb-4 min-[992px]:hidden">
      <div className="_feed_inner_ppl_card_area overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="_feed_inner_ppl_card_area_list m-0 flex w-max max-w-none list-none items-center justify-between gap-0 p-0">
          {mobileStories.map((story, i) => (
            <li
              key={`story-${i}-${story.kind}-${"src" in story ? story.src : "yours"}`}
              className="_feed_inner_ppl_card_area_item flex basis-[70px] shrink-0 grow-0 justify-center"
            >
              {story.kind === "yours" ? (
                <div
                  className={cn(
                    "group/story flex w-full min-w-0 flex-col items-center text-center",
                    storyEase,
                    "hover:opacity-95 active:opacity-90"
                  )}
                >
                  <MobileStoryBody story={story} />
                </div>
              ) : (
                <Button asChild variant="ghost" size="sm" className={cn("group/story h-auto min-h-0 w-full", mobileStoryPressable)}>
                  <Link
                    href="#0"
                    className={cn(
                      "_feed_inner_ppl_card_area_link flex min-w-0 flex-col items-center text-center no-underline",
                      cardFocusRing
                    )}
                    aria-label="Open story"
                  >
                    <MobileStoryBody story={story} />
                  </Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
