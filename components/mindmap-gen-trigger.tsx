import { IconBrain } from '@tabler/icons-react'
import React from 'react'

export function MindmapGenTrigger() {
    return (
        <button className="flex flex-col items-start w-full gap-2  bg-badge-purple-foreground rounded-md p-2 text-badge-purple hover:cursor-pointer hover:bg-badge-purple/20">
            <IconBrain className="size-4 text-badge-purple"/>
            <span className="text-sm font-medium">
                Mindmap
            </span>
        </button>
    )
}