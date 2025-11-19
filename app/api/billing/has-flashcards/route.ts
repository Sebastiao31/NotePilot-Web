import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId, has } = await auth()
    if (!userId) return NextResponse.json({ allowed: false }, { status: 200 })

    // Align with quiz gating: Pro plan required
    const hasProPlan = has({ plan: "notepilot_pro" })
    const allowed = Boolean(hasProPlan)
    return NextResponse.json({ allowed }, { status: 200 })
  } catch {
    return NextResponse.json({ allowed: false }, { status: 200 })
  }
}


