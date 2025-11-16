import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { image } = await req.json()
    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "image is required (data URL)" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "OpenAI API key missing" }, { status: 500 })

    const openai = new OpenAI({ apiKey })

    const system = `You are a math OCR engine The user sends handwritten math on a whiteboard.
    
    Rules:
    - Return ONLY the LaTeX expression (inline form), no commentary.
    - Do NOT wrap with $ or $$, just the <span data-type="inline-math" data-latex="..."></span> syntax.
    - Prefer concise, standard LaTeX commands.`

    const userPrompt = `Transcribe this equation drawing to valid LaTeX (inline).`

    // Vision prompt using image_url content; types may not include image content yet, so cast to any.
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: image, detail: "auto" } as any } as any,
          ] as any,
        } as any,
      ],
    } as any)

    let latex = (completion as any)?.choices?.[0]?.message?.content || ""
    latex = String(latex).trim()
    // Strip accidental code fences or $ wrappers
    latex = latex
      .replace(/```(?:latex)?/gi, "")
      .replace(/```/g, "")
      .replace(/^\$+|\$+$/g, "")
      .trim()
      .slice(0, 2000)

    if (!latex) {
      return NextResponse.json({ error: "Empty recognition result" }, { status: 500 })
    }

    return NextResponse.json({ latex }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}


