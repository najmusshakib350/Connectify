import { z } from "zod"

export const feedHeaderSearchSchema = z.object({
  query: z.string().max(200).trim(),
})

export type FeedHeaderSearchValues = z.infer<typeof feedHeaderSearchSchema>

const MAX_POST_TEXT = 8000
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"] as const

export const feedVisibilitySchema = z.enum(["public", "private"])


export const feedPostModalSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, { message: "Write something before posting" })
      .max(MAX_POST_TEXT),
    visibility: feedVisibilitySchema,
    image: z.custom<File | undefined>().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.image) return
    if (val.image.size > MAX_IMAGE_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image must be 5MB or smaller",
        path: ["image"],
      })
    }
    if (!IMAGE_MIME.includes(val.image.type as (typeof IMAGE_MIME)[number])) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use JPG, PNG, or WebP",
        path: ["image"],
      })
    }
  })

export type FeedPostModalValues = z.infer<typeof feedPostModalSchema>

export const feedFriendsSearchSchema = z.object({
  query: z.string().max(200).trim(),
})

export type FeedFriendsSearchValues = z.infer<typeof feedFriendsSearchSchema>

export const feedCommentSchema = z.object({
  comment: z.string().max(4000).trim(),
})

export type FeedCommentValues = z.infer<typeof feedCommentSchema>


export type { FeedPostItem as FeedTimelinePostData } from "@/features/feed/api/posts.api"

export type FeedFriendRow = {
  id: string
  name: string
  title: string
  image: string
  side: "time" | "online"
  timeLabel?: string
  inactive?: boolean
}
