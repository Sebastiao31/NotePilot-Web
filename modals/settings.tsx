"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [theme, setTheme] = React.useState<ThemeMode>("system")

  // Initialize from storage and apply
  React.useEffect(() => {
    const saved = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) || "system"
    setTheme(saved)
    applyTheme(saved)
  }, [])

  // Respond to system changes when in system mode
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const saved = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) || "system"
      if (saved === "system") applyTheme("system")
    }
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [])

  const handleChange = (value: ThemeMode) => {
    setTheme(value)
    localStorage.setItem(THEME_STORAGE_KEY, value)
    applyTheme(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your NotePilot experience.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium leading-none">Theme</span>
              <span className="text-muted-foreground mt-1 text-xs truncate">
                Choose light, dark, or follow your system
              </span>
            </div>
            <Select value={theme} onValueChange={(v) => handleChange(v as ThemeMode)}>
              <SelectTrigger className="min-w-[9rem]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
