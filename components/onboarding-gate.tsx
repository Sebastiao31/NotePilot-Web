"use client"

import * as React from "react"
import { useCheckOnboarding } from "@/hooks/use-check-onboarding"
import WelcomeModal from "@/components/modals/welcome"
import OnboardingModal from "@/components/modals/onboarding"

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { loading, state, completeOnboarding, skipOnboarding } = useCheckOnboarding()
  const [showWelcome, setShowWelcome] = React.useState(false)
  const [showOnboarding, setShowOnboarding] = React.useState(false)

  React.useEffect(() => {
    if (loading) return
    if (!state?.onboardingDone) {
      setShowWelcome(true)
    } else {
      setShowWelcome(false)
      setShowOnboarding(false)
    }
  }, [loading, state?.onboardingDone])

  const handleWelcomeContinue = () => {
    setShowWelcome(false)
    setShowOnboarding(true)
  }

  const handleSubmit = async (answers: { heardAbout: string | null; primaryUse: string | null; language: string }) => {
    await completeOnboarding(answers)
    setShowOnboarding(false)
  }

  const handleSkip = async () => {
    await skipOnboarding()
    setShowOnboarding(false)
  }

  return (
    <>
      {children}
      <WelcomeModal open={!!showWelcome} onContinue={handleWelcomeContinue} />
      <OnboardingModal open={!!showOnboarding} onSkip={handleSkip} onSubmit={handleSubmit} />
    </>
  )
}


