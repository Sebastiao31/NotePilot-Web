"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"
import { IconArrowUp, IconChevronsRight, IconClock, IconPlus, IconLoader2, IconHistory, IconCopy, IconThumbUp, IconThumbDown, IconThumbUpFilled, IconThumbDownFilled } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { useParams } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { ChatInput } from "./chat-input"
import { ScrollArea } from "./ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { useAuth } from "@clerk/nextjs"
import { createSupabaseClientBrowserAuthed } from "@/lib/supabase-browser"
import { AllChats } from "./all-chats"
import { NewChats } from "./new-chats"
import { QuizDialog } from "./dialogs/quiz"
import { FlashcardsDialog } from "./dialogs/flashcards"


export function ChatSidebar() {
  const { open, width, setWidth, minWidth, maxWidth, chatToggle, setOpen } = useChatSidebar()
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const isMobile = useIsMobile()

  // Auto-close chat sidebar on mobile screens
  React.useEffect(() => {
    if (isMobile && open) {
      setOpen(false)
    }
  }, [isMobile])


  type Message = { id: string; role: "user" | "assistant"; content: string }
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [historyLoading, setHistoryLoading] = React.useState(true)
  const [chatId, setChatId] = React.useState<string | null>(null)
  const [suggestions, setSuggestions] = React.useState<string[] | null>(null)
  const [assistantDraft, setAssistantDraft] = React.useState<{ text: string; phase: number; active: boolean } | null>(null)
  const [pendingAnswer, setPendingAnswer] = React.useState<string | null>(null)
  const phaseIntervalRef = React.useRef<number | null>(null)
  const typingIntervalRef = React.useRef<number | null>(null)

  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [likedIds, setLikedIds] = React.useState<Set<string>>(new Set())
  const [dislikedIds, setDislikedIds] = React.useState<Set<string>>(new Set())
  const { getToken } = useAuth()

  // Quiz state
  const [quizOpen, setQuizOpen] = React.useState(false)
  const [quizLoading, setQuizLoading] = React.useState(false)
  const [quiz, setQuiz] = React.useState<any | null>(null)
  const [quizError, setQuizError] = React.useState<string | null>(null)
  const [existingQuiz, setExistingQuiz] = React.useState<any | null>(null)

  // Flashcards state
  const [fcOpen, setFcOpen] = React.useState(false)
  const [fcLoading, setFcLoading] = React.useState(false)
  const [flashcards, setFlashcards] = React.useState<any | null>(null)
  const [fcError, setFcError] = React.useState<string | null>(null)
  const [existingFlashcards, setExistingFlashcards] = React.useState<any | null>(null)

  const isDraggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(width)

  const onPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true
    startXRef.current = event.clientX
    startWidthRef.current = width
    ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
    document.body.classList.add("select-none")
  }, [width])

  const onPointerMove = React.useCallback((event: PointerEvent) => {
    if (!isDraggingRef.current) return
    const delta = startXRef.current - event.clientX
    const nextWidth = startWidthRef.current + delta
    setWidth(nextWidth)
  }, [setWidth])

  const endDrag = React.useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    document.body.classList.remove("select-none")
  }, [])

  React.useEffect(() => {
    const handleMove = (e: PointerEvent) => onPointerMove(e)
    const handleUp = () => endDrag()
    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }
  }, [onPointerMove, endDrag])

  // When switching to a different note, reset chat state immediately to avoid showing stale chats
  React.useEffect(() => {
    setMessages([])
    setLikedIds(new Set())
    setDislikedIds(new Set())
    setCopiedId(null)
    // let history loader select or create latest chat for the new note
    setChatId(null)
  }, [noteId])

  // Prefetch latest existing quiz for this note (if any)
  React.useEffect(() => {
    let cancelled = false
    async function loadExisting() {
      if (!noteId) return
      try {
        const token = await getToken({ template: "supabase" })
        if (!token) return
        const supabase = createSupabaseClientBrowserAuthed(token)
        const { data, error } = await supabase
          .from("quizzes")
          .select("content, created_at")
          .eq("note_id", noteId)
          .order("created_at", { ascending: false })
          .limit(1)
        if (error) return
        const first = Array.isArray(data) && data.length ? (data[0] as any) : null
        if (!cancelled) setExistingQuiz(first?.content ?? null)

        const { data: fData, error: fErr } = await supabase
          .from("flashcards")
          .select("content, created_at")
          .eq("note_id", noteId)
          .order("created_at", { ascending: false })
          .limit(1)
        if (!fErr) {
          const fFirst = Array.isArray(fData) && fData.length ? (fData[0] as any) : null
          if (!cancelled) setExistingFlashcards(fFirst?.content ?? null)
        }
      } catch {}
    }
    loadExisting()
    return () => { cancelled = true }
  }, [noteId, getToken])

  // Load chat history for current note / selected chat
  React.useEffect(() => {
    let ignore = false
    async function load() {
      if (!noteId) return
      try {
        setHistoryLoading(true)
        const qs = new URLSearchParams({ noteId })
        if (chatId) qs.set('chatId', chatId)
        let res = await fetch(`/api/chat/history?${qs.toString()}`, { cache: 'no-store' })
        if (!res.ok) {
          // Fallback: try without chatId (e.g., stale chatId from another note)
          res = await fetch(`/api/chat/history?noteId=${encodeURIComponent(noteId)}`, { cache: 'no-store' })
        }
        if (!res.ok) {
          if (!ignore) {
            setMessages([])
            setLikedIds(new Set())
            setDislikedIds(new Set())
          }
          return
        }
        const data = await res.json()
        if (!ignore) {
          setChatId(data.chatId || null)
          const msgs = Array.isArray(data.messages) ? data.messages : []
          setMessages(msgs)
          // Seed like/dislike sets for assistant messages
          const liked = new Set<string>()
          const disliked = new Set<string>()
          for (const m of msgs) {
            if (m.role === 'assistant') {
              if ((m as any).like) liked.add(m.id)
              if ((m as any).dislike) disliked.add(m.id)
            }
          }
          setLikedIds(liked)
          setDislikedIds(disliked)
        }
      } catch {}
      finally {
        if (!ignore) setHistoryLoading(false)
      }
    }
    load()
    return () => { ignore = true }
    }, [noteId, chatId])

  async function handleSend(scope: boolean) {
    const text = input.trim()
    if (!text || !noteId || loading) return
    setLoading(true)
    const localId = `u_${Date.now()}`
    setMessages((prev) => [...prev, { id: localId, role: 'user', content: text }])
    setInput("")
    try {
      const res = await fetch('/api/chat/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ noteId, message: text, scope }) })
      if (res.ok) {
        const data = await res.json()
        if (data.chatId && !chatId) setChatId(data.chatId)
        if (data.answer) setMessages((prev) => [...prev, { id: data.messageId || `a_${Date.now()}`, role: 'assistant', content: data.answer }])
      }
    } catch {}
    finally { setLoading(false) }
  }

  async function handleGenerateQuiz(forceNew: boolean = false) {
    if (!noteId || quizLoading) return
    if (!forceNew && existingQuiz) {
      setQuiz(existingQuiz)
      setQuizError(null)
      setQuizLoading(false)
      setQuizOpen(true)
      return
    }
    setQuizOpen(true)
    setQuizLoading(true)
    setQuiz(null)
    setQuizError(null)
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any))
        setQuizError(err?.error || res.statusText || 'Failed to generate quiz')
        return
      }
      const data = await res.json().catch(() => null as any)
      setQuiz(data?.quiz ?? null)
    } catch (e: any) {
      setQuizError(e?.message || 'Quiz generation error')
    } finally {
      setQuizLoading(false)
    }
  }

  async function handleGenerateFlashcards(forceNew: boolean = false) {
    if (!noteId || fcLoading) return
    if (!forceNew && existingFlashcards) {
      setFlashcards(existingFlashcards)
      setFcError(null)
      setFcLoading(false)
      setFcOpen(true)
      return
    }
    // Quick check for latest existing flashcards
    if (!forceNew && !existingFlashcards) {
      try {
        const token = await getToken({ template: "supabase" })
        if (token) {
          const supabase = createSupabaseClientBrowserAuthed(token)
          const { data: fData } = await supabase
            .from("flashcards")
            .select("content, created_at")
            .eq("note_id", noteId)
            .order("created_at", { ascending: false })
            .limit(1)
          const fFirst = Array.isArray(fData) && fData.length ? (fData[0] as any) : null
          const found = fFirst?.content ?? null
          if (found) {
            setExistingFlashcards(found)
            setFlashcards(found)
            setFcError(null)
            setFcLoading(false)
            setFcOpen(true)
            return
          }
        }
      } catch {}
    }
    setFcOpen(true)
    setFcLoading(true)
    setFlashcards(null)
    setFcError(null)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any))
        setFcError(err?.error || res.statusText || 'Failed to generate flashcards')
        return
      }
      const data = await res.json().catch(() => null as any)
      setFlashcards(data?.flashcards ?? null)
    } catch (e: any) {
      setFcError(e?.message || 'Flashcards generation error')
    } finally {
      setFcLoading(false)
    }
  }

  async function handleCopy(content: string, id: string) {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500)
    } catch {}
  }

  async function handleRate(id: string, action: 'like' | 'dislike') {
    try {
      const token = await getToken({ template: 'supabase' })
      if (!token) return
      const supabase = createSupabaseClientBrowserAuthed(token)
      try { (supabase as any).realtime.setAuth(token) } catch {}

      const updates: any = { like: action === 'like', dislike: action === 'dislike' }
      await supabase.from('messages').update(updates).eq('id', id)

      setLikedIds((prev) => {
        const next = new Set(prev)
        if (action === 'like') next.add(id); else next.delete(id)
        return next
      })
      setDislikedIds((prev) => {
        const next = new Set(prev)
        if (action === 'dislike') next.add(id); else next.delete(id)
        return next
      })
    } catch {}
  }


  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, loading])

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 border-l bg-background transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
      style={{ width }}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div
          aria-hidden
          onPointerDown={onPointerDown}
          className="absolute left-0 top-0 z-10 h-full w-1 cursor-col-resize bg-transparent"
          title={`Drag to resize (${minWidth}-${maxWidth}px)`}
        />
        <div className="p-3 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={chatToggle} className="size-7 ">
                <IconChevronsRight className="text-accent-foreground" />
            </Button>
          <span className="text-sm font-regular">Ai Chat</span>

          <div className="flex items-center gap-2 ml-auto">
            

                 <AllChats noteId={noteId} onSelect={(id) => { setMessages([]); setLikedIds(new Set()); setDislikedIds(new Set()); setHistoryLoading(true); setChatId(id) }} />

             <NewChats noteId={noteId} onCreated={(id) => { setMessages([]); setLikedIds(new Set()); setDislikedIds(new Set()); setHistoryLoading(true); setChatId(id) }} />


          </div>
        </div>

        <div className="flex-1 overflow-y-auto " ref={scrollRef}>
          <div className="space-y-6 px-4 pt-6 pb-12">
            {historyLoading && messages.length === 0 ? (
              <div className="h-full flex items-center justify-center py-8">
                <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : null}
            
            {messages.map((m) => {
              const isUser = m.role === 'user'
              return (
                <div key={m.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}> 
                  <div
                    className={cn(
                      "w-fit max-w-[680px] rounded-2xl px-3 py-2 text-sm break-words leading-7",
                      isUser
                        ? "bg-muted rounded-tr-sm"
                        : "text-foreground rounded-tl-sm "
                    )}
                  >
                    {isUser ? (
                      <>{m.content}</>
                    ) : (
                      <div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm as any, remarkMath as any]}
                        rehypePlugins={[rehypeKatex as any]}
                        components={{
                          h1: (props) => <h3 className="text-base font-semibold mb-2" {...props} />,
                          h2: (props) => <h4 className="text-sm font-semibold mt-6" {...props} />,
                          h3: (props) => <h5 className="text-sm font-semibold mt-6" {...props} />,
                          p: (props) => <p  {...props} />,
                          ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: (props) => <li className="leading-7" {...props} />,
                          a: (props) => <a className="underline underline-offset-2 hover:opacity-90" target="_blank" rel="noreferrer" {...props} />,
                          blockquote: (props) => <blockquote className="border-l-2 pl-3 italic my-2" {...props} />,
                          hr: () => <hr className="my-4 border-t " />,
                          table: (props) => <table className="w-full border-collapse text-sm my-2" {...props} />,
                          thead: (props) => <thead className="bg-accent/40" {...props} />,
                          th: (props) => <th className="border px-2 py-1 text-left font-medium" {...props} />,
                          td: (props) => <td className="border px-2 py-1 align-top" {...props} />,
                          img: (props) => <img className="rounded-md max-w-full" {...props} />,
                          
                          code(props) {
                            const { inline, className, children, ...rest } = props as any
                            if (inline) {
                              return (
                                <code className={cn("bg-muted px-1 py-0.5 rounded", className)} {...rest}>
                                  {children}
                                </code>
                              )
                            }
                            return (
                              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                                <code className={className} {...rest}>{children}</code>
                              </pre>
                            )
                          },
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                      <span>
                      <Tooltip open={copiedId === m.id ? true : undefined}>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(m.content, m.id)}>
                            <IconCopy className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedId === m.id ? "Copied!" : "Copy"}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleRate(m.id, 'like')} data-state={likedIds.has(m.id) ? 'on' : undefined}>
                            {likedIds.has(m.id) ? (
                              <IconThumbUpFilled className="size-4" />
                            ) : (
                              <IconThumbUp className="size-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Like response</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleRate(m.id, 'dislike')} data-state={dislikedIds.has(m.id) ? 'on' : undefined}>
                            {dislikedIds.has(m.id) ? (
                              <IconThumbDownFilled className="size-4" />
                            ) : (
                              <IconThumbDown className="size-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Dislike response</p>
                        </TooltipContent>
                      </Tooltip>
                      </span>
                      </div>
                    )}
                  </div>
                 
                </div>
              )
            })}
            
            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                  <IconLoader2 className="size-4 animate-spin" />
                  <span className="animate-pulse">Thinking…</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pb-4 px-4 mt-auto">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              loading={loading}
              onGenerateQuiz={() => handleGenerateQuiz(false)}
              onGenerateFlashcards={() => handleGenerateFlashcards(false)}
            />
        </div>

        <QuizDialog
          open={quizOpen}
          onOpenChange={(o) => { if (!quizLoading) setQuizOpen(o) }}
          loading={quizLoading}
          quiz={quiz}
          error={quizError}
          onRegenerate={() => handleGenerateQuiz(true)}
        />

        <FlashcardsDialog
          open={fcOpen}
          onOpenChange={(o) => { if (!fcLoading) setFcOpen(o) }}
          loading={fcLoading}
          cards={flashcards}
          error={fcError}
          onRegenerate={() => handleGenerateFlashcards(true)}
        />
      </div>
    </div>
  )
}


// Shared chat content used by both the sidebar and the drawer
export function ChatPanel() {
  const { chatToggle } = useChatSidebar()
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  type Message = { id: string; role: "user" | "assistant"; content: string }
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [historyLoading, setHistoryLoading] = React.useState(true)
  const [chatId, setChatId] = React.useState<string | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [likedIds, setLikedIds] = React.useState<Set<string>>(new Set())
  const [dislikedIds, setDislikedIds] = React.useState<Set<string>>(new Set())

  const { getToken } = useAuth()

  // Quiz state
  const [quizOpen, setQuizOpen] = React.useState(false)
  const [quizLoading, setQuizLoading] = React.useState(false)
  const [quiz, setQuiz] = React.useState<any | null>(null)
  const [quizError, setQuizError] = React.useState<string | null>(null)
  const [existingQuiz, setExistingQuiz] = React.useState<any | null>(null)

  // Flashcards state
  const [fcOpen, setFcOpen] = React.useState(false)
  const [fcLoading, setFcLoading] = React.useState(false)
  const [flashcards, setFlashcards] = React.useState<any | null>(null)
  const [fcError, setFcError] = React.useState<string | null>(null)
  const [existingFlashcards, setExistingFlashcards] = React.useState<any | null>(null)

  // Reset on note change
  React.useEffect(() => {
    setMessages([])
    setLikedIds(new Set())
    setDislikedIds(new Set())
    setCopiedId(null)
    setChatId(null)
  }, [noteId])

  // Prefetch existing quiz/flashcards
  React.useEffect(() => {
    let cancelled = false
    async function loadExisting() {
      if (!noteId) return
      try {
        const token = await getToken({ template: "supabase" })
        if (!token) return
        const supabase = createSupabaseClientBrowserAuthed(token)
        const { data, error } = await supabase
          .from("quizzes")
          .select("content, created_at")
          .eq("note_id", noteId)
          .order("created_at", { ascending: false })
          .limit(1)
        if (!error) {
          const first = Array.isArray(data) && data.length ? (data[0] as any) : null
          if (!cancelled) setExistingQuiz(first?.content ?? null)
        }
        const { data: fData, error: fErr } = await supabase
          .from("flashcards")
          .select("content, created_at")
          .eq("note_id", noteId)
          .order("created_at", { ascending: false })
          .limit(1)
        if (!fErr) {
          const fFirst = Array.isArray(fData) && fData.length ? (fData[0] as any) : null
          if (!cancelled) setExistingFlashcards(fFirst?.content ?? null)
        }
      } catch {}
    }
    loadExisting()
    return () => { cancelled = true }
  }, [noteId, getToken])

  // Load chat history
  React.useEffect(() => {
    let ignore = false
    async function load() {
      if (!noteId) return
      try {
        setHistoryLoading(true)
        const qs = new URLSearchParams({ noteId })
        if (chatId) qs.set('chatId', chatId)
        let res = await fetch(`/api/chat/history?${qs.toString()}`, { cache: 'no-store' })
        if (!res.ok) {
          res = await fetch(`/api/chat/history?noteId=${encodeURIComponent(noteId)}`, { cache: 'no-store' })
        }
        if (!res.ok) {
          if (!ignore) {
            setMessages([])
            setLikedIds(new Set())
            setDislikedIds(new Set())
          }
          return
        }
        const data = await res.json()
        if (!ignore) {
          setChatId(data.chatId || null)
          const msgs = Array.isArray(data.messages) ? data.messages : []
          setMessages(msgs)
          const liked = new Set<string>()
          const disliked = new Set<string>()
          for (const m of msgs) {
            if (m.role === 'assistant') {
              if ((m as any).like) liked.add(m.id)
              if ((m as any).dislike) disliked.add(m.id)
            }
          }
          setLikedIds(liked)
          setDislikedIds(disliked)
        }
      } catch {}
      finally {
        if (!ignore) setHistoryLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [noteId, chatId])

  async function handleSend(scope: boolean) {
    const text = input.trim()
    if (!text || !noteId || loading) return
    setLoading(true)
    const localId = `u_${Date.now()}`
    setMessages((prev) => [...prev, { id: localId, role: 'user', content: text }])
    setInput("")
    try {
      const res = await fetch('/api/chat/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ noteId, message: text, scope }) })
      if (res.ok) {
        const data = await res.json()
        if (data.chatId && !chatId) setChatId(data.chatId)
        if (data.answer) setMessages((prev) => [...prev, { id: data.messageId || `a_${Date.now()}`, role: 'assistant', content: data.answer }])
      }
    } catch {}
    finally { setLoading(false) }
  }

  async function handleCopy(content: string, id: string) {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500)
    } catch {}
  }

  async function handleRate(id: string, action: 'like' | 'dislike') {
    try {
      const token = await getToken({ template: 'supabase' })
      if (!token) return
      const supabase = createSupabaseClientBrowserAuthed(token)
      try { (supabase as any).realtime.setAuth(token) } catch {}

      const updates: any = { like: action === 'like', dislike: action === 'dislike' }
      await supabase.from('messages').update(updates).eq('id', id)

      setLikedIds((prev) => {
        const next = new Set(prev)
        if (action === 'like') next.add(id); else next.delete(id)
        return next
      })
      setDislikedIds((prev) => {
        const next = new Set(prev)
        if (action === 'dislike') next.add(id); else next.delete(id)
        return next
      })
    } catch {}
  }

  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, loading])

  async function handleGenerateQuiz(forceNew: boolean = false) {
    if (!noteId || quizLoading) return
    if (!forceNew && existingQuiz) {
      setQuiz(existingQuiz)
      setQuizError(null)
      setQuizLoading(false)
      setQuizOpen(true)
      return
    }
    setQuizOpen(true)
    setQuizLoading(true)
    setQuiz(null)
    setQuizError(null)
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any))
        setQuizError(err?.error || res.statusText || 'Failed to generate quiz')
        return
      }
      const data = await res.json().catch(() => null as any)
      setQuiz(data?.quiz ?? null)
    } catch (e: any) {
      setQuizError(e?.message || 'Quiz generation error')
    } finally {
      setQuizLoading(false)
    }
  }

  async function handleGenerateFlashcards(forceNew: boolean = false) {
    if (!noteId || fcLoading) return
    if (!forceNew && existingFlashcards) {
      setFlashcards(existingFlashcards)
      setFcError(null)
      setFcLoading(false)
      setFcOpen(true)
      return
    }
    // Quick check for latest cached flashcards
    if (!forceNew && !existingFlashcards) {
      try {
        const token = await getToken({ template: "supabase" })
        if (token) {
          const supabase = createSupabaseClientBrowserAuthed(token)
          const { data: fData } = await supabase
            .from("flashcards")
            .select("content, created_at")
            .eq("note_id", noteId)
            .order("created_at", { ascending: false })
            .limit(1)
          const fFirst = Array.isArray(fData) && fData.length ? (fData[0] as any) : null
          const found = fFirst?.content ?? null
          if (found) {
            setExistingFlashcards(found)
            setFlashcards(found)
            setFcError(null)
            setFcLoading(false)
            setFcOpen(true)
            return
          }
        }
      } catch {}
    }
    setFcOpen(true)
    setFcLoading(true)
    setFlashcards(null)
    setFcError(null)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any))
        setFcError(err?.error || res.statusText || 'Failed to generate flashcards')
        return
      }
      const data = await res.json().catch(() => null as any)
      setFlashcards(data?.flashcards ?? null)
    } catch (e: any) {
      setFcError(e?.message || 'Flashcards generation error')
    } finally {
      setFcLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-3 pl-5 flex items-center gap-4">
        
        <span className="text-sm font-regular">Ai Chat</span>
        <div className="flex items-center gap-2 ml-auto">
          <AllChats noteId={noteId} onSelect={(id) => { setMessages([]); setLikedIds(new Set()); setDislikedIds(new Set()); setHistoryLoading(true); setChatId(id) }} />
          <NewChats noteId={noteId} onCreated={(id) => { setMessages([]); setLikedIds(new Set()); setDislikedIds(new Set()); setHistoryLoading(true); setChatId(id) }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto " ref={scrollRef}>
        <div className="space-y-6 px-4 pt-6 pb-12">
          {historyLoading && messages.length === 0 ? (
            <div className="h-full flex items-center justify-center py-8">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : null}
          {messages.map((m) => {
            const isUser = m.role === 'user'
            return (
              <div key={m.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "w-fit max-w-[680px] rounded-2xl px-3 py-2 text-sm break-words leading-7",
                    isUser ? "bg-muted rounded-tr-sm" : "text-foreground rounded-tl-sm "
                  )}
                >
                  {isUser ? (
                    <>{m.content}</>
                  ) : (
                    <div>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm as any, remarkMath as any]}
                        rehypePlugins={[rehypeKatex as any]}
                        components={{
                          h1: (props) => <h3 className="text-base font-semibold mb-2" {...props} />,
                          h2: (props) => <h4 className="text-sm font-semibold mt-6" {...props} />,
                          h3: (props) => <h5 className="text-sm font-semibold mt-6" {...props} />,
                          p: (props) => <p  {...props} />,
                          ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: (props) => <li className="leading-7" {...props} />,
                          a: (props) => <a className="underline underline-offset-2 hover:opacity-90" target="_blank" rel="noreferrer" {...props} />,
                          blockquote: (props) => <blockquote className="border-l-2 pl-3 italic my-2" {...props} />,
                          hr: () => <hr className="my-4 border-t " />,
                          table: (props) => <table className="w-full border-collapse text-sm my-2" {...props} />,
                          thead: (props) => <thead className="bg-accent/40" {...props} />,
                          th: (props) => <th className="border px-2 py-1 text-left font-medium" {...props} />,
                          td: (props) => <td className="border px-2 py-1 align-top" {...props} />,
                          img: (props) => <img className="rounded-md max-w-full" {...props} />,
                          code(props) {
                            const { inline, className, children, ...rest } = props as any
                            if (inline) {
                              return (
                                <code className={cn("bg-muted px-1 py-0.5 rounded", className)} {...rest}>
                                  {children}
                                </code>
                              )
                            }
                            return (
                              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                                <code className={className} {...rest}>{children}</code>
                              </pre>
                            )
                          },
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                      <span>
                        <Tooltip open={copiedId === m.id ? true : undefined}>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(m.content, m.id)}>
                              <IconCopy className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{copiedId === m.id ? "Copied!" : "Copy"}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleRate(m.id, 'like')} data-state={likedIds.has(m.id) ? 'on' : undefined}>
                              {likedIds.has(m.id) ? <IconThumbUpFilled className="size-4" /> : <IconThumbUp className="size-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Like response</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm" onClick={() => handleRate(m.id, 'dislike')} data-state={dislikedIds.has(m.id) ? 'on' : undefined}>
                              {dislikedIds.has(m.id) ? <IconThumbDownFilled className="size-4" /> : <IconThumbDown className="size-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Dislike response</p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
                <IconLoader2 className="size-4 animate-spin" />
                <span className="animate-pulse">Thinking…</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="pb-4 px-4 mt-auto">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          loading={loading}
          onGenerateQuiz={() => handleGenerateQuiz(false)}
          onGenerateFlashcards={() => handleGenerateFlashcards(false)}
        />
      </div>
      <QuizDialog
        open={quizOpen}
        onOpenChange={(o) => { if (!quizLoading) setQuizOpen(o) }}
        loading={quizLoading}
        quiz={quiz}
        error={quizError}
        onRegenerate={() => handleGenerateQuiz(true)}
      />
      <FlashcardsDialog
        open={fcOpen}
        onOpenChange={(o) => { if (!fcLoading) setFcOpen(o) }}
        loading={fcLoading}
        cards={flashcards}
        error={fcError}
        onRegenerate={() => handleGenerateFlashcards(true)}
      />
    </div>
  )
}
