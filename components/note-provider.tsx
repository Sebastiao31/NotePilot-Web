"use client"

import * as React from "react"

type NoteSidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  width: number
  setWidth: (width: number) => void
  minWidth: number
  maxWidth: number
  selectedFolder: string | null
  setSelectedFolder: (name: string | null) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
}

const NoteSidebarContext = React.createContext<NoteSidebarContextValue | null>(null)

export function useNoteSidebar() {
  const ctx = React.useContext(NoteSidebarContext)
  if (!ctx) {
    throw new Error("useNoteSidebar must be used within a NoteProvider")
  }
  return ctx
}

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((v) => !v), [])
  const defaultWidth = 320
  const minWidth = defaultWidth
  const maxWidth = defaultWidth
  const [width] = React.useState<number>(defaultWidth)
  const setWidth = React.useCallback((_value: number | ((w: number) => number)) => {
    // fixed width; no-op
    return
  }, [])

  // Folder filter state (null => all notes)
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState<string>("")

  const value = React.useMemo(
    () => ({ open, setOpen, toggle, width, setWidth, minWidth, maxWidth, selectedFolder, setSelectedFolder, searchQuery, setSearchQuery }),
    [open, width, setWidth, minWidth, maxWidth, selectedFolder, searchQuery]
  )

  return (
    <NoteSidebarContext.Provider value={value}>{children}</NoteSidebarContext.Provider>
  )
}


