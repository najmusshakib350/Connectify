"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useCallback, useMemo, useState } from "react"

import type { AppSessionUser, AuthStatus } from "@/features/auth/types/session"

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string }

export function useAuth() {
  const { data: session, status } = useSession()
  const [loginPending, setLoginPending] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoginPending(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        const message =
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        return { ok: false as const, error: message }
      }
      if (result?.ok !== true) {
        return { ok: false as const, error: "Login failed" }
      }
      return { ok: true as const }
    } finally {
      setLoginPending(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" })
  }, [])

  const authStatus: AuthStatus =
    status === "loading" ? "loading" : status === "authenticated" ? "authenticated" : "unauthenticated"

  const user: AppSessionUser | null = useMemo(() => {
    if (!session?.user?.id) return null
    return session.user as AppSessionUser
  }, [session])

  const isLoading = status === "loading" || loginPending

  return {
    session,
    user,
    accessToken: session?.accessToken ?? null,
    status: authStatus,
    isLoading,
    login,
    logout,
  }
}
