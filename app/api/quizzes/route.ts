import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";
import OpenAI from "openai";

type QuizOption = { text: string; explanation: string };
type QuizQuestion = {
  question: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
  correctIndex: number;
  tip: string;
};
type QuizPayload = { source: "transcript" | "summary"; questions: QuizQuestion[] };

function cleanToJson(input: string): string {
  // Strip common code fences
  let s = input.trim();
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  // Try to find the first JSON object if extra text surrounds it
  const firstBrace = s.indexOf("{");
  const lastBrace = s.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    s = s.slice(firstBrace, lastBrace + 1);
  }
  return s;
}

function isValidQuizPayload(obj: any): obj is QuizPayload {
  if (!obj || typeof obj !== "object") return false;
  if (obj.source !== "transcript" && obj.source !== "summary") return false;
  if (!Array.isArray(obj.questions) || obj.questions.length === 0) return false;
  // Require between 10 and 15 questions (inclusive)
  if (obj.questions.length < 10 || obj.questions.length > 15) return false;
  for (const q of obj.questions) {
    if (!q || typeof q !== "object") return false;
    if (typeof q.question !== "string" || !Array.isArray(q.options)) return false;
    if (q.options.length !== 4) return false;
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) return false;
    if (typeof q.tip !== "string") return false;
    for (const opt of q.options) {
      if (!opt || typeof opt !== "object") return false;
      if (typeof opt.text !== "string" || typeof opt.explanation !== "string") return false;
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

    const { noteId } = await req.json();
    if (!noteId || typeof noteId !== "string") {
      return NextResponse.json({ error: "noteId is required" }, { status: 400 });
    }

    const supabase = await createSupabaseClient();

    // Verify note ownership and fetch context
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
    const contextSource: "transcript" | "summary" = transcript ? "transcript" : "summary";
    const context = (transcript || summary || "").slice(0, 16000);
    if (!context) {
      return NextResponse.json({ error: "No content available on note to generate a quiz" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key is missing (set NEXT_OPENAI_API or OPENAI_API_KEY)" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    const system = `
You are an expert educator generating high-quality multiple-choice quizzes from provided study content.

Requirements:

- Produce between 10 and 15 questions (inclusive). 
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

    const userPrompt = `Source (${contextSource}):\n\n${context}\n\nReturn ONLY the JSON object in the exact structure specified by the system.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" } as any, // tolerate older SDKs; if unsupported the response is still JSON-ish
    });

    const raw = (completion.choices?.[0]?.message?.content || "").trim();
    if (!raw) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 500 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanToJson(raw));
    } catch {
      return NextResponse.json({ error: "Failed to parse quiz JSON from model" }, { status: 500 });
    }

    // Ensure source matches our detected source to keep consistency
    parsed.source = contextSource;

    if (!isValidQuizPayload(parsed)) {
      return NextResponse.json({ error: "Model output did not match expected quiz schema" }, { status: 500 });
    }

    // Generate a short title in a second, cheap call. Keep language consistent.
    let title = "";
    try {
      const titleSystem = `
Provide a concise quiz title (3–7 words) that best captures the scope of the provided content. 
Match the content language. 
Respond ONLY as JSON: { "title": "..." } with no extra text.
      `.trim();
      const titleCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: titleSystem },
          { role: "user", content: context.slice(0, 4000) },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" } as any,
      });
      const titleRaw = (titleCompletion.choices?.[0]?.message?.content || "").trim();
      const parsedTitle = JSON.parse(cleanToJson(titleRaw));
      if (parsedTitle && typeof parsedTitle.title === "string") {
        title = parsedTitle.title.replace(/\s+/g, " ").trim();
      }
    } catch {
      // Fallback: derive from note title or first question
      title = (note.title || "").trim() || String(parsed.questions?.[0]?.question || "Quiz").slice(0, 80);
    }
    if (!title) {
      title = "Quiz";
    }
    title = title.slice(0, 80);

    // Insert quiz into Supabase
    const insertPayload: any = {
      note_id: noteId,
      title,
      content: parsed,
      status: "generated",
    };

    // Try insert with title; if the DB hasn't been migrated yet to include 'title', fallback without it.
    let created: { id: string } | null = null;
    {
      const { data, error } = await supabase
        .from("quizzes")
        .insert(insertPayload)
        .select("id")
        .single();
      if (!error && data) {
        created = data as any;
      } else if (error && /column .*title.* does not exist/i.test(error.message || "")) {
        const { title: _omit, ...withoutTitle } = insertPayload;
        const { data: data2, error: err2 } = await supabase
          .from("quizzes")
          .insert(withoutTitle)
          .select("id")
          .single();
        if (err2 || !data2) {
          return NextResponse.json({ error: err2?.message || "Failed to save quiz" }, { status: 500 });
        }
        created = data2 as any;
      } else {
        return NextResponse.json({ error: error?.message || "Failed to save quiz" }, { status: 500 });
      }
    }

    const createdId = (created as any)?.id as string | undefined;
    if (!createdId) {
      return NextResponse.json({ error: "Quiz created but no id returned" }, { status: 500 });
    }
    return NextResponse.json(
      { id: createdId, title, quiz: parsed },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("[quizzes] error", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


