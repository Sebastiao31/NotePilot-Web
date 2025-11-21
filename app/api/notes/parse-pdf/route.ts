import { NextRequest } from 'next/server'

export const runtime = 'nodejs'          // MUST be Node (Edge will fail)
export const dynamic = 'force-dynamic'
// Optional for large PDFs on serverless hosts
// export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const isPdf =
      file.type === 'application/pdf' || file.name?.toLowerCase?.().endsWith('.pdf')
    if (!isPdf) {
      return Response.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      return Response.json({ error: 'PDF exceeds 10 MB limit' }, { status: 413 })
    }

    // Blob -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Load parser with a production-safe import so bundlers include it.
    // Try 'pdf-parse-new' first; fall back to 'pdf-parse' if unavailable.
    let pdfParse: (buf: Buffer, opts?: any) => Promise<any>
    let parserName = 'pdf-parse-new'
    try {
      const mod: any = await import('pdf-parse-new')
      pdfParse = (mod?.default ?? mod) as (buf: Buffer, opts?: any) => Promise<any>
    } catch {
      const mod: any = await import('pdf-parse')
      pdfParse = (mod?.default ?? mod) as (buf: Buffer, opts?: any) => Promise<any>
      parserName = 'pdf-parse'
    }

    const data = await pdfParse(buffer, { max: 0 })

    return Response.json({
      text: data?.text ?? '',
      numpages: (data as any)?.numpages ?? null,
      info: data?.info ?? null,
      version: parserName,
    })
  } catch (err: any) {
    console.error('parse-pdf error:', err)
    return Response.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
