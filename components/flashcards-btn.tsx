'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { IconCards } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export function FlashcardsBtn({ onClick, className }: { onClick?: () => void; className?: string }) {
  const [allowed, setAllowed] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const router = useRouter()

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/billing/has-flashcards", { method: "GET", cache: "no-store" })
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


  if(!allowed)
    return (
      <Button
        variant="outline"
        onClick={() => { router.push("/pricing") }}
        className={className}
      >
        <IconCards className="size-4" />
        Flashcards
      </Button>
    )

return (
    <Button
      variant="outline"
      onClick={() => { if (allowed) onClick?.() }}
      className={className}
    >
      <IconCards className="size-4" />
      Flashcards
    </Button>
  )

 
}


