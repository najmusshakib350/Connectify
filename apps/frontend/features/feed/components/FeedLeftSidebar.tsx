import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import {
  exploreItems,
  suggestedPeople,
} from "./feed-data"
import { FeedExploreIcon } from "./FeedExploreIcon"

export function FeedLeftSidebar() {
  return (
    <div className="_layout_left_sidebar_wrap feed-sidebar-no-scrollbar hidden h-[calc(100vh-75px)] flex-1 flex-col overflow-y-auto overscroll-contain pt-[18px] lg:flex">
      <div className="_layout_left_sidebar_inner">
        <Card className="_feed_inner_area mb-4 rounded-md border-0 bg-[var(--feed-surface-elevated)] py-0 shadow-none">
          <CardContent className="_left_inner_area_explore px-6 pt-6 pb-1.5">
            <h4 className="_left_inner_area_explore_title _title5 mb-6 m-0 text-xl leading-[1.4] font-medium text-[var(--feed-text-primary)] min-[992px]:max-[1199px]:text-[13px]">
              Explore
            </h4>
            <ul className="_left_inner_area_explore_list list-none p-0">
              {exploreItems.map((item) => (
                <li
                  key={item.id}
                  className={`_left_inner_area_explore_item mb-6 ${item.badge ? "_explore_item relative flex items-center" : ""}`}
                >
                  <Link
                    href={item.href}
                    className={`_left_inner_area_explore_link flex min-w-0 w-full items-center text-base leading-[1.4] font-medium text-[var(--feed-explore-link)] transition-colors duration-200 ease-in-out hover:text-[var(--color5)] min-[992px]:max-[1199px]:text-[11px] ${item.badge ? "pr-10 min-[992px]:max-[1199px]:pr-9" : ""}`}
                  >
                    <FeedExploreIcon item={item} />
                    {item.label}
                  </Link>
                  {item.badge === "new" ? (
                    <span className="_left_inner_area_explore_link_txt absolute top-1/2 right-0 flex h-6 w-9 -translate-y-1/2 items-center justify-center rounded-lg border-2 border-[var(--feed-badge-border)] bg-[var(--color8)] text-[13px] leading-[1.4] font-normal text-[var(--feed-text-on-accent)]">
                      New
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="_layout_left_sidebar_inner">
        <Card className="_feed_inner_area mb-4 rounded-md border-0 bg-[var(--feed-surface-elevated)] py-0 shadow-none">
          <CardContent className="_left_inner_area_suggest px-6 pt-6 pb-1.5">
            <div className="_left_inner_area_suggest_content mb-6 flex items-center justify-between">
              <h4 className="_left_inner_area_suggest_content_title _title5 m-0 text-xl leading-[1.4] font-medium text-[var(--feed-text-primary)] min-[992px]:max-[1199px]:text-[13px]">
                Suggested People
              </h4>
              <span className="_left_inner_area_suggest_content_txt">
                <Link
                  href="#0"
                  className="_left_inner_area_suggest_content_txt_link text-xs font-medium leading-[18px] text-[var(--color5)]"
                >
                  See All
                </Link>
              </span>
            </div>
            {suggestedPeople.map((person) => (
              <div
                key={person.id}
                className="_left_inner_area_suggest_info mb-6 flex flex-wrap items-center justify-between gap-2"
              >
                <Link
                  href="#0"
                  className="_left_inner_area_suggest_info_box flex min-w-0 flex-1 items-center text-left no-underline"
                >
                  <div className="_left_inner_area_suggest_info_image mr-4 shrink-0">
                    <Image
                      src={person.image}
                      alt=""
                      width={person.wideImage ? 71 : 37}
                      height={person.wideImage ? 40 : 37}
                      className={
                        person.wideImage
                          ? "_info_img h-10 max-h-10 max-w-[71px] rounded-full object-cover"
                          : "_info_img1 size-[37px] max-h-[37px] max-w-[37px] rounded-full object-cover"
                      }
                      sizes={person.wideImage ? "71px" : "37px"}
                    />
                  </div>
                  <div className="_left_inner_area_suggest_info_txt min-w-0 flex-1">
                    <h4 className="_left_inner_area_suggest_info_title m-0 text-sm leading-[1.1] font-medium text-[var(--feed-text-primary)]">
                      {person.name}
                    </h4>
                    <p className="_left_inner_area_suggest_info_para m-0 text-[11px] leading-[1.4] font-light text-[var(--feed-text-primary)]">
                      {person.role}
                    </p>
                  </div>
                </Link>
                <div className="_left_inner_area_suggest_info_link min-w-0 shrink-0 min-[992px]:max-[1199px]:w-full min-[992px]:max-[1199px]:text-center">
                  <Link
                    href="#0"
                    className="_info_link block rounded-[2px] border border-[var(--feed-connect-border)] bg-[var(--feed-surface-elevated)] p-[7px] text-center text-xs leading-[1.4] font-medium text-[var(--feed-pill-muted-text)] transition-all duration-200 ease-in-out hover:border-[var(--color5)] hover:bg-[var(--color5)] hover:text-[var(--feed-connect-hover-text)]"
                  >
                    Connect
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="_layout_left_sidebar_inner">
        <Card className="_feed_inner_area mb-4 rounded-md border-0 bg-[var(--feed-surface-elevated)] py-0 shadow-none">
          <CardContent className="_left_inner_area_event px-6 pt-6 pb-1.5">
            <div className="_left_inner_event_content mb-6 flex items-center justify-between">
              <h4 className="_left_inner_event_title _title5 m-0 text-xl leading-[1.4] font-medium text-[var(--feed-text-primary)] min-[992px]:max-[1199px]:text-[13px]">
                Events
              </h4>
              <Link
                href="#0"
                className="_left_inner_event_link block cursor-pointer px-px py-1 text-xs font-medium leading-[18px] text-[var(--color5)]"
              >
                See all
              </Link>
            </div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="_left_inner_event_card mb-4 rounded-md bg-[var(--feed-surface-elevated)] shadow-[var(--feed-shadow-card)]"
              >
                <Link
                  href="#0"
                  className="_left_inner_event_card_link block cursor-pointer"
                >
                  <div className="_left_inner_event_card_iamge overflow-hidden rounded-t-md">
                    <Image
                      src="/images/feed_event1.png"
                      alt=""
                      width={400}
                      height={160}
                      className="_feed_card_img h-auto w-full rounded-t-md object-cover"
                      style={{ height: "auto" }}
                      sizes="(min-width: 1024px) 320px, 100vw"
                    />
                  </div>
                  <div className="_left_inner_event_card_content flex items-center px-4 pt-5 pb-3.5">
                    <div className="_left_inner_card_date w-fit rounded-[2px] bg-[var(--color8)] p-2 text-center">
                      <p className="_left_inner_card_date_para m-0 text-lg leading-[1.1] font-bold text-[var(--feed-text-on-accent)]">
                        10
                      </p>
                      <p className="_left_inner_card_date_para1 m-0 text-lg leading-[1.1] font-normal text-[var(--feed-text-on-accent)]">
                        Jul
                      </p>
                    </div>
                    <div className="_left_inner_card_txt pl-2 pt-[5px]">
                      <h4 className="_left_inner_event_card_title m-0 text-base leading-[1.4] font-medium text-[var(--feed-text-body)]">
                        No more terrorism no more cry
                      </h4>
                    </div>
                  </div>
                </Link>
                <hr className="_underline mt-1 mb-2.5 h-px border-0 bg-[var(--bg4)]" />
                <div className="_left_inner_event_bottom flex items-center justify-between px-4 pt-0.5 pb-3">
                  <p className="_left_iner_event_bottom m-0 text-xs font-medium leading-[18px] text-[var(--html-text-soft)] opacity-70">
                    17 People Going
                  </p>
                  <Link
                    href="#0"
                    className="_left_iner_event_bottom_link block rounded-[2px] border border-[var(--color5)] bg-[var(--html-surface-frost)] px-3 py-0.5 text-xs font-medium leading-[18px] text-[var(--color5)] transition-all duration-200 ease-in-out hover:bg-[var(--color5)] hover:text-[var(--html-surface-frost)]"
                  >
                    Going
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
