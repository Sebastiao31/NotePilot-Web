"use client"

import * as React from "react"

type ChatSidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  chatToggle: () => void
  width: number
  setWidth: (width: number) => void
  minWidth: number
  maxWidth: number
}

const ChatSidebarContext = React.createContext<ChatSidebarContextValue | null>(null)

export function useChatSidebar() {
  const ctx = React.useContext(ChatSidebarContext)
  if (!ctx) {
    throw new Error("useChatSidebar must be used within a ChatProvider")
  }
  return ctx
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const chatToggle = React.useCallback(() => setOpen((v) => !v), [])
  const minWidth = 280
  const maxWidth = 720
  const defaultWidth = 384

  const clamp = React.useCallback((value: number) => {
    return Math.min(maxWidth, Math.max(minWidth, value))
  }, [minWidth, maxWidth])

  const [width, _setWidth] = React.useState<number>(defaultWidth)

  React.useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("chatSidebarWidth") : null
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!Number.isNaN(parsed)) {
          _setWidth(clamp(parsed))
        }
      }
    } catch {}
  }, [clamp])

  // Do not persist open/close across pages: always start closed, SiteHeader will control per-route default
  React.useEffect(() => {
    setOpen(false)
  }, [])

  const setWidth = React.useCallback((value: number | ((w: number) => number)) => {
    _setWidth((prev) => {
      const next = typeof value === "function" ? (value as (w: number) => number)(prev) : value
      const clamped = clamp(next)
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("chatSidebarWidth", String(clamped))
        }
      } catch {}
      return clamped
    })
  }, [clamp])

  const value = React.useMemo(
    () => ({ open, setOpen, chatToggle, width, setWidth, minWidth, maxWidth }),
    [open, width, setWidth, minWidth, maxWidth]
  )

  return (
    <ChatSidebarContext.Provider value={value}>{children}</ChatSidebarContext.Provider>
  )
}


