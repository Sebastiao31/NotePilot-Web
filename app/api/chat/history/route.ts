import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const noteId = req.nextUrl.searchParams.get("noteId");
    if (!noteId) return NextResponse.json({ error: "noteId is required" }, { status: 400 });

    const supabase = await createSupabaseClient();

    // Verify note ownership
    const { data: note, error: noteErr } = await supabase
      .from("notes")
      .select("id, user_id")
      .eq("id", noteId)
      .single();
    if (noteErr || !note) return NextResponse.json({ error: noteErr?.message || "Note not found" }, { status: 404 });
    if (note.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Get or create chat for this note
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

    // Fetch recent messages
    const { data: history, error: msgErr } = await supabase
      .from("messages")
      .select("id, role, content, created_at, like, dislike")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (msgErr) return NextResponse.json({ error: msgErr.message }, { status: 500 });

    return NextResponse.json({ chatId, messages: history ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


