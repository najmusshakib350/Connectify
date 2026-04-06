import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { useAlert } from "@/components/ui/alerts/Alert"
import { createPost, type CreatePostPayload } from "@/features/feed/api/posts.api"


export const feedPostsQueryKey = ["feed", "posts"] as const

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { showSuccess, showError } = useAlert()

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const token = session?.accessToken
      if (!token) {
        throw new Error("You must be signed in to post.")
      }
      return createPost(token, payload)
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: feedPostsQueryKey })
      showSuccess(
        typeof data.message === "string" && data.message.length > 0
          ? data.message
          : "Your post was published.",
        "Success"
      )
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Could not create post"
      showError(message, "Error")
    },
  })
}
