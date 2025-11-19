import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId, has } = await auth()
    if (!userId) return NextResponse.json({ allowed: false }, { status: 200 })

    // Allow if user is on the "pro" plan OR has a quiz-related feature
    const hasProPlan =
      has({ plan: "notepilot_pro" })
      

    

    const allowed = Boolean(hasProPlan)
    return NextResponse.json({ allowed }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ allowed: false }, { status: 200 })
  }
}


