// Simple global event bus for client components
export type NotesInsertEvent = {
  id: string
  title: string
  status?: "generating" | "completed"
  created_at?: string
  updated_at?: string
}

export type FoldersInsertEvent = {
  id: string
  name: string
  color: string | null
  note_id: string | null
  created_at?: string
}

const bus: EventTarget = ((): EventTarget => {
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.__appEventBus = window.__appEventBus || new EventTarget()
    // @ts-ignore
    return window.__appEventBus as EventTarget
  }
  return new EventTarget()
})()

export function emitNotesInsert(payload: NotesInsertEvent) {
  bus.dispatchEvent(new CustomEvent("notes:insert", { detail: payload }))
}

export function emitNotesUpdate(payload: NotesInsertEvent) {
  bus.dispatchEvent(new CustomEvent("notes:update", { detail: payload }))
}

export function emitNotesDelete(id: string) {
  bus.dispatchEvent(new CustomEvent("notes:delete", { detail: { id } }))
}

export function onNotesInsert(handler: (payload: NotesInsertEvent) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail)
  bus.addEventListener("notes:insert", listener)
  return () => bus.removeEventListener("notes:insert", listener)
}

export function onNotesUpdate(handler: (payload: NotesInsertEvent) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail)
  bus.addEventListener("notes:update", listener)
  return () => bus.removeEventListener("notes:update", listener)
}

export function onNotesDelete(handler: (payload: { id: string }) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail)
  bus.addEventListener("notes:delete", listener)
  return () => bus.removeEventListener("notes:delete", listener)
}

export function emitFoldersInsert(payload: FoldersInsertEvent) {
  bus.dispatchEvent(new CustomEvent("folders:insert", { detail: payload }))
}

export function onFoldersInsert(handler: (payload: FoldersInsertEvent) => void) {
  const listener = (e: Event) => handler((e as CustomEvent).detail)
  bus.addEventListener("folders:insert", listener)
  return () => bus.removeEventListener("folders:insert", listener)
}


