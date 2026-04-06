
export type FeedPostAuthor = {
  id: string
  name: string
  avatar: null
}

export type FeedPostItem = {
  id: string
  text: string
  imageUrl: string | null
  visibility: "public" | "private"
  createdAt: string
  author: FeedPostAuthor
  likeCount: number
  commentCount: number
  isLikedByMe: boolean
}

export type FeedPostsPageData = {
  posts: FeedPostItem[]
  nextCursor: string | null
}

export type GetPostsApiResponse = {
  success: true
  data: FeedPostsPageData
  message: string
}


export const FEED_POSTS_PAGE_SIZE = 10


export type CreatePostPayload = {
  content: string
  visibility: "public" | "private"
  image?: File
}

export type CreatePostApiResponse = {
  success: boolean
  data: unknown
  message: string
}

function getApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (base && base.length > 0) {
    return base.replace(/\/$/, "")
  }
  return "http://localhost:3000"
}


export function resolvePostMediaUrl(path: string | null): string | null {
  if (!path || path.length === 0) return null
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }
  const base = getApiBaseUrl().replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

function parseErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback
  }
  const message = (data as { message?: unknown }).message
  if (typeof message === "string" && message.length > 0) {
    return message
  }
  if (Array.isArray(message) && message.length > 0) {
    const first = message[0]
    if (typeof first === "string") {
      return first
    }
  }
  return fallback
}

export async function createPost(
  accessToken: string,
  payload: CreatePostPayload
): Promise<CreatePostApiResponse> {
  const formData = new FormData()
  formData.append("text", payload.content)
  formData.append("visibility", payload.visibility)
  if (payload.image) {
    formData.append("image", payload.image)
  }

  const url = `${getApiBaseUrl()}/posts`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })

  let body: unknown
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    const message = parseErrorMessage(
      body,
      res.statusText || "Could not create post"
    )
    throw new Error(message)
  }

  if (
    !body ||
    typeof body !== "object" ||
    (body as CreatePostApiResponse).success !== true
  ) {
    throw new Error("Invalid response from server")
  }

  return body as CreatePostApiResponse
}

export async function fetchPostsPage(
  accessToken: string,
  params: { cursor?: string; limit?: number }
): Promise<FeedPostsPageData> {
  const url = new URL(`${getApiBaseUrl()}/posts`)
  if (params.cursor !== undefined && params.cursor.length > 0) {
    url.searchParams.set("cursor", params.cursor)
  }
  if (params.limit !== undefined) {
    url.searchParams.set("limit", String(params.limit))
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  })

  let body: unknown
  try {
    body = await res.json()
  } catch {
    body = null
  }

  if (!res.ok) {
    const message = parseErrorMessage(
      body,
      res.statusText || "Could not load posts"
    )
    throw new Error(message)
  }

  if (
    !body ||
    typeof body !== "object" ||
    (body as GetPostsApiResponse).success !== true
  ) {
    throw new Error("Invalid response from server")
  }

  const data = (body as GetPostsApiResponse).data
  if (!data || !Array.isArray(data.posts)) {
    throw new Error("Invalid response from server")
  }

  return data
}
