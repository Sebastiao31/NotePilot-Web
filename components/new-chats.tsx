import React from 'react'
import { Button } from "@/components/ui/button"
import { IconPlus } from '@tabler/icons-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useAuth } from "@clerk/nextjs"
import { createSupabaseClientBrowserAuthed } from "@/lib/supabase-browser"

export function NewChats({ noteId, onCreated }: { noteId: string; onCreated: (chatId: string) => void }) {
    const { getToken } = useAuth()

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={async () => {
                    try {
                        const token = await getToken({ template: 'supabase' })
                        if (!token) return
                        const supabase = createSupabaseClientBrowserAuthed(token)
                        try { (supabase as any).realtime.setAuth(token) } catch {}
                        const { data, error } = await supabase
                          .from('chats')
                          .insert({ note_id: noteId, suggestions: null })
                          .select('id')
                          .single()
                        if (!error && data?.id) onCreated(data.id)
                    } catch {}
                }}>
                    <IconPlus className="size-4"/>
                </Button>
            </TooltipTrigger>
            <TooltipContent align="end">
                <p>New chat</p>
            </TooltipContent>
        </Tooltip>
    )
}