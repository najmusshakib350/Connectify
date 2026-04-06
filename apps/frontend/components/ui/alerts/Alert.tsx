"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle2, X, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const AUTO_HIDE_MS = 30_000

const alertSurfaceVariants = cva(
  "relative flex w-full max-w-[min(100vw-2rem,24rem)] items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-lg pointer-events-auto",
  {
    variants: {
      variant: {
        success: "border-emerald-500/40 [&>svg]:text-emerald-600 dark:border-emerald-500/50 dark:[&>svg]:text-emerald-400",
        error:
          "border-destructive/50 text-destructive dark:border-destructive/60 [&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export type AlertVariant = NonNullable<
  VariantProps<typeof alertSurfaceVariants>["variant"]
>

export type ShowAlertOptions = {
  variant: AlertVariant
  message: string
  title?: string
}

type AlertItem = ShowAlertOptions & { id: string }

type AlertContextValue = {
  show: (options: ShowAlertOptions) => string
  showSuccess: (message: string, title?: string) => string
  showError: (message: string, title?: string) => string
  dismiss: (id: string) => void
}

const AlertContext = React.createContext<AlertContextValue | null>(null)

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function AlertToast({
  item,
  onDismiss,
}: {
  item: AlertItem
  onDismiss: () => void
}) {
  const Icon = item.variant === "success" ? CheckCircle2 : XCircle

  return (
    <div
      className={cn(alertSurfaceVariants({ variant: item.variant }))}
      role="alert"
      aria-live={item.variant === "error" ? "assertive" : "polite"}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1 space-y-1">
        {item.title ? (
          <p className="text-sm font-semibold leading-none text-foreground">
            {item.title}
          </p>
        ) : null}
        <p
          className={cn(
            "text-sm leading-snug",
            item.variant === "error"
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        >
          {item.message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-foreground/60 opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label="Dismiss alert"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

const DEFAULT_ALERT_STACK_CLASS =
  "fixed top-4 right-4 z-[100] flex max-h-[calc(100vh-2rem)] w-[min(100vw-2rem,24rem)] flex-col gap-2 overflow-y-auto pointer-events-none"

/**
 * Root provider: fixed top-right stack, multiple alerts, auto-hide after 30s.
 * Wrap the app (e.g. in layout) and use `useAlert()` in any descendant.
 *
 * Optional `stackClassName` replaces the toast container positioning/stacking
 * (e.g. higher z-index above fixed chrome such as feed headers).
 */
export function Alert({
  children,
  stackClassName,
}: {
  children: React.ReactNode
  stackClassName?: string
}) {
  const [items, setItems] = React.useState<AlertItem[]>([])
  const timersRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  )

  const dismiss = React.useCallback((id: string) => {
    const t = timersRef.current.get(id)
    if (t !== undefined) {
      clearTimeout(t)
      timersRef.current.delete(id)
    }
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const push = React.useCallback(
    (options: ShowAlertOptions) => {
      const id = createId()
      setItems((prev) => [{ id, ...options }, ...prev])
      const timer = setTimeout(() => {
        dismiss(id)
      }, AUTO_HIDE_MS)
      timersRef.current.set(id, timer)
      return id
    },
    [dismiss]
  )

  const showSuccess = React.useCallback(
    (message: string, title?: string) =>
      push({ variant: "success", message, title }),
    [push]
  )

  const showError = React.useCallback(
    (message: string, title?: string) =>
      push({ variant: "error", message, title }),
    [push]
  )

  const value = React.useMemo<AlertContextValue>(
    () => ({
      show: push,
      showSuccess,
      showError,
      dismiss,
    }),
    [push, showSuccess, showError, dismiss]
  )

  React.useEffect(() => {
    return () => {
      for (const t of timersRef.current.values()) {
        clearTimeout(t)
      }
      timersRef.current.clear()
    }
  }, [])

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div
        className={stackClassName ?? DEFAULT_ALERT_STACK_CLASS}
        aria-label="Notifications"
      >
        {items.map((item) => (
          <AlertToast
            key={item.id}
            item={item}
            onDismiss={() => dismiss(item.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  )
}

export function useAlert(): AlertContextValue {
  const ctx = React.useContext(AlertContext)
  if (!ctx) {
    throw new Error("useAlert must be used within an Alert provider")
  }
  return ctx
}
