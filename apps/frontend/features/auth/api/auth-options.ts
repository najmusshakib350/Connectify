import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { loginWithBackend } from "@/features/auth/api/login.api"


const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

function decodeJwtPayload(token: string): { sub?: string; email?: string } {
  try {
    const part = token.split(".")[1]
    if (!part) return {}
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/")
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=")
    const json = atob(padded)
    return JSON.parse(json) as { sub?: string; email?: string }
  } catch {
    return {}
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()
        const password = credentials?.password
        if (!email || !password) {
          throw new Error("Email and password are required")
        }

        const { access_token } = await loginWithBackend(email, password)
        const payload = decodeJwtPayload(access_token)
        const id = payload.sub
        if (!id) {
          throw new Error("Invalid token from server")
        }

        return {
          id,
          email: payload.email ?? email,
          accessToken: access_token,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "accessToken" in user && typeof user.accessToken === "string") {
        token.accessToken = user.accessToken
        token.sub = user.id
        if (user.email) token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken
      }
      if (token.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
          email: token.email as string | null | undefined,
        }
      }
      return session
    },
  },
}
