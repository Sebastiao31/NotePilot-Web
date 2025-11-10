import { IconCheckbox } from '@tabler/icons-react'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

export function QuizGenTrigger() {
    const params = useParams()
    const router = useRouter()
    const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)
    const [loading, setLoading] = React.useState(false)

    async function handleClick() {
        if (!noteId || loading) return
        setLoading(true)
        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 60000) // 60s safety timeout
            const res = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId }),
                signal: controller.signal,
            }).finally(() => clearTimeout(timeout))
            if (!res.ok) {
                const err = await res.json().catch(() => ({} as any))
                console.error('Quiz generation failed:', err?.error || res.statusText)
                return
            }
            const data = await res.json().catch(() => null as any)
            if (data?.id) {
                // Navigate to the generated quiz
                router.push(`/notes/${noteId}/quiz/${data.id}`)
            } else {
                console.log('Quiz generated (no id in response):', data)
            }
        } catch (e) {
            console.error('Quiz generation error:', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={!noteId || loading}
            className="flex flex-col items-start w-full gap-2  bg-badge-blue-foreground 
        rounded-md p-2 text-badge-blue hover:cursor-pointer hover:bg-badge-blue/20 disabled:opacity-60 disabled:cursor-not-allowed">
            <IconCheckbox className="size-4 text-badge-blue" />
            <span className="text-sm font-medium align-start ">
                {loading ? 'Generating…' : 'Quiz'}
            </span>
        </button>
    )
}