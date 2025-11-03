"use client"

import * as React from "react"

type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "destructive"
}

const bus: EventTarget = ((): EventTarget => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.__toastBus = window.__toastBus || new EventTarget()
    // @ts-ignore
    return window.__toastBus as EventTarget
  }
  return new EventTarget()
})()

export function showToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2)
  bus.dispatchEvent(new CustomEvent("toast:show", { detail: { ...toast, id } }))
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  React.useEffect(() => {
    const onShow = (e: Event) => {
      const t = (e as CustomEvent).detail as Toast
      setToasts((prev) => [t, ...prev])
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id))
      }, 3000)
    }
    bus.addEventListener("toast:show", onShow)
    return () => bus.removeEventListener("toast:show", onShow)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-56 max-w-80 rounded-md border px-4 py-3 shadow-sm text-sm bg-background ${
            t.variant === "destructive"
              ? "border-red-300 text-red-900 dark:text-red-200"
              : t.variant === "success"
              ? "border-green-300 text-green-900 dark:text-green-200"
              : "border-border"
          }`}
        >
          {t.title ? <div className="font-medium">{t.title}</div> : null}
          {t.description ? <div className="mt-0.5 opacity-90">{t.description}</div> : null}
        </div>
      ))}
    </div>
  )
}


