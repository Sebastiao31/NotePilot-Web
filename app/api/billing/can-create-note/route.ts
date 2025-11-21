import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "@/lib/supabase-server"

const FREE_NOTE_LIMIT = 3

export async function GET() {
  try {
    const { userId, has } = await auth()
    if (!userId) {
      return NextResponse.json({ allowed: false }, { status: 200 })
    }

    const hasProPlan = has({ plan: "notepilot_pro" })
    if (hasProPlan) {
      return NextResponse.json({ allowed: true }, { status: 200 })
    }

    const supabase = await createSupabaseClient()
    const { count, error } = await supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)

    if (error) {
      return NextResponse.json({ allowed: false }, { status: 200 })
    }

    const allowed = (count ?? 0) < FREE_NOTE_LIMIT
    return NextResponse.json({ allowed }, { status: 200 })
  } catch {
    return NextResponse.json({ allowed: false }, { status: 200 })
  }
}


