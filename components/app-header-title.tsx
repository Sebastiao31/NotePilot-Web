"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export function AppHeaderTitle() {
  const pathname = usePathname()

  let title = ""
  if (pathname?.startsWith("/all-notes/folders")) {
    title = "Folders"
  } else if (pathname?.startsWith("/all-notes")) {
    title = "All Notes"
  } else if (pathname?.startsWith("/settings")) {
    title = "Settings"
  } else if (pathname?.startsWith("/help")) {
    title = "Help"
  } else {
    title = ""
  }

  return (
    <h1 className="text-lg font-semibold tracking-tight text-foreground">
      {title}
    </h1>
  )
}


