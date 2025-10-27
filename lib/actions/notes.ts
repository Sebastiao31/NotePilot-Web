"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

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

/**
 * Creates a new note with a root node and initial user message
 */
export async function createNoteWithMessage(userMessage: string) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    // 1. Create the note
    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        title: userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : ""),
      })
      .select()
      .single()

    if (noteError) {
      console.error("Note creation error:", noteError)
      throw new Error(
        `Database error creating note: ${noteError.message}\n\n` +
        `Code: ${noteError.code}\n` +
        `Hint: ${noteError.hint || "Make sure you've run DATABASE_SCHEMA.sql in Supabase"}`
      )
    }

    // 2. Create the root node (positioned at center)
    const { data: node, error: nodeError } = await supabase
      .from("nodes")
      .insert({
        note_id: note.id,
        parent_id: null,
        title: "Root",
        x: 250,
        y: 100,
      })
      .select()
      .single()

    if (nodeError) {
      console.error("Node creation error:", nodeError)
      throw new Error(`Database error creating node: ${nodeError.message}`)
    }

    // 3. Create the initial user message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        node_id: node.id,
        role: "user",
        content: userMessage,
      })
      .select()
      .single()

    if (messageError) {
      console.error("Message creation error:", messageError)
      throw new Error(`Database error creating message: ${messageError.message}`)
    }

    revalidatePath("/notes")

    return {
      success: true,
      noteId: note.id,
      nodeId: node.id,
      messageId: message.id,
    }
  } catch (error) {
    console.error("Error creating note:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create note",
    }
  }
}

/**
 * Get all notes for the current user
 */
export async function getAllNotes() {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("notes")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) throw error
  return data as Note[]
}

/**
 * Get a note by ID
 */
export async function getNoteById(noteId: string) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single()

  if (error) throw error
  return data as Note
}

/**
 * Get all nodes for a note
 */
export async function getNodesByNoteId(noteId: string) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Verify user owns the note
  const { data: note } = await supabase
    .from("notes")
    .select("id")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single()

  if (!note) throw new Error("Note not found")

  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("note_id", noteId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as Node[]
}

/**
 * Get all messages for a specific node
 */
export async function getMessagesByNodeId(nodeId: string) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("node_id", nodeId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data as Message[]
}

/**
 * Create a new child node (for branching)
 */
export async function createChildNode(
  noteId: string,
  parentId: string,
  x: number,
  y: number,
  title?: string
) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("nodes")
    .insert({
      note_id: noteId,
      parent_id: parentId,
      title: title || null,
      x,
      y,
    })
    .select()
    .single()

  if (error) throw error
  revalidatePath(`/notes/${noteId}`)
  return data as Node
}

/**
 * Create a new message in a node
 */
export async function createMessage(
  nodeId: string,
  role: "user" | "assistant" | "system",
  content: string,
  model?: string,
  token?: number,
  metadata?: Record<string, any>
) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      node_id: nodeId,
      role,
      content,
      model: model || null,
      token: token || null,
      metadata: metadata || {},
    })
    .select()
    .single()

  if (error) throw error
  return data as Message
}

/**
 * Update node position (for React Flow dragging)
 */
export async function updateNodePosition(nodeId: string, x: number, y: number) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("nodes")
    .update({ x, y })
    .eq("id", nodeId)

  if (error) throw error
}

/**
 * Get conversation context for a node (traverses up the tree)
 */
export async function getNodeContext(nodeId: string) {
  const supabase = await createSupabaseClient()
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  // Use the PostgreSQL function we created
  const { data, error } = await supabase.rpc("get_node_context", {
    target_node_id: nodeId,
  })

  if (error) throw error
  return data as Array<{
    node_id: string
    depth: number
    message_id: string
    role: string
    content: string
    model: string | null
    created_at: string
  }>
}

