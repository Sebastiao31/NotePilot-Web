"use client"

import { Handle, Position, NodeProps } from "reactflow"
import { Message } from "@/lib/actions/notes"
import { useState, useEffect, useRef } from "react"
import { IconUser, IconRobot, IconLoader2, IconArrowUp, IconDots } from "@tabler/icons-react"
import TextareaAutosize from "react-textarea-autosize"
import { cn } from "@/lib/utils"

interface ChatNodeData {
  nodeId: string
  messages: Message[]
  isProcessing: boolean
  onSendMessage: (nodeId: string, message: string) => void
  onBranch: (nodeId: string) => void
}

export function ChatNode({ data, selected }: NodeProps<ChatNodeData>) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasProcessed = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [data.messages])

  const handleSend = () => {
    if (!inputValue.trim() || data.isProcessing) return
    data.onSendMessage(data.nodeId, inputValue)
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        "bg-background border-2 rounded-lg shadow-lg w-[400px] flex flex-col",
        selected ? "border-primary" : "border-border"
      )}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="text-sm font-medium">Chat Node</div>
        <button
          onClick={() => data.onBranch(data.nodeId)}
          disabled={data.isProcessing}
          className="p-1 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
          title="Branch conversation"
        >
          <IconDots className="size-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-3">
        {data.messages.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          data.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconRobot className="size-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "px-3 py-2 rounded-lg max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                {message.model && (
                  <div className="text-xs opacity-70 mt-1">
                    {message.model}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <IconUser className="size-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}

        {data.isProcessing && (
          <div className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <IconRobot className="size-4 text-primary" />
            </div>
            <div className="px-3 py-2 rounded-lg bg-accent">
              <IconLoader2 className="size-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <div className="flex gap-2 items-end bg-accent rounded-lg p-2">
          <TextareaAutosize
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={data.isProcessing}
            placeholder={data.isProcessing ? "Processing..." : "Type a message..."}
            className="flex-1 bg-transparent resize-none outline-none text-sm max-h-32 disabled:opacity-50"
            maxRows={4}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || data.isProcessing}
            className="bg-primary rounded-md p-1.5 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {data.isProcessing ? (
              <IconLoader2 className="size-4 text-primary-foreground animate-spin" />
            ) : (
              <IconArrowUp className="size-4 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

