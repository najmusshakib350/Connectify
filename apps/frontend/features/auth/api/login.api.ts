

export type BackendLoginSuccess = {
  access_token: string
}

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

export async function loginWithBackend(
  email: string,
  password: string
): Promise<BackendLoginSuccess> {
  const url = `${getApiBaseUrl()}/auth/login`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
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
      res.statusText || "Login failed"
    )
    throw new Error(message)
  }

  const token = (body as { access_token?: unknown })?.access_token
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Invalid response from server")
  }

  return { access_token: token }
}
