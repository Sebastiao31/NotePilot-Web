"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNoteSidebar } from "./note-provider"

export function NoteInset({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, width } = useNoteSidebar()
  return (
    <div className={cn("relative flex flex-col w-full min-w-0 transition-[padding-left] duration-300 ease-in-out", className)} style={{ paddingLeft: open ? width : undefined }}>
      {children}
    </div>
  )
}


