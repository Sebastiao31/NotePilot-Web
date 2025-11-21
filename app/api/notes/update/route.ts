import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, summary, transcript, status, title, like, dislike, feedback } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    if (
      summary !== undefined &&
      typeof summary !== "string"
    ) {
      return NextResponse.json({ error: "Invalid summary" }, { status: 400 });
    }
    if (
      transcript !== undefined &&
      typeof transcript !== "string"
    ) {
      return NextResponse.json({ error: "Invalid transcript" }, { status: 400 });
    }
    if (
      status !== undefined &&
      typeof status !== "string"
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (
      title !== undefined &&
      typeof title !== "string"
    ) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    if (
      like !== undefined &&
      typeof like !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid like" }, { status: 400 });
    }
    if (
      dislike !== undefined &&
      typeof dislike !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid dislike" }, { status: 400 });
    }
    if (
      feedback !== undefined &&
      typeof feedback !== "string"
    ) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    const supabase = await createSupabaseClient();

    // Derive title from first <h1> if present
    let extractedTitle = "";
    if (summary) {
      const match = summary.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
      if (match) {
        extractedTitle = match[1]
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 80);
      }
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (summary !== undefined) updatePayload.summary = summary;
    if (transcript !== undefined) updatePayload.transcript = transcript;
    if (status !== undefined) updatePayload.status = status;
    if (title !== undefined) updatePayload.title = title;
    if (like !== undefined) updatePayload.like = like;
    if (dislike !== undefined) updatePayload.dislike = dislike;
    if (feedback !== undefined) updatePayload.feedback = feedback;
    if (extractedTitle) updatePayload.title = extractedTitle;

    if (Object.keys(updatePayload).length <= 1) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { error } = await supabase
      .from("notes")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id, title: extractedTitle || null }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


