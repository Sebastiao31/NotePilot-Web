import { NextRequest } from "next/server"
import OpenAI from "openai"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const isAudio =
      (file.type && file.type.startsWith("audio/")) ||
      (file.name && /\.(mp3|wav|m4a|flac|ogg|webm|aac|mp4)$/i.test(file.name))

    if (!isAudio) {
      return Response.json({ error: "Only audio files are supported" }, { status: 400 })
    }

    const maxBytes = 25 * 1024 * 1024 // 25 MB
    if (file.size > maxBytes) {
      return Response.json({ error: "Audio exceeds 25 MB limit" }, { status: 413 })
    }

    const apiKey = process.env.NEXT_OPENAI_API
    if (!apiKey) {
      return Response.json(
        { error: "OpenAI API key is missing (set NEXT_OPENAI_API)" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // The OpenAI SDK supports web File/Blob in Node 18+ via undici.
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
      // You may add language hints or prompt here if needed
    })

    const text = (transcription as any)?.text || ""
    return Response.json({ text })
  } catch (err: any) {
    console.error("parse-audio error:", err)
    return Response.json({ error: String(err?.message || err) }, { status: 500 })
  }
}


