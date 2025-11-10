import { createSupabaseClient } from '@/lib/supabase-server'
import Editor from '@/components/richTextEditor/editor'

export default async function NoteIdPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseClient()
  const { data: note } = await supabase
    .from('notes')
    .select('id, summary, transcript')
    .eq('id', params.id)
    .single()

  const initialContent = note?.summary || ''

  return (
    <div className="max-w-3xl mx-auto h-full pt-18 pb-36 px-10">
      <Editor noteId={params.id} initialContent={initialContent} />
    </div>
  )
}