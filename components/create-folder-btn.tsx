import React from 'react'
import { Button } from './ui/button'
import { IconFolderPlus } from '@tabler/icons-react'

export function CreateFolderBtn() {
    return (
        <Button variant="ghost" size="sm" className="w-full justify-start">
            <IconFolderPlus className="size-4" />
            Create folder
        </Button>
    )
}