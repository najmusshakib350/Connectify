"use client"

import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useAlert } from "@/components/ui/alerts/Alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRegister } from "@/features/auth/hooks/useRegister"
import {
  registrationSchema,
  type RegistrationFormValues,
} from "@/features/auth/types/registration"

const defaultFormValues: RegistrationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  repeatPassword: "",
  agreeToTerms: false,
}

const inputClassName =
  "h-12 w-full rounded-[6px] border border-[var(--bcolor2)] bg-[var(--bg2)] px-3 text-base font-normal leading-normal text-[var(--color6)] shadow-none outline-none ring-0 ring-offset-0 transition-none placeholder:text-[13px] placeholder:font-normal placeholder:leading-[1.4] placeholder:text-[var(--color)] focus:border-[var(--bcolor2)] focus:outline-none focus:ring-0 focus-visible:border-[var(--bcolor2)] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base aria-invalid:border-destructive aria-invalid:ring-0"

export function RegistrationForm() {
  const { showSuccess, showError } = useAlert()

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: defaultFormValues,
  })

  const { mutate, isPending } = useRegister({
    onSuccess: () => {
      form.reset(defaultFormValues)
      showSuccess(
        "Your account has been created. You can sign in with your email and password.",
        "Registration successful"
      )
    },
    onError: (error) => {
      showError(error.message, "Registration failed")
    },
  })

  function onSubmit(values: RegistrationFormValues) {
    const parsed = registrationSchema.parse(values)
    mutate({
      firstName: parsed.firstName,
      lastName:
        parsed.lastName.length > 0 ? parsed.lastName : undefined,
      email: parsed.email,
      password: parsed.password,
      repeatPassword: parsed.repeatPassword,
      agreeToTerms: parsed.agreeToTerms,
    })
  }

  return (
    <Card
      suppressHydrationWarning
      className="max-[991px]:mt-[30px] max-[991px]:text-center gap-0 rounded-[6px] border-0 bg-[var(--bg2)] p-12 shadow-none"
    >
        <CardContent className="p-0">
          <div className="mx-auto mb-7 block max-w-[161px] max-[991px]:mx-auto">
            <Image
              src="/images/logo.svg"
              alt=""
              width={161}
              height={48}
              className="h-auto w-full max-w-full"
              sizes="161px"
              priority
            />
          </div>
          <p className="mb-2 text-center font-normal leading-[1.4] text-[var(--color)]">
            Get Started Now
          </p>
          <h4 className="mb-[50px] text-center text-[28px] font-normal leading-[1.4] text-[var(--color6)]">
            Registration
          </h4>
          <Button
            type="button"
            variant="outline"
            className="mb-10 h-auto w-full max-[991px]:mx-auto max-[991px]:flex justify-center rounded-[6px] border border-[var(--bcolor1)] bg-[var(--bg2)] py-3 pr-[60px] pl-[60px] font-normal shadow-none transition-none hover:bg-[var(--bg2)]"
          >
            <Image
              src="/images/google.svg"
              alt=""
              width={20}
              height={20}
              className="mr-2 h-auto w-auto max-w-[20px] shrink-0"
              sizes="20px"
            />
            <span className="cursor-pointer flex-none text-base font-medium leading-[1.4] text-[var(--color2)]">
              Register with google
            </span>
          </Button>
          <div className="mb-10 flex items-center">
            <div className="flex flex-1 justify-end pr-2">
              <div className="h-0.5 w-[44%] rounded-md border border-[var(--bg4)] lg:w-[108px]" />
            </div>
            <span className="shrink-0 text-sm font-normal leading-[1.4] text-[var(--color3)]">
              Or
            </span>
            <div className="flex flex-1 justify-start pl-2">
              <div className="h-0.5 w-[44%] rounded-md border border-[var(--bg4)] lg:w-[108px]" />
            </div>
          </div>
          <Form {...form}>
            <form
              suppressHydrationWarning
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-0"
            >
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="mb-[14px] space-y-0">
                    <FormLabel className="mb-2 block text-base font-medium leading-[1.4] text-[var(--color4)]">
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="given-name"
                        className={inputClassName}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="mb-[14px] space-y-0">
                    <FormLabel className="mb-2 block text-base font-medium leading-[1.4] text-[var(--color4)]">
                      Last name{" "}
                      <span className="font-normal text-[var(--color)]">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="family-name"
                        className={inputClassName}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-[14px] space-y-0">
                    <FormLabel className="mb-2 block text-base font-medium leading-[1.4] text-[var(--color4)]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        className={inputClassName}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-[14px] space-y-0">
                    <FormLabel className="mb-2 block text-base font-medium leading-[1.4] text-[var(--color4)]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        className={inputClassName}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem className="mb-[14px] space-y-0">
                    <FormLabel className="mb-2 block text-base font-medium leading-[1.4] text-[var(--color4)]">
                      Repeat Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        className={inputClassName}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full max-[991px]:flex max-[991px]:justify-center">
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col space-y-0 gap-0 max-[991px]:items-center">
                      <div className="flex flex-row items-center gap-2 max-[991px]:justify-center">
                        <FormControl>
                          <Checkbox
                            checked={Boolean(field.value)}
                            disabled={isPending}
                            onCheckedChange={(v) => field.onChange(v === true)}
                          />
                        </FormControl>
                        <FormLabel className="mb-0 cursor-pointer text-sm font-normal leading-[1.4] text-[var(--color)]">
                          I agree to terms & conditions
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-[60px] mt-10">
                <Button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className="cursor-pointer h-auto w-full rounded-[6px] border border-transparent bg-[var(--color5)] py-3 pr-[116px] pl-[116px] text-base font-medium text-white shadow-none transition-none hover:bg-[var(--color5)] hover:shadow-[0px_8px_24px_rgba(149,157,165,0.2)] disabled:pointer-events-none disabled:opacity-60"
                >
                  {isPending ? "Please wait…" : "Register now"}
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-center text-sm leading-normal text-[var(--color)]">
          Already have an account?{" "}
            <Link href="/login" className="text-[var(--color5)]">
            Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
  )
}
