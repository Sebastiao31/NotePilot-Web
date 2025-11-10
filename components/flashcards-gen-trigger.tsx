import { IconCards } from '@tabler/icons-react'
import React from 'react'

export function FlashcardsGenTrigger() {
    return (
    <button className="flex flex-col items-start w-full gap-2  bg-badge-green-foreground rounded-md p-2 text-badge-green hover:cursor-pointer hover:bg-badge-green/20">
        <IconCards className="size-4 text-badge-green"/>
        <span className="text-sm font-medium">
            Flashcards
        </span>
    </button>
    )
}