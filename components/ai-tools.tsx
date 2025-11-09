import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconBrain, IconCards, IconCheckbox, IconPlus, IconRefresh, IconLanguage, IconLoader2 } from '@tabler/icons-react'
import { QuizDialog } from './dialogs/quiz'
import { useParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { createSupabaseClientBrowserAuthed } from "@/lib/supabase-browser"

export function AiTools() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [checking, setChecking] = useState(false)
  type QuizOption = { text: string; explanation: string }
  type QuizQuestion = {
    question: string;
    options: [QuizOption, QuizOption, QuizOption, QuizOption];
    correctIndex: number;
    tip: string;
  }
  type QuizPayload = { questions: QuizQuestion[]; source: 'transcript' | 'summary' }
  const [quiz, setQuiz] = useState<QuizPayload | null>(null)
  const [existingQuiz, setExistingQuiz] = useState<QuizPayload | null>(null)
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const { getToken } = useAuth()

  React.useEffect(() => {
    let cancelled = false
    async function checkExisting() {
      if (!noteId) {
        setExistingQuiz(null)
        return
      }
      setChecking(true)
      try {
        const token = await getToken({ template: 'supabase' })
        if (!token) {
          setExistingQuiz(null)
          return
        }
        const supabase = createSupabaseClientBrowserAuthed(token)
        try { (supabase as any).realtime.setAuth(token) } catch {}
        const { data, error } = await supabase
          .from('quizzes')
          .select('id, content')
          .eq('note_id', noteId)
          .order('created_at', { ascending: false })
          .limit(1)
        if (error) {
          console.error('Check existing quiz failed:', error.message)
          if (!cancelled) setExistingQuiz(null)
          return
        }
        const row = Array.isArray(data) && data.length ? data[0] as any : null
        if (!cancelled) {
          setExistingQuiz(row?.content ?? null)
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    checkExisting()
    return () => { cancelled = true }
  }, [noteId, getToken])

  async function handleCreateQuiz() {
    if (!noteId || creating) return
    setQuizOpen(true)
    setQuiz(null)
    setCreating(true)
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any))
        console.error('Quiz generation failed:', err?.error || res.statusText)
      } else {
        const data = await res.json().catch(() => null as any)
        if (data?.quiz) {
          setQuiz(data.quiz as QuizPayload)
          setExistingQuiz(data.quiz as QuizPayload)
        }
      }
      // Optionally, we could surface success here (UX handled in next task)
    } catch (e) {
      console.error('Quiz generation error:', e)
    } finally {
      setCreating(false)
    }
  }

  function handleDialogOpenChange(open: boolean) {
    setQuizOpen(open)
    if (!open) {
      setQuiz(null)
    }
  }

  function handleTakeQuiz() {
    if (!existingQuiz) return
    setQuiz(existingQuiz)
    setQuizOpen(true)
  }

  const hasExisting = !!existingQuiz
  const disabled = checking || creating || !noteId

  return(
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" className="rounded-full">
          <IconPlus className="size-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={hasExisting ? handleTakeQuiz : handleCreateQuiz}
            disabled={disabled}
          >
            {(creating || checking) ? <IconLoader2 className="size-4 animate-spin" /> : <IconCheckbox className="size-4"/>}
            {hasExisting ? "Take quiz" : (creating ? "Generating quiz…" : (checking ? "Checking…" : "Create quiz"))}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconCards className="size-4"/>
            Create flashcards
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconBrain className="size-4"/>
            Create mindmap
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSubTrigger>
              <IconLanguage className="size-4"/>
              Translate
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <IconRefresh className="size-4"/>
            Rewrite
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

    </DropdownMenu>

    <QuizDialog open={quizOpen} onOpenChange={handleDialogOpenChange} loading={creating} quiz={quiz} onRegenerate={handleCreateQuiz} />

    </>
  )
}