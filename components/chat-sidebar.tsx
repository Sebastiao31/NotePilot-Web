"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"
import { IconArrowUp, IconChevronsRight, IconClock, IconPlus, IconLoader2, IconHistory } from "@tabler/icons-react"
import { Button } from "./ui/button"
import { useParams } from "next/navigation"

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { ChatInput } from "./chat-input"

export function ChatSidebar() {
  const { open, width, setWidth, minWidth, maxWidth, chatToggle } = useChatSidebar()
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)


  type Message = { id: string; role: "user" | "assistant"; content: string }
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [chatId, setChatId] = React.useState<string | null>(null)
  const [suggestions, setSuggestions] = React.useState<string[] | null>(null)
  const [assistantDraft, setAssistantDraft] = React.useState<{ text: string; phase: number; active: boolean } | null>(null)
  const [pendingAnswer, setPendingAnswer] = React.useState<string | null>(null)
  const phaseIntervalRef = React.useRef<number | null>(null)
  const typingIntervalRef = React.useRef<number | null>(null)

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
            

            <Button variant="ghost" size="icon" onClick={chatToggle} className="size-7 ">
                <IconHistory className="text-accent-foreground" />
            </Button>

            <Button variant="ghost" size="icon" onClick={chatToggle} className="size-7 ">
                <IconPlus className="text-accent-foreground" />
            </Button>


          </div>
        </div>

        <div className="p-4 mt-auto">
            <ChatInput />
        </div>
      </div>
    </div>
  )
}


