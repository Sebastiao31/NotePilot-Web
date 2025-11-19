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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IconBoltFilled } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const [allowed, setAllowed] = React.useState<boolean>(false)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/billing/has-quiz", { method: "GET", cache: "no-store" })
        const data = await res.json()
        if (!cancelled) setAllowed(Boolean(data?.allowed))
      } catch {
        if (!cancelled) setAllowed(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

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

          <div className={allowed ? "hidden" : ""}>
            <SidebarMenuItem>
              <Tooltip>
                <TooltipTrigger>
                  <Button size="icon-sm" onClick={() => router.push("/pricing")}>
                    <IconBoltFilled className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Upgrade to Pro
                </TooltipContent>
              </Tooltip>
            </SidebarMenuItem>

            <Separator
              className="h-full mt-4"
            />
          </div>

          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger>
              <Toggle
                aria-label="Toggle dark mode"
                pressed={isDark}
                onPressedChange={handleThemeToggle}
                variant="outline"
                size="sm"
                className="border-none shadow-none data-[state=on]:bg-background  "
              >
                {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Theme</p>
            </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
         
        </SidebarMenu>
    </SidebarGroup>
  )
}
