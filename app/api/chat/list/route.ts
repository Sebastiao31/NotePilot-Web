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

    const { data, error } = await supabase
      .from("chats")
      .select("id, created_at")
      .eq("note_id", noteId)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ chats: data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


