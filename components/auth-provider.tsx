"use client"

import * as React from "react"
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth"
import { auth, googleProvider, db } from "@/lib/firebase"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

type AuthContextValue = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signInWithGoogle = React.useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const u = result.user
    try {
      if (u?.uid) {
        const ref = doc(db, "users", u.uid)
        // Upsert to create if missing or update existing
        await setDoc(
          ref,
          {
            uid: u.uid,
            email: u.email ?? null,
            displayName: u.displayName ?? null,
            photoURL: u.photoURL ?? null,
            updatedAt: serverTimestamp(),
            // createdAt will only be set on first write due to merge: true
            createdAt: serverTimestamp(),
          },
          { merge: true }
        )
      }
    } catch (err) {
      // Surface rules/config issues during development
      console.error("Failed to create/update user document", err)
    }
    router.replace("/all-notes")
  }, [router])

  const signOutUser = React.useCallback(async () => {
    await signOut(auth)
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


