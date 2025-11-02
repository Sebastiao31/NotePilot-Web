"use client"

import * as React from "react"
import type { Editor as TiptapEditor } from "@tiptap/react"

type EditorBridge = {
  editor: TiptapEditor | null
  setEditor: (editor: TiptapEditor | null) => void
}

const EditorBridgeContext = React.createContext<EditorBridge | null>(null)

export function useEditorBridge() {
  const ctx = React.useContext(EditorBridgeContext)
  if (!ctx) throw new Error("useEditorBridge must be used within EditorBridgeProvider")
  return ctx
}

export function EditorBridgeProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = React.useState<TiptapEditor | null>(null)
  const value = React.useMemo(() => ({ editor, setEditor }), [editor])
  return <EditorBridgeContext.Provider value={value}>{children}</EditorBridgeContext.Provider>
}


