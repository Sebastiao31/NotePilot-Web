export interface Note {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Node {
  id: string
  note_id: string
  parent_id: string | null
  title: string | null
  x: number
  y: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  node_id: string
  role: "user" | "assistant" | "system"
  content: string
  model: string | null
  token: number | null
  metadata: Record<string, any>
  created_at: string
}

export interface NodeWithMessages extends Node {
  messages: Message[]
}

