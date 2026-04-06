"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { useState } from "react"

import { Alert } from "@/components/ui/alerts/Alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCreatePost } from "@/features/feed/hooks/useCreatePost"

import { FeedPostModal } from "./FeedPostModal"

const transitionFeed = "transition-all duration-200 ease-in-out"


const feedComposerAlertStackClassName =
  "fixed top-4 right-4 z-[1100] flex max-h-[calc(100vh-2rem)] w-[min(100vw-2rem,24rem)] flex-col gap-2 overflow-y-auto pointer-events-none"


const composerTextareaClassName = cn(
  "_textarea peer flex w-full resize-none border-0 bg-transparent p-2 text-xs leading-normal font-normal outline-none",
  "text-[var(--feed-composer-input-text)]",
  "placeholder:text-xs placeholder:font-normal placeholder:text-[var(--feed-placeholder)]",
  "min-h-[calc(86px+2px)]",
  transitionFeed,
  "focus:ring-0 focus-visible:ring-0",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
)

const actionIconClass =
  "text-[var(--feed-explore-icon)] [&_path]:fill-current [&_path]:transition-colors"

const actionIconPhoto = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    className={actionIconClass}
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
    />
  </svg>
)

const actionIconVideo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="24"
    fill="none"
    viewBox="0 0 22 24"
    className={actionIconClass}
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"
    />
  </svg>
)

const actionIconEvent = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="24"
    fill="none"
    viewBox="0 0 22 24"
    className={actionIconClass}
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692zm-3.202 5.853c.349 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.237-.645.546-.692l.094-.006zm-3.742 0c.35 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.238-.645.546-.692l.094-.006zm-3.75 0c.35 0 .633.312.633.698 0 .353-.238.645-.547.691l-.093.006c-.35 0-.633-.312-.633-.697 0-.354.238-.645.547-.692l.094-.006zm7.492-3.615c.349 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.237-.645.546-.691l.094-.006zm-3.742 0c.35 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.238-.645.546-.691l.094-.006zm-3.75 0c.35 0 .633.312.633.697 0 .354-.238.645-.547.692l-.093.006c-.35 0-.633-.312-.633-.698 0-.353.238-.645.547-.691l.094-.006z"
    />
  </svg>
)

const actionIconArticle = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="20"
    fill="none"
    viewBox="0 0 18 20"
    className={actionIconClass}
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z"
    />
  </svg>
)

const postBtnIcon = (
  <svg
    className="size-[14px] shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="13"
    fill="none"
    viewBox="0 0 14 13"
    aria-hidden
  >
    <path
      fill="var(--html-white)"
      fillRule="evenodd"
      d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
      clipRule="evenodd"
    />
  </svg>
)

const composerActionBtnClass = cn(
  "_feed_inner_text_area_bottom_photo_link group/comp h-auto min-h-0 rounded-md border-0 bg-transparent px-2.5 py-0 text-base font-normal leading-[23px] text-[var(--feed-text-secondary)] shadow-none",
  transitionFeed,
  "hover:bg-transparent hover:text-[var(--color5)] focus-visible:bg-transparent focus-visible:text-[var(--color5)]",
  "hover:[&_path]:fill-[var(--color5)] focus-visible:[&_path]:fill-[var(--color5)]",
  "active:opacity-90",
  "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]"
)

const composerToolbarActionBtnClass = cn(
  composerActionBtnClass,
  "cursor-pointer disabled:cursor-not-allowed"
)

function ComposerActionsDesktop({
  isPending,
  onPhotoClick,
  postButton,
}: {
  isPending: boolean
  onPhotoClick: () => void
  postButton: ReactNode
}) {
  const wrap = (node: ReactNode, showPointerCursor: boolean) => (
    <div
      className={cn(
        "_feed_common flex items-center [&_path]:transition-colors",
        showPointerCursor && "cursor-pointer"
      )}
    >
      {node}
    </div>
  )

  return (
    <div className="_feed_inner_text_area_bottom mt-2.5 hidden h-16 items-center justify-between rounded-b-md bg-[var(--feed-composer-tint)] px-[15px] lg:flex">
      <div className="_feed_inner_text_area_item flex flex-wrap items-center gap-2">
        {wrap(
          <Button
            type="button"
            variant="ghost"
            className={composerToolbarActionBtnClass}
            aria-label="Add photo"
            disabled={isPending}
            onClick={onPhotoClick}
          >
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img mr-2 inline-flex items-center">
              {actionIconPhoto}
            </span>
            Photo
          </Button>,
          true
        )}
        {wrap(
          <Button
            type="button"
            variant="ghost"
            className={composerToolbarActionBtnClass}
            aria-label="Add video"
            disabled={isPending}
          >
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img mr-2 inline-flex items-center">
              {actionIconVideo}
            </span>
            Video
          </Button>,
          true
        )}
        {wrap(
          <Button
            type="button"
            variant="ghost"
            className={composerToolbarActionBtnClass}
            aria-label="Add event"
            disabled={isPending}
          >
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img mr-2 inline-flex items-center">
              {actionIconEvent}
            </span>
            Event
          </Button>,
          true
        )}
        {wrap(
          <Button
            type="button"
            variant="ghost"
            className={composerToolbarActionBtnClass}
            aria-label="Write article"
            disabled={isPending}
          >
            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img mr-2 inline-flex items-center">
              {actionIconArticle}
            </span>
            Article
          </Button>,
          true
        )}
      </div>
      <div className="_feed_inner_text_area_btn shrink-0">{postButton}</div>
    </div>
  )
}

function ComposerActionsMobile({
  isPending,
  onPhotoClick,
  postButton,
}: {
  isPending: boolean
  onPhotoClick: () => void
  postButton: ReactNode
}) {
  const iconBtn = (
    icon: ReactNode,
    label: string,
    options?: { onClick?: () => void; cursorPointer?: boolean }
  ) => {
    const onClick = options?.onClick
    const cursorPointer = options?.cursorPointer ?? false
    return (
    <div className="_feed_inner_text_area_bottom_photo _feed_common flex h-5 w-5 shrink-0 items-center justify-center p-0">
      <Button
        type="button"
        variant="ghost"
        aria-label={label}
        disabled={isPending}
        onClick={onClick}
        className={cn(
          "_feed_inner_text_area_bottom_photo_link h-5 w-5 min-h-0 min-w-0 rounded-md border-0 p-0 shadow-none",
          transitionFeed,
          "text-[var(--feed-explore-icon)] hover:bg-transparent hover:opacity-100",
          "hover:[&_path]:fill-[var(--color5)] focus-visible:[&_path]:fill-[var(--color5)]",
          "active:scale-95 active:opacity-90",
          "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-composer-tint)]",
          cursorPointer
            ? "cursor-pointer disabled:cursor-not-allowed"
            : "cursor-default disabled:cursor-not-allowed"
        )}
      >
        <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img m-0 flex size-5 items-center justify-center [&_svg]:max-h-5 [&_svg]:max-w-5">
          {icon}
        </span>
      </Button>
    </div>
    )
  }

  return (
    <div className="_feed_inner_text_area_bottom_mobile lg:hidden">
      <div className="_feed_inner_text_mobile mt-2.5 flex h-16 items-center justify-between rounded-b-md bg-[var(--feed-composer-tint)] px-[15px]">
        <div className="_feed_inner_text_area_item flex items-center gap-3">
          {iconBtn(actionIconPhoto, "Add photo", {
            onClick: onPhotoClick,
            cursorPointer: true,
          })}
          {iconBtn(actionIconVideo, "Add video", { cursorPointer: true })}
          {iconBtn(actionIconEvent, "Add event", { cursorPointer: true })}
          {iconBtn(actionIconArticle, "Write article", {
            cursorPointer: true,
          })}
        </div>
        {postButton}
      </div>
    </div>
  )
}

function FeedComposerInner() {
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [modalInitialContent, setModalInitialContent] = useState("")
  const createPostMutation = useCreatePost()
  const isPending = createPostMutation.isPending

  function openPostModal(initial: string) {
    setModalInitialContent(initial)
    setPostModalOpen(true)
  }

  function PostOpenButton() {
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() => openPostModal("")}
        className={cn(
          "cursor-pointer _feed_inner_text_area_btn_link inline-flex h-auto min-h-0 items-center justify-center gap-2 rounded-md border border-transparent bg-[var(--color5)] px-6 py-2 shadow-none max-lg:h-10 max-lg:w-[100px] max-lg:min-h-10 max-lg:min-w-[100px] max-lg:px-0 max-lg:py-0",
          transitionFeed,
          "hover:bg-[var(--html-blue-alt)] active:scale-[0.98] active:bg-[var(--html-blue-deep)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)] max-lg:focus-visible:ring-offset-[var(--feed-composer-tint)]"
        )}
      >
        {postBtnIcon}
        <span className="text-base font-medium leading-6 tracking-normal text-[var(--feed-text-on-accent)]">
          {isPending ? "Posting…" : "Post"}
        </span>
      </Button>
    )
  }

  return (
    <>
      <Card
        className={cn(
          "_feed_inner_text_area _b_radious6 _mar_b16 mb-4 rounded-md border-0 bg-[var(--feed-surface-elevated)] shadow-none",
          transitionFeed
        )}
      >
        <CardContent className="p-6">
          <div className="_feed_inner_text_area_box flex items-start">
            <Button
              type="button"
              variant="ghost"
              aria-label="Account"
              disabled={isPending}
              className={cn(
                "_feed_inner_text_area_box_image mr-2 h-auto shrink-0 rounded-full p-0 hover:bg-transparent",
                "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)]"
              )}
            >
              <Image
                src="/images/txt_img.png"
                alt=""
                width={40}
                height={40}
                className="_txt_img max-h-10 max-w-10 rounded-full object-cover p-px"
              />
            </Button>
            <div className="_feed_inner_text_area_box_form relative h-full min-h-0 w-full">
              <div className="relative space-y-0 ">
                <textarea
                  readOnly
                  autoComplete="off"
                  rows={3}
                  placeholder=""
                  disabled={isPending}
                  value=""
                  aria-label="Write a post — opens editor"
                  onClick={() => {
                    if (!isPending) openPostModal("")
                  }}
                  onKeyDown={(e) => {
                    if (isPending) return
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openPostModal("")
                    }
                  }}
                  className={cn(composerTextareaClassName, "peer")}
                />
                <label
                  className={cn(
                    "_feed_textarea_label pointer-events-none absolute left-0 top-0 z-[1] flex items-start gap-2 p-2",
                    "text-base font-normal leading-[1.1] text-[var(--feed-text-secondary)]",
                    transitionFeed,
                    "peer-focus:opacity-0"
                  )}
                >
                  Write something ...
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="24"
                    fill="none"
                    viewBox="0 0 23 24"
                    className="shrink-0 text-[var(--feed-explore-icon)] [&_path]:fill-current"
                    aria-hidden
                  >
                    <path
                      fill="currentColor"
                      d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.006h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
                    />
                  </svg>
                </label>
              </div>
            </div>
          </div>
          <ComposerActionsDesktop
            isPending={isPending}
            onPhotoClick={() => openPostModal("")}
            postButton={<PostOpenButton />}
          />
          <ComposerActionsMobile
            isPending={isPending}
            onPhotoClick={() => openPostModal("")}
            postButton={<PostOpenButton />}
          />
        </CardContent>
      </Card>

      <FeedPostModal
        open={postModalOpen}
        onOpenChange={setPostModalOpen}
        initialContent={modalInitialContent}
        mutation={createPostMutation}
      />
    </>
  )
}

export function FeedComposer() {
  return (
    <Alert stackClassName={feedComposerAlertStackClassName}>
      <FeedComposerInner />
    </Alert>
  )
}
