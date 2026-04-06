"use client"

import { SessionProvider } from "next-auth/react"

type Props = {
  children: React.ReactNode
}

export function AuthSessionProvider({ children }: Props) {
  return (
    <SessionProvider refetchOnWindowFocus refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  )
}
