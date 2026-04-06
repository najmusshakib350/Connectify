"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { UseMutationResult } from "@tanstack/react-query"
import {
  Check,
  ChevronDown,
  Globe,
  Lock,
  X,
  type LucideIcon,
} from "lucide-react"
import Image from "next/image"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type {
  CreatePostApiResponse,
  CreatePostPayload,
} from "@/features/feed/api/posts.api"
import {
  feedPostModalSchema,
  feedVisibilitySchema,
  type FeedPostModalValues,
} from "@/features/feed/types/feed"
import type { z } from "zod"

const transitionFeed = "transition-all duration-200 ease-in-out"

type FeedVisibility = z.infer<typeof feedVisibilitySchema>

const VISIBILITY_OPTIONS: {
  value: FeedVisibility
  label: string
  description: string
  Icon: LucideIcon
}[] = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can see this post.",
    Icon: Globe,
  },
  {
    value: "private",
    label: "Private",
    description: "Only you can see this post.",
    Icon: Lock,
  },
]

function PostVisibilityPicker({
  value,
  onChange,
  onBlur,
  disabled,
}: {
  value: FeedVisibility
  onChange: (v: FeedVisibility) => void
  onBlur: () => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [panelRect, setPanelRect] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)

  const listboxId = `${useId()}-visibility-listbox`

  const updatePanelRect = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const width = Math.min(Math.max(r.width, 220), window.innerWidth - 16)
    const left = Math.min(
      Math.max(8, r.left),
      Math.max(8, window.innerWidth - width - 8)
    )
    setPanelRect({
      top: r.bottom + 6,
      left,
      width,
    })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPanelRect(null)
      return
    }
    updatePanelRect()
    window.addEventListener("resize", updatePanelRect)
    window.addEventListener("scroll", updatePanelRect, true)
    return () => {
      window.removeEventListener("resize", updatePanelRect)
      window.removeEventListener("scroll", updatePanelRect, true)
    }
  }, [open, updatePanelRect])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (rootRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLButtonElement>('[role="option"]')?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [open])

  const handleBlur = useCallback(() => {
    requestAnimationFrame(() => {
      const active = document.activeElement
      if (
        rootRef.current?.contains(active) ||
        panelRef.current?.contains(active)
      ) {
        return
      }
      onBlur()
      setOpen(false)
    })
  }, [onBlur])

  function handleListKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (!panelRef.current) return
    const opts = [
      ...panelRef.current.querySelectorAll<HTMLButtonElement>('[role="option"]'),
    ]
    if (opts.length === 0) return
    const i = opts.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      opts[Math.min(i < 0 ? 0 : i + 1, opts.length - 1)]?.focus()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      opts[Math.max(i <= 0 ? 0 : i - 1, 0)]?.focus()
    } else if (e.key === "Home") {
      e.preventDefault()
      opts[0]?.focus()
    } else if (e.key === "End") {
      e.preventDefault()
      opts[opts.length - 1]?.focus()
    }
  }

  const current = VISIBILITY_OPTIONS.find((o) => o.value === value) ?? VISIBILITY_OPTIONS[0]
  const CurrentIcon = current.Icon

  const panel =
    open && panelRect && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={panelRef}
            id={listboxId}
            role="listbox"
            aria-label="Who can see this post"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            onBlur={handleBlur}
            className={cn(
              "isolate overflow-hidden rounded-lg border border-border py-1 opacity-100",
              "bg-popover text-popover-foreground shadow-lg",
              "ring-1 ring-black/[0.06] dark:ring-white/10",
              "zoom-in-95 slide-in-from-top-1 duration-200 ease-out fill-mode-forwards [animation:var(--animate-in)]"
            )}
            style={{
              position: "fixed",
              top: panelRect.top,
              left: panelRect.left,
              width: panelRect.width,
              zIndex: 400,
            }}
          >
            {VISIBILITY_OPTIONS.map((opt) => {
              const OptIcon = opt.Icon
              const selected = value === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left transition-colors duration-150",
                    "bg-popover hover:bg-muted active:bg-muted/80",
                    "focus-visible:bg-muted focus-visible:outline-none",
                    selected && "bg-muted"
                  )}
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--feed-composer-tint)] text-[var(--feed-explore-icon)]">
                    <OptIcon className="size-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="block text-sm font-semibold text-popover-foreground">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {opt.description}
                    </span>
                  </span>
                  {selected ? (
                    <Check
                      className="mt-1 size-4 shrink-0 text-[var(--color5)]"
                      aria-hidden
                    />
                  ) : (
                    <span className="mt-1 size-4 shrink-0" aria-hidden />
                  )}
                </button>
              )
            })}
          </div>,
          document.body
        )
      : null

  return (
    <div ref={rootRef} className="min-w-0 flex-1">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label="Who can see this post"
        className={cn(
          "flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-lg border border-border/70 bg-muted/25 px-3 py-2.5 text-left",
          "text-sm font-medium text-[var(--feed-text-secondary)]",
          transitionFeed,
          "hover:border-border hover:bg-muted/45 active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-[var(--color5)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--feed-surface-elevated)] focus-visible:outline-none",
          open &&
            "border-[var(--color5)]/45 bg-muted/40 ring-2 ring-[var(--color5)]/25 ring-offset-2 ring-offset-[var(--feed-surface-elevated)]",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onBlur={handleBlur}
        onClick={() => {
          if (!disabled) setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            if (!disabled) setOpen((o) => !o)
          }
          if (e.key === "ArrowDown" && !disabled) {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--feed-composer-tint)] text-[var(--feed-explore-icon)]">
          <CurrentIcon className="size-[18px]" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 truncate">{current.label}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      {panel}
    </div>
  )
}


const composerTextareaClassName = cn(
  "_textarea flex w-full resize-none border-0 bg-transparent p-2 text-xs leading-normal font-normal outline-none",
  "text-[var(--feed-composer-input-text)]",
  "placeholder:text-xs placeholder:font-normal placeholder:text-[var(--feed-placeholder)]",
  "min-h-[calc(86px+2px)]",
  transitionFeed,
  "focus:ring-0 focus-visible:ring-0",
  "cursor-text disabled:cursor-not-allowed disabled:opacity-50"
)

type FeedPostModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialContent?: string
  onPosted?: () => void
  mutation: UseMutationResult<
    CreatePostApiResponse,
    unknown,
    CreatePostPayload
  >
}

export function FeedPostModal({
  open,
  onOpenChange,
  initialContent = "",
  onPosted,
  mutation,
}: FeedPostModalProps) {
  const [fileInputKey, setFileInputKey] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const isPending = mutation.isPending

  const form = useForm<FeedPostModalValues>({
    resolver: zodResolver(feedPostModalSchema),
    defaultValues: {
      content: "",
      visibility: "public",
      image: undefined,
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      content: initialContent,
      visibility: "public",
      image: undefined,
    })
    setFileInputKey((k) => k + 1)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }, [open, initialContent, form.reset])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleSubmit(values: FeedPostModalValues) {
    mutation.mutate(
      {
        content: values.content,
        visibility: values.visibility,
        image: values.image,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onPosted?.()
        },
      }
    )
  }

  function clearImage() {
    form.setValue("image", undefined, { shouldValidate: true })
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setFileInputKey((k) => k + 1)
  }

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feed-post-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        disabled={isPending}
        onClick={() => {
          if (!isPending) onOpenChange(false)
        }}
      />
      <Card className="relative z-10 max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto border border-border bg-[var(--feed-surface-elevated)] shadow-lg">
        <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
          <h2
            id="feed-post-modal-title"
            className="text-lg font-semibold text-[var(--feed-composer-input-text)]"
          >
            Create post
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            disabled={isPending}
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" />
          </Button>
        </div>
        <CardContent className="space-y-4 p-4 pt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        aria-label="Account"
                        tabIndex={-1}
                        className={cn(
                          "h-auto shrink-0 rounded-full p-0 hover:bg-transparent",
                          "pointer-events-none opacity-100"
                        )}
                      >
                        <Image
                          src="/images/txt_img.png"
                          alt=""
                          width={40}
                          height={40}
                          className="max-h-10 max-w-10 rounded-full object-cover p-px"
                        />
                      </Button>
                      <FormControl>
                        <PostVisibilityPicker
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          disabled={isPending}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  const showEmptyHint = !field.value?.trim()
                  return (
                    <FormItem className="relative space-y-0">
                      <FormControl>
                        <textarea
                          {...field}
                          autoComplete="off"
                          rows={3}
                          placeholder=""
                          disabled={isPending}
                          aria-label="Post content"
                          className={composerTextareaClassName}
                        />
                      </FormControl>
                      <FormMessage />
                      {showEmptyHint ? (
                        <div
                          className={cn(
                            "_feed_textarea_label pointer-events-none absolute left-0 top-0 z-[1] flex items-start gap-2 p-2",
                            "text-base font-normal leading-[1.1] text-[var(--feed-text-secondary)]",
                            transitionFeed
                          )}
                          aria-hidden
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
                        </div>
                      ) : null}
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-[var(--feed-text-secondary)]">
                      Photo (optional, one image only)
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <Input
                          key={fileInputKey}
                          type="file"
                          multiple={false}
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isPending}
                          className="cursor-pointer text-sm file:mr-3"
                          onChange={(e) => {
                            const list = e.target.files
                            const file = list?.[0]
                            if (list && list.length > 1) {
                              form.setValue("image", undefined, {
                                shouldValidate: true,
                              })
                              form.setError("image", {
                                type: "manual",
                                message: "Only one image is allowed per post",
                              })
                              setFileInputKey((k) => k + 1)
                              e.target.value = ""
                              setPreviewUrl((prev) => {
                                if (prev) URL.revokeObjectURL(prev)
                                return null
                              })
                              return
                            }
                            form.clearErrors("image")
                            form.setValue("image", file, {
                              shouldValidate: true,
                            })
                            setPreviewUrl((prev) => {
                              if (prev) URL.revokeObjectURL(prev)
                              return file ? URL.createObjectURL(file) : null
                            })
                          }}
                        />
                        {previewUrl ? (
                          <div className="relative overflow-hidden rounded-lg border border-border/40 bg-muted/20">
                          
                            <img
                              src={previewUrl}
                              alt=""
                              className="max-h-64 w-full object-contain"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute right-2 top-2"
                              disabled={isPending}
                              onClick={clearImage}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer disabled:cursor-not-allowed"
                  disabled={isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer disabled:cursor-not-allowed"
                  disabled={isPending}
                >
                  {isPending ? "Posting…" : "Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
