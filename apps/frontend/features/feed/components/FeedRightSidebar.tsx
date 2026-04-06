"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { friendsList } from "./feed-data";
import { cn } from "@/lib/utils";
import {
  feedFriendsSearchSchema,
  type FeedFriendsSearchValues,
} from "@/features/feed/types/feed";

const feedEase =
  "transition-[color,background-color,border-color,opacity,box-shadow] duration-200 ease-in-out";

const onlineDot = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 14 14"
    aria-hidden
  >
    <rect
      width="12"
      height="12"
      x="1"
      y="1"
      fill="var(--color8)"
      stroke="var(--html-white)"
      strokeWidth="2"
      rx="6"
    />
  </svg>
);

export function FeedRightSidebar() {
  const form = useForm<FeedFriendsSearchValues>({
    resolver: zodResolver(feedFriendsSearchSchema),
    defaultValues: { query: "" },
  });

  function onSearch(_values: FeedFriendsSearchValues) {
    //
  }

  return (
    <div
      className={cn(
        "_layout_right_sidebar_wrap feed-sidebar-no-scrollbar",
        "hidden h-[calc(100vh-75px)] min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain pt-[18px] lg:flex",
      )}
    >
      <div className="_layout_right_sidebar_inner flex shrink-0 flex-col">
        <Card
          className={cn(
            "_right_inner_area_info _feed_inner_area _b_radious6",
            "gap-0 overflow-visible rounded-[6px] border-0 bg-[var(--feed-surface-elevated)] py-0 shadow-none",
          )}
        >
          <CardContent className="flex flex-col px-6 pt-6 pb-6">
            <div className="_right_inner_area_info_content _mar_b24 mb-6 flex shrink-0 items-center justify-between">
              <h4
                className={cn(
                  "_right_inner_area_info_content_title _title5",
                  "m-0 text-xl font-medium leading-[1.4] text-[var(--feed-text-primary)]",
                  "min-[1200px]:max-[1399px]:text-[15px]",
                  "min-[992px]:max-[1199px]:text-[13px] min-[992px]:max-[1199px]:!leading-[1.4]",
                )}
              >
                You Might Like
              </h4>
              <span className="_right_inner_area_info_content_txt">
                <Link
                  href="#0"
                  className={cn(
                    "_right_inner_area_info_content_txt_link",
                    "text-xs font-medium leading-[18px] text-[var(--color5)]",
                    feedEase,
                    "rounded-sm hover:opacity-90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                    "active:opacity-80",
                  )}
                >
                  See All
                </Link>
              </span>
            </div>
            <hr
              className={cn(
                "_underline my-0 h-px border-0",
                "bg-[var(--bg4)]",
                "[margin-block:4px_10px]",
              )}
            />
            <div className="_right_inner_area_info_ppl flex min-w-0 flex-col">
              <div className="_right_inner_area_info_box my-6 flex shrink-0 items-center">
                <div className="_right_inner_area_info_box_image mr-5 shrink-0">
                  <Link
                    href="#0"
                    className={cn(
                      "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                    )}
                  >
                    <Image
                      src="/images/Avatar.png"
                      alt=""
                      width={50}
                      height={50}
                      className="_ppl_img size-[50px] rounded-full object-cover"
                    />
                  </Link>
                </div>
                <div className="_right_inner_area_info_box_txt min-w-0">
                  <Link
                    href="#0"
                    className={cn(
                      "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                    )}
                  >
                    <h4
                      className={cn(
                        "_right_inner_area_info_box_title",
                        "m-0 text-base font-medium leading-6 text-[var(--feed-text-primary)] min-[1200px]:max-[1399px]:text-sm",
                        "min-[992px]:max-[1199px]:!text-[13px] max-[1199px]:text-sm",
                      )}
                    >
                      Radovan SkillArena
                    </h4>
                  </Link>
                  <p
                    className={cn(
                      "_right_inner_area_info_box_para",
                      "m-0 text-xs font-normal leading-[18px] text-[var(--feed-text-primary)]",
                      "min-[1200px]:max-[1399px]:text-[11px]",
                      "min-[992px]:max-[1199px]:!text-[10px] max-[1199px]:text-[11px]",
                    )}
                  >
                    Founder & CEO at Trophy
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "_right_info_btn_grp flex w-full shrink-0 flex-row items-center gap-2",
                  "min-w-0",
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "_right_info_btn_link",
                    "h-auto min-h-10 flex-1 basis-0 justify-center rounded-md border border-[var(--feed-pill-border)] bg-[var(--feed-surface-input)]",
                    "px-3 py-2.5 sm:px-6 min-[992px]:max-[1199px]:px-4 lg:px-10",
                    "text-center text-sm font-medium leading-[22px] text-[var(--feed-pill-muted-text)] shadow-none whitespace-normal",
                    "hover:border-[var(--feed-link-accent)] hover:bg-[var(--feed-link-accent)] hover:text-[var(--html-white)]",
                    "dark:border-[var(--color5)] dark:bg-[var(--feed-surface-input)] dark:text-[var(--bg2)]",
                    "dark:hover:border-[var(--feed-link-accent)] dark:hover:bg-[var(--feed-link-accent)] dark:hover:text-[var(--html-white)]",
                    feedEase,
                    "focus-visible:border-[var(--color5)] focus-visible:ring-2 focus-visible:ring-[var(--color5)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                    "active:opacity-95",
                  )}
                >
                  Ignore
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={cn(
                    "_right_info_btn_link _right_info_btn_link_active",
                    "h-auto min-h-10 flex-1 basis-0 justify-center rounded-md border border-[var(--feed-link-accent)] bg-[var(--feed-link-accent)]",
                    "px-3 py-2.5 sm:px-6 min-[992px]:max-[1199px]:px-4 lg:px-10",
                    "text-center text-sm font-medium leading-[22px] text-[var(--html-white)] shadow-none whitespace-normal",
                    "hover:border-[var(--color5)] hover:bg-[var(--color5)] hover:text-[var(--html-white)]",
                    "dark:border-[var(--feed-link-accent)] dark:bg-[var(--feed-link-accent)] dark:text-[var(--html-white)]",
                    "dark:hover:border-[var(--color5)] dark:hover:bg-[var(--color5)]",
                    feedEase,
                    "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                    "active:opacity-95",
                  )}
                >
                  Follow
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="_layout_right_sidebar_inner flex min-h-0 min-w-0 shrink-0 flex-col">
        <Card
          className={cn(
            "_feed_right_inner_area_card _feed_inner_area _b_radious6",
            "gap-0 overflow-visible rounded-[6px] border-0 bg-[var(--feed-surface-elevated)] py-0 shadow-none",
          )}
        >
          <CardContent className="min-w-0 px-6 pt-6 pb-1.5">
            <div className="_feed_top_fixed shrink-0">
              <div className="_feed_right_inner_area_card_content _mar_b24 mb-6 flex items-center justify-between">
                <h4
                  className={cn(
                    "_feed_right_inner_area_card_content_title _title5",
                    "m-0 text-xl font-medium leading-[1.4] text-[var(--feed-text-primary)]",
                    "min-[1200px]:max-[1399px]:text-[15px]",
                    "min-[992px]:max-[1199px]:text-[13px] min-[992px]:max-[1199px]:!leading-[1.4]",
                  )}
                >
                  Your Friends
                </h4>
                <span className="_feed_right_inner_area_card_content_txt">
                  <Link
                    href="#0"
                    className={cn(
                      "_feed_right_inner_area_card_content_txt_link",
                      "text-xs font-medium leading-[18px] text-[var(--color5)]",
                      feedEase,
                      "rounded-sm hover:opacity-90",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]",
                      "active:opacity-80",
                    )}
                  >
                    See All
                  </Link>
                </span>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSearch)}
                  className="_feed_right_inner_area_card_form relative mb-6"
                >
                  <svg
                    className="_feed_right_inner_area_card_form_svg pointer-events-none absolute top-3 left-[18px]"
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
                      stroke="var(--feed-search-icon-stroke)"
                    />
                    <path
                      stroke="var(--feed-search-icon-stroke)"
                      strokeLinecap="round"
                      d="M16 16l-3-3"
                    />
                  </svg>
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem className="m-0 gap-0 space-y-0 p-0">
                        <FormControl>
                          <Input
                            type="search"
                            placeholder="input search text"
                            aria-label="Search"
                            className={cn(
                              "_feed_right_inner_area_card_form_inpt h-10 w-full rounded-[32px] font-normal md:text-base",
                              "border border-[var(--feed-surface-input)] bg-[var(--feed-surface-input)] py-[7px] pr-3 pl-[47px]",
                              "text-base leading-[1.4] text-[var(--feed-text-primary)]",
                              "shadow-none outline-none placeholder:text-base placeholder:font-normal placeholder:leading-[1.4] placeholder:text-[var(--feed-placeholder)]",
                              "transition-[color,border-color,box-shadow] duration-200 ease-in-out",
                              "hover:border-[var(--color5)]",
                              "focus-visible:border-[var(--color5)] focus-visible:ring-0",
                              "focus-visible:placeholder:opacity-0",
                              "min-[992px]:max-[1199px]:py-[7px] min-[992px]:max-[1199px]:pl-[38px] min-[992px]:max-[1199px]:placeholder:text-xs",
                            )}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            <div className="_feed_bottom_fixed">
              {friendsList.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    "_feed_right_inner_area_card_ppl mb-6 flex items-center justify-between rounded-lg p-1.5",
                    "bg-transparent hover:bg-[var(--feed-sidebar-row-hover)] dark:hover:bg-[var(--feed-sidebar-row-hover)]",
                    feedEase,
                    row.inactive &&
                      "_feed_right_inner_area_card_ppl_inactive min-[992px]:max-[1199px]:flex-wrap",
                  )}
                >
                  <div
                    className={cn(
                      "_feed_right_inner_area_card_ppl_box flex min-w-0 flex-1 items-center",
                      "min-[992px]:max-[1199px]:mb-2 min-[992px]:max-[1199px]:w-full",
                    )}
                  >
                    <div className="_feed_right_inner_area_card_ppl_image mr-4 shrink-0">
                      <Link
                        href="#0"
                        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]"
                      >
                        <Image
                          src={row.image}
                          alt=""
                          width={40}
                          height={40}
                          className="_box_ppl_img size-10 max-h-10 max-w-10 rounded-full object-cover"
                        />
                      </Link>
                    </div>
                    <div className="_feed_right_inner_area_card_ppl_txt min-w-0">
                      <Link
                        href="#0"
                        className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]"
                      >
                        <h4
                          className={cn(
                            "_feed_right_inner_area_card_ppl_title",
                            "m-0 text-sm font-medium leading-[1.4] text-[var(--feed-text-primary)]",
                            "min-[992px]:max-[1199px]:text-xs",
                          )}
                        >
                          {row.name}
                        </h4>
                      </Link>
                      <p
                        className={cn(
                          "_feed_right_inner_area_card_ppl_para",
                          "m-0 text-[11px] font-light leading-[1.4] text-[var(--feed-text-primary)]",
                        )}
                      >
                        {row.title}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "_feed_right_inner_area_card_ppl_side flex shrink-0 items-center justify-end",
                      "min-[992px]:max-[1199px]:[flex-basis:100%]",
                    )}
                  >
                    {row.side === "online"
                      ? onlineDot
                      : row.timeLabel && (
                          <span
                            className={cn(
                              "text-[11px] leading-[21px] font-normal text-[var(--feed-friends-time)]",
                              "min-[992px]:max-[1199px]:block min-[992px]:max-[1199px]:leading-[1.1]",
                            )}
                          >
                            {row.timeLabel}
                          </span>
                        )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
