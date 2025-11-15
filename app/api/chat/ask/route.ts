import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { noteId, message, scope } = await req.json();
    if (!noteId || !message || typeof message !== "string") {
      return NextResponse.json({ error: "noteId and message are required" }, { status: 400 });
    }
    // Coerce scope robustly: explicit false-like values -> false; otherwise default to true
    const scoped: boolean =
      scope === false ||
      scope === 0 ||
      (typeof scope === 'string' && (scope.toLowerCase() === 'false' || scope === '0'))
        ? false
        : true

    const supabase = await createSupabaseClient();

    // Verify note and fetch context
    const { data: note, error: noteErr } = await supabase
      .from("notes")
      .select("id, user_id, title, transcript, summary")
      .eq("id", noteId)
      .single();
    if (noteErr || !note) return NextResponse.json({ error: noteErr?.message || "Note not found" }, { status: 404 });
    if (note.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Get or create chat
    const { data: existingChats, error: chatErr } = await supabase
      .from("chats")
      .select("id")
      .eq("note_id", noteId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (chatErr) return NextResponse.json({ error: chatErr.message }, { status: 500 });

    let chatId: string;
    if (existingChats && existingChats.length) {
      chatId = existingChats[0].id as string;
    } else {
      const { data: created, error: createErr } = await supabase
        .from("chats")
        .insert({ note_id: noteId, suggestions: null })
        .select("id")
        .single();
      if (createErr || !created) return NextResponse.json({ error: createErr?.message || "Failed to create chat" }, { status: 500 });
      chatId = created.id as string;
    }

    // Pull recent history BEFORE inserting the current message so we don't duplicate in context
    const { data: history, error: histErr } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })
      .limit(30);
    if (histErr) return NextResponse.json({ error: histErr.message }, { status: 500 });

    // Insert user message (persist scope preference). If 'scope' column is missing (older schema),
    // gracefully fallback to inserting without it so the app still works.
    {
      const { error: userMsgErr } = await supabase
        .from("messages")
        .insert({ chat_id: chatId, role: "user", content: message, scope: scoped as any });
      if (userMsgErr) {
        // Retry without scope for backward compatibility
        const { error: retryErr } = await supabase
          .from("messages")
          .insert({ chat_id: chatId, role: "user", content: message });
        if (retryErr) {
          return NextResponse.json({ error: retryErr.message || "Failed to store user message" }, { status: 500 });
        }
      }
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 });
    const openai = new OpenAI({ apiKey });

    const transcript = (note.transcript || "").slice(0, 15000);
    const summary = (note.summary || "").slice(0, 10000);

    const systemScoped = `You are NotePilot, an intelligent assistant that helps users understand and explore the content of a single note. You provide thoughtful, concise, and well-structured answers grounded in the provided context.

Context provided:
- Title: ${note.title || "Untitled"}
- Summary (HTML allowed): ${summary}
- Transcript: ${transcript}

Core Guidelines:
- If the questions isn't totally related to the note, but it's in the same "niche" or topic of the note, answer the question as best as you can.
- You are an expert communicator and master of Markdown-to-HTML formatting.
- Prioritize clarity, accuracy, and relatability — make answers sound natural, yet professional.
- Always base your answers on the note’s content. If something isn’t in the note, say politely that you don’t know and suggest another question the user might ask.
- If the user drifts away from the note’s topic, respond with something like:
  “Hmm, looks like you are getting distracted! Ask me something related to the note.”
- Respond in the same language as the user’s question unless the note clearly uses another language.
- Keep responses concise but complete — prefer short paragraphs and bullet/numeric points and relevant examples from the note.
- When giving examples, use the <blockquote> tag give a citation impression to the user.
        
        Formatting Rules (STRICT):
        - Output must be GitHub‑flavored Markdown (GFM) with LaTeX math.
        - Use:
          - Headings with #, ##, ### (keep to max H3).
          - Bold/italic using **bold** and _italic_.
          - Bulleted/numbered lists with -, * and 1.
          - Blockquotes with >.
          - Inline code with single \`...\`.
          - Fenced code blocks with language tags, e.g. \`\`\`ts, \`\`\`python.
          - NEVER write inline math expression like f(x), f(x) = x^2, [a.b], etc, has if they were inline code, use the correct inline math syntax instead $...$.
          - Math: inline math MUST use $...$ (never \\( ... \\)); example: $c^2 = a^2 + b^2$. Block math MUST use $$...$$; example: $$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$.
          - GFM tables using pipe syntax with a header separator row (---).
        - Do NOT output raw HTML tags (no <table>, <code>, <p>, etc.).
        - Keep sections short and readable; prefer lists where helpful.
        

Tone and Style:
- Friendly but focused.
- Sounds like a helpful human, not a bot.
- Encouraging and slightly witty when redirecting the user.
- Avoid filler or repetition.
- If unsure, acknowledge it gracefully rather than guessing.

`;

    const systemUnscoped = `You are NotePilot, an intelligent assistant that provides thoughtful, concise, and well-structured answers. You are not restricted to the current note’s content; you may answer any question, but you can use the note context below when helpful.

Optional context you can use:
- Title: ${note.title || "Untitled"}
- Summary (HTML allowed): ${summary}
- Transcript: ${transcript}

Core Guidelines:
- You are an expert communicator and master of Markdown-to-HTML formatting.
- Prioritize clarity, accuracy, and relatability — make answers sound natural, yet professional.
- Use the provided note context when it’s relevant, but you may go beyond it to answer the user’s question.
- Respond in the same language as the user’s question.
- Keep responses concise but complete — prefer short paragraphs and bullet/numeric points and relevant examples.
- When giving examples, use the <blockquote> tag give a citation impression to the user.
        
        Formatting Rules (STRICT):
        - Output must be GitHub‑flavored Markdown (GFM) with LaTeX math.
        - Use:
          - Headings with #, ##, ### (keep to max H3).
          - Bold/italic using **bold** and _italic_.
          - Bulleted/numbered lists with -, * and 1.
          - Blockquotes with >.
          - Inline code with single \`...\`.
          - Fenced code blocks with language tags, e.g. \`\`\`ts, \`\`\`python.
          - NEVER write inline math expression like f(x), f(x) = x^2, [a.b], etc, has if they were inline code, use the correct inline math syntax instead $...$.
          - Math: inline math MUST use $...$ (never \\( ... \\)); example: $c^2 = a^2 + b^2$. Block math MUST use $$...$$; example: $$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$.
          - GFM tables using pipe syntax with a header separator row (---).
        - Do NOT output raw HTML tags (no <table>, <code>, <p>, etc.).
        - Keep sections short and readable; prefer lists where helpful.
        

Tone and Style:
- Friendly but focused.
- Sounds like a helpful human, not a bot.
- Avoid filler or repetition.
- If unsure, acknowledge it gracefully rather than guessing.

`;

    const system = scoped ? systemScoped : systemUnscoped;

    // Build conversation with history
    const pastMessages = (history || []).map((m) => ({
      role: (m.role as "user" | "assistant"),
      content: m.content || "",
    }))

    const conversation = [
      { role: "system" as const, content: system },
      ...pastMessages,
      { role: "user" as const, content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
      temperature: 0.2,
    });

    const answer = (completion.choices?.[0]?.message?.content || "").trim();
    if (!answer) return NextResponse.json({ error: "Empty response from model" }, { status: 500 });

    // Insert assistant message with same scope; fallback if 'scope' column missing
    let insertedAssistantId: string | null = null
    {
      const { data: asstWithScope, error: asstWithScopeErr } = await supabase
        .from("messages")
        .insert({ chat_id: chatId, role: "assistant", content: answer, scope: scoped as any })
        .select("id")
        .single();
      if (asstWithScopeErr) {
        const { data: asstNoScope, error: asstNoScopeErr } = await supabase
          .from("messages")
          .insert({ chat_id: chatId, role: "assistant", content: answer })
          .select("id")
          .single();
        if (asstNoScopeErr || !asstNoScope) {
          return NextResponse.json({ error: asstNoScopeErr?.message || "Failed to store assistant message" }, { status: 500 });
        }
        insertedAssistantId = (asstNoScope as any).id as string
      } else {
        insertedAssistantId = (asstWithScope as any).id as string
      }
    }

    return NextResponse.json({ chatId, answer, messageId: insertedAssistantId }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


