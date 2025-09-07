"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import OnboardingGate from "./onboarding-gate"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/sign-in")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    )
  }

  if (!user) return null

  return (
    <OnboardingGate>
      {children}
    </OnboardingGate>
  )
}


