import { z } from "zod"

export const registrationSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(120, "First name is too long")
      .transform((s) => s.trim())
      .refine((s) => s.length > 0, {
        message: "First name is required",
      }),
    lastName: z
      .string()
      .max(120, "Last name is too long")
      .transform((s) => s.trim()),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    repeatPassword: z.string().min(1, "Repeat password is required"),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: "You must agree to terms & conditions",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["repeatPassword"],
      })
    }
  })

export type RegistrationFormValues = z.input<typeof registrationSchema>
export type RegistrationPayload = z.output<typeof registrationSchema>
