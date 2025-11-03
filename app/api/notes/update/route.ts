import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, summary } = await req.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    if (typeof summary !== "string") {
      return NextResponse.json({ error: "Invalid summary" }, { status: 400 });
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

    const updatePayload: any = {
      summary: summary,
      updated_at: new Date().toISOString(),
    };
    if (extractedTitle) updatePayload.title = extractedTitle;

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


