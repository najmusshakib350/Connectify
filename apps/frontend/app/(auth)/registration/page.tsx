import Image from "next/image"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { Alert } from "@/components/ui/alerts/Alert"
import { authOptions } from "@/features/auth/api/auth-options"
import { RegistrationForm } from "@/features/auth/components/RegistrationForm"

export default async function RegistrationPage() {
  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/feed")
  }

  return (    <section className="relative z-[1] flex min-h-0 flex-1 bg-[var(--bg1)] py-[50px] lg:py-[100px]">
      <div className="pointer-events-none absolute top-0 left-0 -z-10 max-[991px]:hidden">
        <Image
          src="/images/shape1.svg"
          alt=""
          width={176}
          height={540}
          className="h-auto w-auto"
          sizes="176px"
        />
      </div>
      <div className="pointer-events-none absolute top-0 right-5 -z-10 max-[991px]:hidden">
        <Image
          src="/images/shape2.svg"
          alt=""
          width={568}
          height={400}
          className="h-auto w-auto"
          sizes="400px"
        />
      </div>
      <div className="pointer-events-none absolute right-[327px] bottom-0 -z-10 max-[991px]:hidden">
        <Image
          src="/images/shape3.svg"
          alt=""
          width={568}
          height={548}
          className="h-auto w-auto"
          sizes="400px"
        />
      </div>
      <div className="relative z-[1] w-full">
        <div className="mx-auto max-w-[1320px] px-3 sm:px-4">
          <div className="flex flex-col items-stretch lg:flex-row lg:items-center">
            <div className="w-full lg:w-[66.666%] xl:flex-[0_0_66.666%]">
              <div className="mx-auto w-full max-w-[633px]">
                <div className="relative w-full max-w-[633px]">
                  <Image
                    src="/images/registration.png"
                    alt=""
                    width={633}
                    height={500}
                    className="h-auto w-full max-w-[633px]"
                    sizes="(max-width: 1024px) 100vw, 633px"
                    priority
                  />
                  <div className="hidden" aria-hidden>
                    <Image
                      src="/images/registration1.png"
                      alt=""
                      width={633}
                      height={500}
                      className="h-auto w-full max-w-[633px]"
                      sizes="(max-width: 1024px) 100vw, 633px"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[33.333%] xl:flex-[0_0_33.333%]">
              <Alert>
                <RegistrationForm />
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
