"use client"

import * as React from "react"
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"

export type OnboardingState = {
  onboardingDone: boolean
  heardAbout: string | null
  primaryUse: string | null
  language: string
  createdAt?: unknown
  updatedAt?: unknown
}

const DEFAULT_LANGUAGE = "Auto-Detect"
const SKIP_LANGUAGE = "Auto_Detect"

export function useCheckOnboarding() {
  const { user } = useAuth()
  const [loading, setLoading] = React.useState<boolean>(!!user)
  const [state, setState] = React.useState<OnboardingState | null>(null)

  React.useEffect(() => {
    if (!user) {
      setState(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = doc(db, "users", user.uid, "onboarding", "state")

    ;(async () => {
      const snap = await getDoc(ref)
      if (!snap.exists()) {
        await setDoc(ref, {
          onboardingDone: false,
          heardAbout: null,
          primaryUse: null,
          language: DEFAULT_LANGUAGE,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    })().catch(() => {})

    const unsub = onSnapshot(
      ref,
      (s) => {
        const data = s.data() as OnboardingState | undefined
        setState(
          data ?? {
            onboardingDone: false,
            heardAbout: null,
            primaryUse: null,
            language: DEFAULT_LANGUAGE,
          }
        )
        setLoading(false)
      },
      () => setLoading(false)
    )

    return () => unsub()
  }, [user?.uid])

  const completeOnboarding = React.useCallback(
    async (answers: { heardAbout: string | null; primaryUse: string | null; language: string }) => {
      if (!user) return
      const ref = doc(db, "users", user.uid, "onboarding", "state")
      await updateDoc(ref, {
        onboardingDone: true,
        heardAbout: answers.heardAbout,
        primaryUse: answers.primaryUse,
        language: answers.language,
        updatedAt: serverTimestamp(),
      })
    },
    [user?.uid]
  )

  const skipOnboarding = React.useCallback(async () => {
    if (!user) return
    const ref = doc(db, "users", user.uid, "onboarding", "state")
    await updateDoc(ref, {
      onboardingDone: true,
      heardAbout: null,
      primaryUse: null,
      language: SKIP_LANGUAGE,
      updatedAt: serverTimestamp(),
    })
  }, [user?.uid])

  return { loading, state, completeOnboarding, skipOnboarding }
}


