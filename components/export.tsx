'use client'

import { Button } from "./ui/button"
import React from "react"
import { useEditorBridge } from "@/components/richTextEditor/editor-context"

type ExportProps = {
  fileName?: string
  className?: string
}

export function Export({ fileName, className }: ExportProps) {
  const { editor } = useEditorBridge()

  const handleExport = async () => {
    if (!editor) return
    const sourceNode = editor.view.dom as HTMLElement
    const node = sourceNode.cloneNode(true) as HTMLElement

    // Inline computed RGB colors to avoid html2canvas parsing oklch/lab tokens
    const applyInlineComputedColors = (src: HTMLElement, dst: HTMLElement) => {
      const queue: Array<[Element, HTMLElement]> = [[src, dst]]
      const colorProps: Array<keyof CSSStyleDeclaration> = [
        "color",
        "backgroundColor",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
        "outlineColor",
        "fill",
        "stroke",
        "caretColor" as keyof CSSStyleDeclaration,
      ]
      while (queue.length) {
        const [srcEl, dstEl] = queue.shift()!
        const computed = window.getComputedStyle(srcEl as Element)
        for (const prop of colorProps) {
          try {
            const value = (computed as any)[prop] as string | undefined
            if (value && typeof value === "string") {
              (dstEl.style as any)[prop] = value
            }
          } catch {
            // ignore per-node style errors
          }
        }
        const srcChildren = (srcEl as HTMLElement).children || []
        const dstChildren = (dstEl as HTMLElement).children || []
        const len = Math.min(srcChildren.length, dstChildren.length)
        for (let i = 0; i < len; i++) {
          queue.push([srcChildren[i], dstChildren[i] as HTMLElement])
        }
      }
    }
    applyInlineComputedColors(sourceNode, node)

    // Show link targets in print
    node.querySelectorAll("a").forEach((a) => {
      const url = (a as HTMLAnchorElement).href
      if (url) a.setAttribute("data-print-href", ` (${url})`)
    })

    // Determine filename: prop -> first heading text -> document
    const sanitize = (s: string) =>
      (s || "document").trim().replace(/[\\/:*?"<>|]+/g, "").slice(0, 120) || "document"
    const firstHeading =
      node.querySelector("h1,h2,h3")?.textContent?.trim() ||
      node.querySelector("p")?.textContent?.trim() ||
      ""
    const finalName = sanitize(fileName || firstHeading || "document")

    const { default: html2pdf } = await import("html2pdf.js")

    html2pdf()
      .set({
        margin: [25, 25, 25, 25],
        filename: `${finalName}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        // pagebreak is supported by html2pdf.js but missing in types
        pagebreak: { mode: ["css", "legacy"] },
      } as any)
      .from(node)
      .save()
  }

  return (
    <Button onClick={handleExport} variant="ghost" disabled={!editor}>
      Export
    </Button>
  )
}