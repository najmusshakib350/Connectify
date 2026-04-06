import type { RegisterRequest, RegisterResponse } from "@/features/auth/types/register-api.types"

function getApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (base && base.length > 0) {
    return base.replace(/\/$/, "")
  }
  return "http://localhost:3000"
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


export async function registerUser(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const url = `${getApiBaseUrl()}/auth/register`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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
      res.statusText || "Registration failed"
    )
    throw new Error(message)
  }

  return body as RegisterResponse
}
