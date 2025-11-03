export interface Notes {
  id: string
  user_id: string
  title: string
  type: "youtube" | "website" | "text" | "pdf" | "audio"
  url: string
  content: string
  status: "generating" | "completed" 
  transcript: string
  summary: string
  folder_id: string
  created_at: string
  updated_at: string
}


