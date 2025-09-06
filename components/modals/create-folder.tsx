"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/components/auth-provider"

const COLORS = [
    "#000000",
    "#A2A2A2",
  "#1B6CFF",
  "#10A37F",
  "#18C964",
  "#1F4B5C",
  "#8A4DFF",
  "#FF7AB6",
  "#FF3344",
  "#FF6A49",
  "#F2BE4A",
  "#875539",
]

type Props = {
  children: React.ReactNode
}

const CreateFolderDialog = ({ children }: Props) => {
  const { user } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState<string>(COLORS[0])
  const [saving, setSaving] = React.useState(false)

  const handleCreate = React.useCallback(async () => {
    if (!user || !name.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, "users", user.uid, "folders"), {
        name: name.trim(),
        color,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setName("")
      setColor(COLORS[0])
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }, [user, name, color])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/70 backdrop-blur-sm fixed inset-0 z-50" />
        <Dialog.Content className="bg-background text-foreground fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-4xl border outline-none">
          <div className="flex items-start justify-between p-5 ">
            <div className="flex flex-col gap-2 ">
              <Dialog.Title className="text-2xl font-semibold">Create Folder</Dialog.Title>
              <Dialog.Description className="text-md text-muted-foreground">
                Organize your notes by topic, project or purpose.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="hover:bg-accent text-black inline-flex size-8 items-center justify-center rounded-md hover:cursor-pointer">
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-5 pb-4">
            <div className="items-center flex justify-center grid grid-cols-6 gap-3  py-12">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-15 w-15 rounded-xl"
                  style={{ backgroundColor: c, boxShadow: color === c ? "0 0 0 3px rgba(0,0,0,0.3) inset" : undefined }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>

            <div className="mb-2 text-lg font-medium">Folder Name</div>
            <Input
              placeholder="e.g.: Calculus, Project Meeting"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="p-5 pt-3">
            <Button  onClick={handleCreate} disabled={!name.trim() || saving} className="rounded-full w-full h-15 text-lg">
              Create Folder
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CreateFolderDialog