import { NextResponse } from "next/server"


export async function GET(request: Request) {
  const signOut = new URL("/api/auth/signout", request.url)
  signOut.searchParams.set("callbackUrl", "/login")
  return NextResponse.redirect(signOut)
}
