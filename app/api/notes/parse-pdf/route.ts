import { NextRequest } from 'next/server'
import { createRequire } from 'module'

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

    // Load CommonJS module safely from an ESM file
    const require = createRequire(import.meta.url)
    const pdfParse = require('pdf-parse-new') as (buf: Buffer, opts?: any) => Promise<any>

    const data = await pdfParse(buffer, { max: 0 })

    return Response.json({
      text: data?.text ?? '',
      numpages: (data as any)?.numpages ?? null,
      info: data?.info ?? null,
      version: 'pdf-parse-new',
    })
  } catch (err: any) {
    console.error('parse-pdf error:', err)
    return Response.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
