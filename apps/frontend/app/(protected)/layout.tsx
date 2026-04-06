import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { FeedThemeProvider } from "@/components/providers/ThemeProvider"
import { authOptions } from "@/features/auth/api/auth-options"

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  return <FeedThemeProvider>{children}</FeedThemeProvider>
}