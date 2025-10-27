import React from 'react'
import CreateNoteCards from '@/components/create-note-cards'
import { MainInput } from '@/components/main-input'

const NotesPage = () => {
  return (
    <main className="p-8  h-screen">
      <div className="flex items-end justify-center h-full">
        <MainInput />
      </div>
    </main>
  )
}

export default NotesPage