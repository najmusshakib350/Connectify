"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  asChild: _asChild,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  asChild?: boolean
}) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-full border border-[var(--bcolor2,#f5f5f5)] bg-[var(--bg2,#fff)] outline-none transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--color5,#1890ff)] data-[state=checked]:bg-transparent data-[state=checked]:text-[var(--color5,#1890ff)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <span className="size-2 rounded-full bg-[var(--color5,#1890ff)]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
