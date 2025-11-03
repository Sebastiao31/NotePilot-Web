import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    const supabase = await createSupabaseClient();

    const title =
      text.split("\n").map(s => s.trim()).find(Boolean)?.slice(0, 80) || "Untitled";

    const insertPayload = {
      user_id: userId,
      title,
      type: "text",
      url: "",
      status: "generating",
      transcript: text,
      summary: "",
    };

    const { data, error } = await supabase
      .from("notes")
      .insert(insertPayload)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}