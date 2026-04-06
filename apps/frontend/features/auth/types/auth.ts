import { z } from "zod"


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginFormValues = z.input<typeof loginSchema>
export type LoginPayload = z.output<typeof loginSchema>

export type { AppSession, AppSessionUser, AuthStatus } from "./session"
