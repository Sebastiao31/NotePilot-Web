"use client"

import * as React from "react"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth-provider"

export type Folder = {
  id: string
  name: string
  color: string
  createdAt?: any
  updatedAt?: any
}

export function useFolders() {
  const { user } = useAuth()
  const [folders, setFolders] = React.useState<Folder[]>([])
  const [loading, setLoading] = React.useState<boolean>(!!user)

  React.useEffect(() => {
    if (!user) {
      setFolders([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(
      collection(db, "users", user.uid, "folders"),
      orderBy("createdAt", "asc")
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Folder[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        setFolders(items)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [user?.uid])

  return { folders, loading }
}


