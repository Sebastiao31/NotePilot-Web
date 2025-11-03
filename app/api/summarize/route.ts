import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";
import OpenAI from "openai";
import { SUMMARIZE_PROMPT } from '@/constants'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { noteId } = await req.json();
    if (!noteId) {
      return NextResponse.json({ error: "noteId is required" }, { status: 400 });
    }

    const supabase = await createSupabaseClient();

    const { data: note, error: fetchErr } = await supabase
      .from("notes")
      .select("id, user_id, transcript")
      .eq("id", noteId)
      .single();

    if (fetchErr || !note) {
      return NextResponse.json({ error: fetchErr?.message || "Note not found" }, { status: 404 });
    }
    if (note.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const transcript = note.transcript || "";
    if (!transcript.trim()) {
      return NextResponse.json({ error: "Transcript is empty" }, { status: 400 });
    }

    console.log("[summarize] start", { noteId, transcriptLength: transcript.length });

    const apiKey = process.env.NEXT_OPENAI_API;
    if (!apiKey) {
      console.error("[summarize] Missing OpenAI API key");
      return NextResponse.json({ error: "OpenAI API key is missing (set NEXT_OPENAI_KEY or OPENAI_API_KEY)" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    const system = `
    #Role:
    You are a specialist teacher on the topic that is being talked about that writes clean summaries that prioritize hierachy and readability in semantic HTML *without the markdown tags \`\`\`html\`\`\`*, for a AI note-taking web-app that uses the Tiptap editor.
    
    #TipTap:
    The TipTap editor supports the folowing extensions:

    - StarterKit (p, h1, h2, h3, ul, ol, li, blockquote, code, strong, em, underline, strike)
    - Highlight
    - TableKit (table, tr, td, th)
    - Math (inline math, block math)
    - Subscript (a<sub>b</sub>)
    - Superscript (a<sup>b</sup>)

    # AI Output Guidelines
    - The output should be a valid HTML document that can be rendered in the TipTap editor".
    - In the first heading (title) don't use a generic title, like "Overview", "Summary", write a specific title based on the content. Don't make it too long 3-8 words maximum.
    - Emphasize key terms with <strong> tags; nuance with <em> tags; short code with <code> tags.
    - When writing lists, use <ul> and <li> tags. When writing numbered lists, use <ol> and <li> tags.
    - Always use <blockquote> tags when citing quotes.
    - Always when writing mathematical or chemical expressions, use the correct syntax:
        - For inline math or chemical expressions, use the <span data-type="inline-math" data-latex="..."></span> syntax.
        - For block math or chemical expressions, use the <div data-type="block-math" data-latex="..."></div> syntax.
        - For chemical expressions, use correctly the <sub> and <sup> tags.
        - Don´t use code or blockquote tags for chemical or mathematical expressions, use the correct syntax instead.
    - The content should be written in the language of the transcript.
    - Prefer short paragraphs and bullet lists, but feel free to use more paragraphs and bullet lists if the content is big and complex and if you think it fits better and is more valuable for the user.
    - Always have attention to readability of the content, never make the paragraphs too "crowded" or "cluttered".

    # Before generating the summary
    Verify the following before generating the summary:
    - Is the content in the language of the source content?
    - Is the content relevant to the source content?
    - Is the content accurate?
    - Is the content complete?
    - All math expression/equations/formulas are correctly formatted according to the inline or block math delimiters specified in the system instructions.
    - All tags are correctly formatted according to the HTML syntax.

    
    
    
    `;
    const user = `Summarize the following text:\n\n${transcript} \n\nFollowing the system instructions: ${system}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
    });

    const html = (completion.choices?.[0]?.message?.content || "").trim();
    if (!html) {
      return NextResponse.json({ error: "Empty summary from model" }, { status: 500 });
    }

    console.log("[summarize] generated", { noteId, htmlLength: html.length, preview: html.slice(0, 200) });

    // Extract the first <h1> content from the generated HTML to use as title
    const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)
    let extractedTitle = h1Match ? h1Match[1] : ""
    if (extractedTitle) {
      // Strip any inner HTML tags and normalize whitespace
      extractedTitle = extractedTitle.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
      // Truncate to a reasonable length
      extractedTitle = extractedTitle.slice(0, 80)
    }

    const updatePayload: any = { summary: html, status: "completed" }
    if (extractedTitle) updatePayload.title = extractedTitle

    const { error: updateErr } = await supabase
      .from("notes")
      .update(updatePayload)
      .eq("id", noteId)
      .eq("user_id", userId);

    if (updateErr) {
      console.error("[summarize] update failed", { noteId, error: updateErr.message });
      return NextResponse.json({ error: updateErr.message, hint: "Check RLS UPDATE policy for table 'notes'" }, { status: 500 });
    }

    console.log("[summarize] success", { noteId });
    return NextResponse.json({ noteId, summary: html, title: extractedTitle || null }, { status: 200 });
  } catch (e: any) {
    console.error("[summarize] error", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


