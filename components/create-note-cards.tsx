import React from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './ui/card'
import { IconBrandYoutubeFilled, IconPlus, } from '@tabler/icons-react'

const createNoteCards = () => {
  return (
    <div className="grid grid-cols-4 gap-2 max-w-4xl">
        <Card>
            <CardContent className="flex items-center justify-center">
                <IconPlus className="size-8" />
            </CardContent>
        </Card>
        <Card>
            <CardContent>
                <div className="flex items-center justify-center rounded-md bg-badge-red-foreground p-2 w-fit">
                  <IconBrandYoutubeFilled className="size-6 text-badge-red" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent>
                <IconPlus className="size-8" />
            </CardContent>
        </Card>
        <Card>
            <CardContent>
                <IconPlus className="size-8" />
            </CardContent>
        </Card>
    </div>
  )
}

export default createNoteCards