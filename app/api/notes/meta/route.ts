import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await req.json()
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const supabase = await createSupabaseClient()
    const { data, error } = await supabase
      .from("notes")
      .select("id, type, created_at, updated_at, url, transcript")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Not found" }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}


