"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { Toggle } from "@/components/ui/toggle"

interface Note {
  id: string
  title: string
  created_at: string
  updated_at: string
}

const THEME_STORAGE_KEY = "theme-preference"
type ThemeMode = "system" | "light" | "dark"

function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return
  const root = document.documentElement
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const isDark = mode === "dark" || (mode === "system" && prefersDark)
  root.classList.toggle("dark", isDark)
}

export function NavSecondary() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) || "system"
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialIsDark = saved === "dark" || (saved === "system" && prefersDark)
    setIsDark(initialIsDark)
  }, [])

  const handleThemeToggle = (checked: boolean) => {
    setIsDark(checked)
    const mode: ThemeMode = checked ? "dark" : "light"
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    applyTheme(mode)
  }

  return (
    <SidebarGroup className="mt-auto">
      
        <SidebarMenu>

          <SidebarMenuItem>
            <div className="flex items-center justify-center px-2 py-1.5">
              <Toggle
                aria-label="Toggle dark mode"
                pressed={isDark}
                onPressedChange={handleThemeToggle}
                variant="outline"
                size="default"
                className="border-none shadow-none data-[state=on]:bg-background  "
              >
                {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Toggle>
            </div>
          </SidebarMenuItem>
         
        </SidebarMenu>
    </SidebarGroup>
  )
}
