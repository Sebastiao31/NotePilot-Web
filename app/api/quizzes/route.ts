import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "@/lib/supabase-server"
import OpenAI from "openai"

type QuizOption = { text: string; explanation: string }
export type QuizQuestion = {
  question: string
  options: [QuizOption, QuizOption, QuizOption, QuizOption]
  correctIndex: 0 | 1 | 2 | 3
  tip: string
}
export type QuizPayload = {
  questions: QuizQuestion[]
  source: "summary"
}

function isValidQuizPayload(obj: any): obj is QuizPayload {
  if (!obj || typeof obj !== "object") return false
  if (!Array.isArray(obj.questions)) return false
  if (obj.source !== "summary") return false
  for (const q of obj.questions) {
    if (!q || typeof q !== "object") return false
    if (typeof q.question !== "string") return false
    if (!Array.isArray(q.options) || q.options.length !== 4) return false
    for (const opt of q.options) {
      if (!opt || typeof opt !== "object") return false
      if (typeof opt.text !== "string") return false
      if (typeof opt.explanation !== "string") return false
    }
    if (![0, 1, 2, 3].includes(q.correctIndex)) return false
    if (typeof q.tip !== "string") return false
  }
  return true
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { noteId } = await req.json()
    if (!noteId || typeof noteId !== "string") {
      return NextResponse.json({ error: "noteId is required" }, { status: 400 })
    }

    const supabase = await createSupabaseClient()

    // Verify note ownership and fetch summary context
    const { data: note, error: noteErr } = await supabase
      .from("notes")
      .select("id, user_id, title, summary")
      .eq("id", noteId)
      .single()
    if (noteErr || !note) return NextResponse.json({ error: noteErr?.message || "Note not found" }, { status: 404 })
    if (note.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const summary = (note.summary || "").trim()
    if (!summary) {
      return NextResponse.json({ error: "Note has no summary to generate a quiz from" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 })
    const openai = new OpenAI({ apiKey })

    const system = `
You are an expert educator generating high-quality multiple-choice quizzes from provided study content.

Requirements:

- Produce between 10 and 15 questions. 
- Each question MUST have exactly 4 options.
- Exactly ONE option is correct per question (use correctIndex 0..3).
- For EVERY option include an explanation stating why it is correct/incorrect.
- Include a short tip for each question that nudges the student toward the correct reasoning without giving the answer away.
- Keep language consistent with the provided content.
- Prefer clarity, correctness, and unambiguous distractors.
- Enumerate the options with A. B. C. D.
- Always use markdown formatting when writing mathematical expressions to the question, options, and tip.


# Math and formatting

- Use ONLY inline math with $...$ for any mathematical or chemical expressions.
- Everytime you will use block math ($$...$$) use inline math with $...$ instead.

Output STRICTLY valid JSON with this TypeScript shape:

{
  "questions": Array<{
    "question": string;
    "options": [
      { "text": string; "explanation": string },
      { "text": string; "explanation": string },
      { "text": string; "explanation": string },
      { "text": string; "explanation": string }
    ];
    "correctIndex": 0 | 1 | 2 | 3;
    "tip": string;
  }>;
  "source": "summary";
}`.trim()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: summary.slice(0, 16000) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" } as any,
    })

    const raw = (completion.choices?.[0]?.message?.content || "").trim()

    let parsed: QuizPayload | null = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      // try to salvage JSON if model added extra text
      const start = raw.indexOf("{")
      const end = raw.lastIndexOf("}")
      if (start >= 0 && end > start) {
        try { parsed = JSON.parse(raw.slice(start, end + 1)) } catch {}
      }
    }

    if (!parsed || !isValidQuizPayload(parsed)) {
      return NextResponse.json({ error: "Model returned invalid quiz JSON" }, { status: 500 })
    }

    // Store quiz
    const { data: created, error: insertErr } = await supabase
      .from("quizzes")
      .insert({ note_id: noteId, content: parsed, status: "generated" })
      .select("id")
      .single()
    if (insertErr || !created) {
      return NextResponse.json({ error: insertErr?.message || "Failed to save quiz" }, { status: 500 })
    }

    return NextResponse.json({ id: created.id, quiz: parsed }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
