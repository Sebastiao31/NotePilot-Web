"use client"

import * as React from "react"
import { onSnapshot, doc, type DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"

export type UserData = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  plan?: string | null
  createdAt?: unknown
  updatedAt?: unknown
}

export function useUserData() {
  const { user } = useAuth()
  const [docData, setDocData] = React.useState<DocumentData | null>(null)
  const [loading, setLoading] = React.useState<boolean>(!!user)

  React.useEffect(() => {
    if (!user) {
      setDocData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const ref = doc(db, "users", user.uid)
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setDocData(snap.exists() ? snap.data() : null)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [user?.uid])

  const merged: UserData | null = user
    ? {
        uid: user.uid,
        email: docData?.email ?? user.email ?? null,
        displayName: docData?.displayName ?? user.displayName ?? null,
        photoURL: docData?.photoURL ?? user.photoURL ?? null,
        plan: docData?.plan ?? null,
        createdAt: docData?.createdAt ?? null,
        updatedAt: docData?.updatedAt ?? null,
      }
    : null

  return { userData: merged, loading }
}


