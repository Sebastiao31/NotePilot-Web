"use client"

import * as React from "react"

type EditModeContextValue = {
  editMode: boolean
  setEditMode: (value: boolean) => void
}

const EditModeContext = React.createContext<EditModeContextValue | null>(null)

export function useEditMode() {
  const ctx = React.useContext(EditModeContext)
  if (!ctx) throw new Error("useEditMode must be used within EditModeProvider")
  return ctx
}

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = React.useState(false)
  const value = React.useMemo(() => ({ editMode, setEditMode }), [editMode])
  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}


