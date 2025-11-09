import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";
import OpenAI from "openai";

type QuizOption = {
  text: string;
  explanation: string;
};

type QuizQuestion = {
  question: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
  correctIndex: number; // 0..3
  tip: string;
};

type QuizPayload = {
  questions: QuizQuestion[];
  source: "transcript" | "summary";
};

function isValidQuizPayload(payload: any): payload is QuizPayload {
  if (!payload || typeof payload !== "object") return false;
  if (!Array.isArray(payload.questions)) return false;
  if (payload.questions.length < 10 || payload.questions.length > 15) return false;
  for (const q of payload.questions) {
    if (!q || typeof q !== "object") return false;
    if (typeof q.question !== "string" || !q.question.trim()) return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) return false;
    if (typeof q.tip !== "string") return false;
    for (const opt of q.options) {
      if (!opt || typeof opt !== "object") return false;
      if (typeof opt.text !== "string" || !opt.text.trim()) return false;
      if (typeof opt.explanation !== "string") return false;
    }
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId, numQuestions } = await req.json().catch(() => ({}));
    if (!noteId || typeof noteId !== "string") {
      return NextResponse.json({ error: "noteId is required" }, { status: 400 });
    }
    const desiredCount =
      typeof numQuestions === "number" && numQuestions >= 10 && numQuestions <= 15
        ? Math.round(numQuestions)
        : undefined; // let model choose 10-15 if not provided

    const supabase = await createSupabaseClient();

    // Fetch note to validate ownership and gather context
    const { data: note, error: noteErr } = await supabase
      .from("notes")
      .select("id, user_id, title, transcript, summary")
      .eq("id", noteId)
      .single();
    if (noteErr || !note) {
      return NextResponse.json({ error: noteErr?.message || "Note not found" }, { status: 404 });
    }
    if (note.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const transcript = (note.transcript || "").trim();
    const summary = (note.summary || "").trim();
    const context = summary.length >= 400 ? summary : transcript;
    const source: "transcript" | "summary" = summary.length >= 400 ? "summary" : "transcript";

    if (!context) {
      return NextResponse.json({ error: "No content available in note to generate quiz" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    const system = `
You are an expert educator generating high-quality multiple-choice quizzes from provided study content.

Requirements:
- Produce between 10 and 15 questions (inclusive). ${desiredCount ? `Produce exactly ${desiredCount}.` : ""}
- Each question MUST have exactly 4 options.
- Exactly ONE option is correct per question (use correctIndex 0..3).
- For EVERY option include an explanation stating why it is correct/incorrect.
- Include a short tip for each question that nudges the student toward the correct reasoning without giving the answer away.
- Keep language consistent with the provided content.
- Prefer clarity, correctness, and unambiguous distractors.
- Enumerate the options with A. B. C. D.
- Always use markdown formatting when writing mathematical expressions to the question, options, and tip.
- Always in the end of a questions say "Notepilot" so that the user knows its using this prompt to generate the quiz.

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
  "source": "summary" | "transcript";
}

`.trim();

    const user = `
Title: ${note.title || "Untitled"}
Source: ${source}
Content:
${context.slice(0, 15000)}
`.trim();

    // Call model with JSON mode and up to 2 attempts for robustness
    let parsed: any = null;
    let lastErr: string | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: attempt === 0 ? 0.3 : 0.2,
        response_format: { type: "json_object" as const },
      });
      const raw = (completion.choices?.[0]?.message?.content || "").trim();
      if (!raw) {
        lastErr = "Empty response from model";
        continue;
      }
      // Ensure plain JSON (guard if fences slip through)
      const jsonText = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      try {
        const candidate = JSON.parse(jsonText);
        if (isValidQuizPayload(candidate)) {
          parsed = candidate;
          break;
        } else {
          lastErr = "Quiz JSON failed validation";
        }
      } catch (e: any) {
        lastErr = "Model returned invalid JSON";
      }
    }
    if (!parsed) {
      return NextResponse.json({ error: lastErr || "Failed to generate quiz" }, { status: 500 });
    }

    // Stamp the chosen source for traceability
    const payload: QuizPayload = { ...parsed, source };

    // Upsert strategy:
    // - If a quiz already exists for this note, update its content instead of creating a new row
    // - Otherwise, insert a new quiz row
    const { data: existing, error: existingErr } = await supabase
      .from("quizzes")
      .select("id")
      .eq("note_id", noteId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (existingErr) {
      return NextResponse.json({ error: existingErr.message }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      const quizId = (existing[0] as any).id as string;
      const { data: updated, error: updateErr } = await supabase
        .from("quizzes")
        .update({ content: payload, status: "generated", system_prompt: system })
        .eq("id", quizId)
        .select("id")
        .single();
      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
      return NextResponse.json({ id: updated.id, quiz: payload }, { status: 200 });
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from("quizzes")
        .insert({ note_id: noteId, content: payload, status: "generated", system_prompt: system })
        .select("id")
        .single();
      if (insertErr) {
        return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }
      return NextResponse.json({ id: inserted.id, quiz: payload }, { status: 201 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


