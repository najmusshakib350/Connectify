import type { Session } from "next-auth"


export type AppSession = Session & {
  accessToken?: string
  user: Session["user"] & { id: string }
}

export type AppSessionUser = AppSession["user"]

export type AuthStatus = "loading" | "authenticated" | "unauthenticated"
