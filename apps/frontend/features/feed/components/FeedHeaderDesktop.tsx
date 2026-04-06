"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { notificationEntries } from "./feed-data";
import {
  feedHeaderSearchSchema,
  type FeedHeaderSearchValues,
} from "@/features/feed/types/feed";
import { cn } from "@/lib/utils";

function NotificationRow({
  entry,
}: {
  entry: (typeof notificationEntries)[number];
}) {
  return (
    <div className="flex cursor-pointer items-center rounded-md p-[6px] transition-colors duration-200 ease-in-out hover:bg-[var(--html-overlay-weak)] dark:hover:bg-[var(--feed-row-hover-dark)]">
      <div className="mr-3 shrink-0 basis-14">
        <Image
          src={
            entry.kind === "post"
              ? "/images/friend-req.png"
              : "/images/profile-1.png"
          }
          alt=""
          width={56}
          height={56}
          className="size-14 rounded-full object-cover"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <div className="min-w-0 flex-1">
        {entry.kind === "post" ? (
          <p className="m-0 text-sm font-medium leading-[1.6] text-[var(--color7)] dark:text-[var(--bg2)]">
            <span className="text-[var(--color6)] dark:text-[var(--bg2)] dark:opacity-70">
              {entry.name}
            </span>{" "}
            posted a link in your timeline.
          </p>
        ) : (
          <p className="m-0 text-sm font-medium leading-[1.6] text-[var(--color7)] dark:text-[var(--bg2)]">
            An admin changed the name of the group{" "}
            <span className="text-[var(--color6)] dark:text-[var(--bg2)] dark:opacity-70">
              Freelacer usa
            </span>{" "}
            to{" "}
            <span className="text-[var(--color6)] dark:text-[var(--bg2)] dark:opacity-70">
              Freelacer usa
            </span>
          </p>
        )}
        <div className="mt-1">
          <span className="text-[0.8125rem] font-semibold leading-tight text-[var(--color5)]">
            {entry.time}
          </span>
        </div>
      </div>
    </div>
  );
}

const profileMenuItems = [
  {
    label: "Settings",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="19"
        fill="none"
        viewBox="0 0 18 19"
        className="shrink-0 text-[var(--html-blue-alt)] dark:text-[var(--html-dark-blue)]"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M9.584 0c.671 0 1.315.267 1.783.74.468.473.721 1.112.7 1.709l.009.14a.985.985 0 00.136.395c.145.242.382.418.659.488.276.071.57.03.849-.13l.155-.078c1.165-.538 2.563-.11 3.21.991l.58.99a.695.695 0 01.04.081l.055.107c.519 1.089.15 2.385-.838 3.043l-.244.15a1.046 1.046 0 00-.313.339 1.042 1.042 0 00-.11.805c.074.272.255.504.53.66l.158.1c.478.328.823.812.973 1.367.17.626.08 1.292-.257 1.86l-.625 1.022-.094.144c-.735 1.038-2.16 1.355-3.248.738l-.129-.066a1.123 1.123 0 00-.412-.095 1.087 1.087 0 00-.766.31c-.204.2-.317.471-.316.786l-.008.163C11.956 18.022 10.88 19 9.584 19h-1.17c-1.373 0-2.486-1.093-2.484-2.398l-.008-.14a.994.994 0 00-.14-.401 1.066 1.066 0 00-.652-.493 1.12 1.12 0 00-.852.127l-.169.083a2.526 2.526 0 01-1.698.122 2.47 2.47 0 01-1.488-1.154l-.604-1.024-.08-.152a2.404 2.404 0 01.975-3.132l.1-.061c.292-.199.467-.527.467-.877 0-.381-.207-.733-.569-.94l-.147-.092a2.419 2.419 0 01-.724-3.236l.615-.993a2.503 2.503 0 013.366-.912l.126.066c.13.058.269.089.403.09a1.08 1.08 0 001.086-1.068l.008-.185c.049-.57.301-1.106.713-1.513A2.5 2.5 0 018.414 0h1.17zm0 1.375h-1.17c-.287 0-.562.113-.764.312-.179.177-.288.41-.308.628l-.012.29c-.098 1.262-1.172 2.253-2.486 2.253a2.475 2.475 0 01-1.013-.231l-.182-.095a1.1 1.1 0 00-1.488.407l-.616.993a1.05 1.05 0 00.296 1.392l.247.153A2.43 2.43 0 013.181 9.5c0 .802-.401 1.552-1.095 2.023l-.147.091c-.486.276-.674.873-.448 1.342l.053.102.597 1.01c.14.248.374.431.652.509.246.069.51.05.714-.04l.103-.05a2.506 2.506 0 011.882-.248 2.456 2.456 0 011.823 2.1l.02.335c.059.535.52.95 1.079.95h1.17c.566 0 1.036-.427 1.08-.95l.005-.104a2.412 2.412 0 01.726-1.732 2.508 2.508 0 011.779-.713c.331.009.658.082.992.23l.3.15c.469.202 1.026.054 1.309-.344l.068-.105.61-1a1.045 1.045 0 00-.288-1.383l-.257-.16a2.435 2.435 0 01-1.006-1.389 2.393 2.393 0 01.25-1.847c.181-.31.429-.575.752-.795l.152-.095c.485-.278.672-.875.448-1.346l-.067-.127-.012-.027-.554-.945a1.095 1.095 0 00-1.27-.487l-.105.041-.098.049a2.515 2.515 0 01-1.88.259 2.47 2.47 0 01-1.511-1.122 2.367 2.367 0 01-.325-.97l-.012-.24a1.056 1.056 0 00-.307-.774 1.096 1.096 0 00-.779-.323zm-.58 5.02c1.744 0 3.16 1.39 3.16 3.105s-1.416 3.105-3.16 3.105c-1.746 0-3.161-1.39-3.161-3.105s1.415-3.105 3.16-3.105zm0 1.376c-.973 0-1.761.774-1.761 1.729 0 .955.788 1.73 1.76 1.73s1.76-.775 1.76-1.73-.788-1.729-1.76-1.729z"
        />
      </svg>
    ),
  },
  {
    label: "Help & Support",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
        className="shrink-0 text-[var(--html-blue-alt)] dark:text-[var(--html-dark-blue)]"
        aria-hidden
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M10 19a9 9 0 100-18 9 9 0 000 18z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M7.38 7.3a2.7 2.7 0 015.248.9c0 1.8-2.7 2.7-2.7 2.7M10 14.5h.009"
        />
      </svg>
    ),
  },
  {
    label: "Log Out",
    href: "#0",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        fill="none"
        viewBox="0 0 19 19"
        className="shrink-0 text-[var(--html-blue-alt)] dark:text-[var(--html-dark-blue)]"
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
    ),
  },
] as const;

export function FeedHeaderDesktop() {
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const form = useForm<FeedHeaderSearchValues>({
    resolver: zodResolver(feedHeaderSearchSchema),
    defaultValues: { query: "" },
  });

  function onSearch(_values: FeedHeaderSearchValues) {
    //
  }

  return (
    <nav className="fixed top-0 right-0 left-0 z-[1030] hidden bg-[var(--bg2)] pt-2.5 pb-0 transition-colors lg:block dark:bg-[var(--bg5)]">
      <div className="mx-auto flex w-full max-w-full flex-wrap items-center px-3 sm:px-4 lg:max-w-[1160px] lg:flex-nowrap xl:max-w-[1320px]">
        <div className="flex items-center">
          <Link href="/feed" className="inline-flex max-w-[169px] shrink-0">
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

        <div className="flex flex-1 flex-wrap items-center justify-end lg:ms-0 lg:flex-nowrap">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSearch)}
              className="relative ms-auto"
            >
              <svg
                className="pointer-events-none absolute top-[12px] left-[18px]"
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
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="search"
                        placeholder="input search text"
                        aria-label="Search"
                        className="me-2 h-10 w-[424px] rounded-[32px] border border-[var(--bg3)] bg-[var(--bg3)] py-[7px] pr-3 pl-[47px] font-normal text-base leading-[1.4] text-[var(--color6)] transition-[color,border-color] placeholder:text-base placeholder:font-normal placeholder:leading-[1.4] placeholder:text-[var(--feed-search-placeholder)] hover:border-[var(--color5)] focus-visible:border-[var(--color5)] focus-visible:ring-0 dark:border-[var(--bg6)] dark:bg-[var(--bg6)] dark:text-[var(--bg2)] dark:placeholder:text-[var(--feed-search-placeholder)]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <ul className="mb-0 ms-auto mr-2 flex list-none items-center gap-0 max-lg:ms-0 xl:[&>li]:mx-3">
            <li className="mx-3">
              <Link
                href="/feed"
                className="relative block w-fit cursor-pointer !px-4 !py-[22px] !pb-[26px] text-[var(--feed-nav-tab-text-muted)] transition-colors before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:bg-[var(--html-blue-bright)] before:content-['']"
                aria-current="page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="21"
                  fill="none"
                  viewBox="0 0 18 21"
                  aria-hidden
                >
                  <path
                    className="stroke-[var(--color5)] [stroke-opacity:1] dark:stroke-[var(--color5)]"
                    strokeWidth="1.5"
                    fill="none"
                    d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z"
                  />
                  <path
                    className="stroke-[var(--color5)] [stroke-opacity:1] dark:stroke-[var(--color5)]"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    fill="none"
                    d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857"
                  />
                </svg>
              </Link>
            </li>
            <li className="mx-3">
              <Link
                href="#0"
                className="group relative block w-fit cursor-pointer !px-4 !py-[22px] !pb-[26px] text-[var(--feed-nav-tab-text-muted)] transition-all before:absolute before:inset-x-0 before:bottom-0 before:h-0 before:bg-[var(--html-blue-bright)] before:transition-all before:duration-200 before:ease-in-out before:content-[''] hover:before:h-[2px]"
                aria-current="page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="20"
                  fill="none"
                  viewBox="0 0 26 20"
                  className="transition-colors"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    className="opacity-60 transition-colors group-hover:fill-[var(--color5)] group-hover:opacity-100 dark:opacity-100"
                    fillRule="evenodd"
                    d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </li>
            <li className="mx-3">
              <div className="relative w-fit">
                <button
                  type="button"
                  className="relative block w-fit cursor-pointer border-0 bg-transparent !px-4 !py-[22px] !pb-[26px] text-[var(--feed-nav-tab-text-muted)] before:absolute before:inset-x-0 before:bottom-0 before:h-0 before:bg-[var(--html-blue-bright)] before:transition-all before:duration-200 before:ease-in-out before:content-[''] hover:before:h-[2px]"
                  onClick={() => {
                    setNotifyOpen((o) => !o);
                    setNotifMenuOpen(false);
                  }}
                  aria-expanded={notifyOpen}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="22"
                    fill="none"
                    viewBox="0 0 20 22"
                    className="opacity-60 transition-colors hover:opacity-100 [&:hover_path]:fill-[var(--color5)] dark:opacity-100"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="absolute top-4 right-[10px] flex h-[17px] min-h-[17px] min-w-[17px] items-center justify-center rounded-[9px] border border-[var(--bg2)] bg-[var(--color5)] px-[3px] text-center text-[11px] leading-[1.4] font-normal text-[var(--bg2)] dark:border-[var(--bg5)]">
                    6
                  </span>
                </button>
                <div
                  className={cn(
                    "pointer-events-none absolute -left-[110px] top-8 z-20 h-[calc(100vh-90px)] w-[400px] max-w-[calc(100vw-2rem)] overflow-auto rounded-md bg-[var(--bg2)] p-4 shadow-[var(--feed-shadow-dropdown)] transition-all dark:bg-[var(--bg5)] dark:shadow-none",
                    notifyOpen
                      ? "pointer-events-auto translate-y-10 opacity-100 visible"
                      : "invisible translate-y-5 opacity-0",
                  )}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h4 className="m-0 text-xl font-semibold leading-[1.2] text-[var(--color6)] dark:text-[var(--bg2)]">
                      Notifications
                    </h4>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-auto p-0"
                        onClick={() => setNotifMenuOpen((m) => !m)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="4"
                          height="17"
                          fill="none"
                          viewBox="0 0 4 17"
                          aria-hidden
                        >
                          <circle cx="2" cy="2" r="2" fill="var(--color3)" />
                          <circle cx="2" cy="8" r="2" fill="var(--color3)" />
                          <circle cx="2" cy="15" r="2" fill="var(--color3)" />
                        </svg>
                      </Button>
                      <div
                        className={cn(
                          "absolute right-0 z-30 w-[220px] rounded-md bg-[var(--bg2)] p-4 shadow-[var(--feed-shadow-dropdown)] dark:bg-[var(--bg6)] dark:shadow-none",
                          notifMenuOpen ? "block" : "hidden",
                        )}
                      >
                        <ul className="m-0 list-none p-0">
                          <li className="mb-2.5">
                            <span className="block cursor-pointer text-sm font-normal leading-[1.2] text-[var(--color7)] dark:text-[var(--bg2)]">
                              Mark as all read
                            </span>
                          </li>
                          <li className="mb-2.5">
                            <span className="block cursor-pointer text-sm font-normal leading-[1.2] text-[var(--color7)] dark:text-[var(--bg2)]">
                              Notifivations seetings
                            </span>
                          </li>
                          <li className="mb-2.5">
                            <span className="block cursor-pointer text-sm font-normal leading-[1.2] text-[var(--color7)] dark:text-[var(--bg2)]">
                              Open Notifications
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 flex">
                    <Button
                      type="button"
                      variant="outline"
                      className="mr-2.5 h-9 rounded-md border-[var(--html-border-hairline)] bg-[var(--html-blue-tint)] px-2 text-base font-medium leading-[1.2] text-[var(--color5)] shadow-none hover:bg-[var(--html-blue-tint)] dark:border-[var(--color5)] dark:bg-transparent dark:hover:bg-transparent"
                    >
                      All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-md border-[var(--html-border-hairline)] bg-transparent px-2 text-base font-medium leading-[1.2] text-[var(--color6)] shadow-none dark:border-[var(--color5)] dark:bg-transparent dark:text-[var(--html-text-on-dark-soft)]"
                    >
                      Unread
                    </Button>
                  </div>
                  <div className="mt-5">
                    {notificationEntries.map((entry) => (
                      <NotificationRow key={entry.id} entry={entry} />
                    ))}
                  </div>
                </div>
              </div>
            </li>
            <li className="mx-3">
              <Link
                href="#0"
                className="group relative block w-fit cursor-pointer !px-4 !py-[22px] !pb-[26px] text-[var(--feed-nav-tab-text-muted)] before:absolute before:inset-x-0 before:bottom-0 before:h-0 before:bg-[var(--html-blue-bright)] before:transition-[height] before:duration-200 before:ease-in-out before:content-[''] hover:before:h-[2px]"
                aria-current="page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="22"
                  fill="none"
                  viewBox="0 0 23 22"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    className="opacity-60 transition-colors group-hover:fill-[var(--color5)] group-hover:opacity-100 dark:opacity-100"
                    fillRule="evenodd"
                    d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute top-4 right-[10px] flex h-[17px] min-h-[17px] min-w-[17px] items-center justify-center rounded-[9px] border border-[var(--bg2)] bg-[var(--color5)] px-[3px] text-center text-[11px] leading-[1.4] font-normal text-[var(--bg2)] dark:border-[var(--bg5)]">
                  2
                </span>
              </Link>
            </li>
          </ul>

          <div className="relative ms-2 flex items-center">
            <div className="mr-2.5 size-10 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/images/profile.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="flex cursor-pointer items-center">
              <p className="m-0 text-base !font-normal !leading-6 !text-[var(--color6)] dark:!text-[var(--bg2)]">
                Dylan Field
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="ml-2 h-auto min-h-0 self-center border border-transparent bg-transparent p-0"
                onClick={() => {
                  setProfileOpen((p) => !p);
                }}
                aria-expanded={profileOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="6"
                  fill="none"
                  viewBox="0 0 10 6"
                  aria-hidden
                >
                  <path
                    fill="var(--bg5)"
                    className="dark:fill-[var(--bg2)]"
                    d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
                  />
                </svg>
              </Button>
            </div>
            <div
              className={cn(
                "absolute top-0 right-0 z-30 w-[312px] rounded-md bg-[var(--bg2)] p-4 shadow-[var(--feed-shadow-popover)] transition-all dark:bg-[var(--bg5)]",
                profileOpen
                  ? "translate-y-10 opacity-100 visible"
                  : "invisible translate-y-5 opacity-0",
              )}
            >
              <div className="flex items-center">
                <div className="pr-2">
                  <Image
                    src="/images/profile.png"
                    alt=""
                    width={54}
                    height={54}
                    className="size-[54px] rounded-full object-cover"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div>
                  <h4 className="m-0 mb-1 text-base font-bold leading-[1.2] text-[var(--color6)] dark:text-[var(--bg2)]">
                    Dylan Field
                  </h4>
                  <Link
                    href="#0"
                    className="text-sm leading-[1.2] text-[var(--html-blue-alt)]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <hr className="my-4 border-[var(--bg4)] dark:border-[var(--feed-hairline-on-dark)]" />
              <ul className="m-0 list-none p-0">
                {profileMenuItems.map((item) => (
                  <li key={item.label} className="mb-4">
                    {item.label === "Log Out" ? (
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between rounded-md border-0 bg-transparent p-0 text-left text-base font-medium leading-[1.2] text-[var(--color7)] outline-none transition-colors duration-200 ease-in-out hover:text-[var(--color5)] focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg2)] dark:text-[var(--html-text-dim)] dark:hover:text-[var(--color5)] dark:focus-visible:ring-offset-[var(--bg5)]"
                        onClick={() => {
                          setProfileOpen(false);
                          void signOut({ callbackUrl: "/login" });
                        }}
                      >
                        <div className="flex items-center">
                          <span
                            className={cn(
                              "mr-2 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--feed-profile-menu-icon-bg)] p-[11px]",
                              "dark:size-11 dark:bg-slate-200 dark:p-0",
                            )}
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        <span
                          className="inline-flex size-7 shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] p-0"
                          aria-hidden
                        >
                          <svg
                            width="6"
                            height="10"
                            viewBox="0 0 6 10"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              fill="var(--bg5)"
                              className="opacity-50 dark:fill-[var(--bg2)]"
                              d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                            />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-md text-base font-medium leading-[1.2] text-[var(--color7)] outline-none transition-colors duration-200 ease-in-out hover:text-[var(--color5)] focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg2)] dark:text-[var(--html-text-dim)] dark:hover:text-[var(--color5)] dark:focus-visible:ring-offset-[var(--bg5)]"
                      >
                        <div className="flex items-center">
                          <span
                            className={cn(
                              "mr-2 inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--feed-profile-menu-icon-bg)] p-[11px]",
                              "dark:size-11 dark:bg-slate-200 dark:p-0",
                            )}
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </div>
                        <span
                          className="inline-flex size-7 shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] p-0"
                          aria-hidden
                        >
                          <svg
                            width="6"
                            height="10"
                            viewBox="0 0 6 10"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              fill="var(--bg5)"
                              className="opacity-50 dark:fill-[var(--bg2)]"
                              d="M5 5l.354.354L5.707 5l-.353-.354L5 5zM1.354 9.354l4-4-.708-.708-4 4 .708.708zm4-4.708l-4-4-.708.708 4 4 .708-.708z"
                            />
                          </svg>
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
