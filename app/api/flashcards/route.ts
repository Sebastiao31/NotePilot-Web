import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "@/lib/supabase-server"
import OpenAI from "openai"

type Flashcard = { front: string; back: string }
type FlashcardsPayload = { cards: Flashcard[]; source: "summary" }

function isValidFlashcardsPayload(obj: any): obj is FlashcardsPayload {
	if (!obj || typeof obj !== "object") return false
	if (obj.source !== "summary") return false
	if (!Array.isArray(obj.cards)) return false
	if (obj.cards.length < 1) return false
	for (const c of obj.cards) {
		if (!c || typeof c !== "object") return false
		if (typeof c.front !== "string") return false
		if (typeof c.back !== "string") return false
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

		// Verify note and fetch summary
		const { data: note, error: noteErr } = await supabase
			.from("notes")
			.select("id, user_id, title, summary")
			.eq("id", noteId)
			.single()
		if (noteErr || !note) return NextResponse.json({ error: noteErr?.message || "Note not found" }, { status: 404 })
		if (note.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

		const summary = (note.summary || "").trim()
		if (!summary) return NextResponse.json({ error: "Note has no summary to generate flashcards" }, { status: 400 })

		const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
		if (!apiKey) return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 })
		const openai = new OpenAI({ apiKey })

		const system = `
You are an expert educator generating high-quality spaced-repetition flashcards from provided study content.

Requirements:

- Produce between 15 and 20 cards.
- The front is a clear, atomic question or prompt (concise).
- The back is a precise, correct answer (concise, but complete enough).
- Keep language consistent with the provided content.
- Prefer clarity, correctness, and unambiguous phrasing.
- Always use markdown formatting when writing mathematical expressions in front/back.

# Math and formatting

- Use ONLY inline math with $...$ for any mathematical or chemical expressions.
- Every time you will use block math ($$...$$) use inline math with $...$ instead.

Output STRICTLY valid JSON with this TypeScript shape:

{
  "cards": Array<{
    "front": string; // question
    "back": string;  // answer
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
		let parsed: FlashcardsPayload | null = null
		try {
			parsed = JSON.parse(raw)
		} catch {
			const start = raw.indexOf("{")
			const end = raw.lastIndexOf("}")
			if (start >= 0 && end > start) {
				try { parsed = JSON.parse(raw.slice(start, end + 1)) } catch {}
			}
		}
		if (!parsed || !isValidFlashcardsPayload(parsed)) {
			return NextResponse.json({ error: "Model returned invalid flashcards JSON" }, { status: 500 })
		}

		const { data: created, error: insertErr } = await supabase
			.from("flashcards")
			.insert({ note_id: noteId, content: parsed, status: "generated" })
			.select("id")
			.single()
		if (insertErr || !created) {
			return NextResponse.json({ error: insertErr?.message || "Failed to save flashcards" }, { status: 500 })
		}

		return NextResponse.json({ id: created.id, flashcards: parsed }, { status: 201 })
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
	}
}


