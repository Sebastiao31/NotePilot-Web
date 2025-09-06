"use client"

import React from 'react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { IconBrandGoogle } from '@tabler/icons-react'

const page = () => {
  const { signInWithGoogle, loading, user } = useAuth()
  // Redirect away if already signed in
  React.useEffect(() => {
    if (user) {
      window.location.replace("/all-notes")
    }
  }, [user])
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <Button onClick={signInWithGoogle} disabled={loading} className="rounded-full">
          <IconBrandGoogle />
          Continue with Google
        </Button>
        {user && <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>}
      </div>
    </main>
  )
}

export default page