import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase-server";

function extractTitle(html: string): string | null {
  const m = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)
  if (!m) return null
  return m[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || null
}

function extractVisibleText(html: string): string {
  // Remove head, scripts, styles, svg, noscript
  let clean = html
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")

  // Replace block-level tags with line breaks to keep some structure
  clean = clean.replace(/<(\/?)(p|div|br|li|ul|ol|h1|h2|h3|h4|h5|h6|section|article|header|footer|main|nav|tr|td|th)>/gi, "\n")

  // Strip remaining tags
  clean = clean.replace(/<[^>]+>/g, " ")

  // Decode basic entities
  clean = clean
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

  // Normalize whitespace
  clean = clean.replace(/[\r\t]+/g, " ").replace(/\n{3,}/g, "\n\n").replace(/[ \f\v]+/g, " ")
  clean = clean.split("\n").map(s => s.trim()).filter(Boolean).join("\n")

  return clean.trim()
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }

    let parsed: URL
    try {
      parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    } catch {
      return NextResponse.json({ error: "Malformed URL" }, { status: 400 })
    }

    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    })
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch URL (status ${res.status})` }, { status: 502 })
    }
    const html = await res.text()
    const transcript = extractVisibleText(html)
    if (!transcript) {
      return NextResponse.json({ error: "No visible text found on page" }, { status: 400 })
    }

    const supabase = await createSupabaseClient();

    const titleFromPage = extractTitle(html)
    const fallbackTitle = parsed.hostname.replace(/^www\./, "") || "Untitled"
    const title = (titleFromPage || fallbackTitle).slice(0, 80)

    const insertPayload = {
      user_id: userId,
      title,
      type: "website" as const,
      url: parsed.toString(),
      status: "generating" as const,
      transcript,
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

    return NextResponse.json({ id: data.id, title }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


