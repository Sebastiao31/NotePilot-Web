"use client"

import { IconChevronLeft } from '@tabler/icons-react'
import React from 'react'

export default function GoBackModal({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      aria-label="Go back"
      className="hover:bg-accent text-foreground inline-flex size-8 items-center justify-center rounded-md"
    >
      <IconChevronLeft className="size-6" />
    </button>
  )
}