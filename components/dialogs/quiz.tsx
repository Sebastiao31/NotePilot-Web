import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconBulb, IconLoader2 } from "@tabler/icons-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

type QuizOption = { text: string; explanation: string }
type QuizQuestion = {
  question: string;
  options: [QuizOption, QuizOption, QuizOption, QuizOption];
  correctIndex: number;
  tip: string;
}
type QuizPayload = { questions: QuizQuestion[]; source: 'transcript' | 'summary' }

export function QuizDialog({ open, onOpenChange, loading, quiz, onRegenerate }: { open?: boolean; onOpenChange?: (open: boolean) => void; loading?: boolean; quiz?: QuizPayload | null; onRegenerate?: () => void }) {
    const [quizUrl, setQuizUrl] = useState("")
  const [index, setIndex] = useState(0)
  const [selections, setSelections] = useState<Array<number | null>>([])
  const [showSummary, setShowSummary] = useState(false)

  React.useEffect(() => {
    setIndex(0)
    const count = quiz?.questions?.length ?? 0
    setSelections(Array.from({ length: count }, () => null))
    setShowSummary(false)
  }, [quiz, open])

  const controlledProps = open === undefined ? {} : {
    open,
    onOpenChange: (next: boolean) => {
      // Block closing while loading
      if (loading && open && !next) return
      onOpenChange?.(next)
    }
  }
  return (

        <Dialog {...controlledProps}>
        
        <DialogContent
          onEscapeKeyDown={(e) => { if (loading) e.preventDefault() }}
          onPointerDownOutside={(e) => { if (loading) e.preventDefault() }}
          showCloseButton={!loading}
        >
            <DialogHeader>
                <DialogTitle>Quiz</DialogTitle>

                
                {loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconLoader2 className="size-4 animate-spin" />
                    <span className="animate-pulse">Generating quiz. This may take a few seconds.</span>
                  </div>
                ) : null}
            </DialogHeader>

            {!loading && quiz && Array.isArray(quiz.questions) && quiz.questions.length > 0 ? (
              <div className="space-y-4 pt-4">
                {showSummary ? (
                  <div className="space-y-5">
                    <div className="text-center">
                      <p className="text-base font-medium">Quiz completed!</p>
                    </div>
                    {(() => {
                      const total = quiz.questions.length
                      const answered = selections.filter((s) => s !== null).length
                      let correct = 0
                      selections.forEach((sel, idx) => {
                        if (sel !== null && sel === quiz.questions[idx].correctIndex) correct++
                      })
                      const accuracy = total ? Math.round((correct / total) * 100) : 0
                      const precision = answered ? Math.round((correct / answered) * 100) : 0
                      const items = [
                        { label: "Score", value: `${correct} / ${total}` },
                        { label: "Precision", value: `${precision}%` },
                        { label: "Answered", value: `${answered} / ${total}` },
                      ]
                      return (
                        <div className="grid grid-cols-3 gap-3">
                          {items.map((it, i) => (
                            <div key={i} className="rounded-lg border p-3">
                              <div className="text-xs text-muted-foreground">{it.label}</div>
                              <div className="text-base font-semibold">{it.value}</div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        className="rounded-full"
                        onClick={() => { setShowSummary(false); setIndex(0) }}
                      >
                        Review quiz
                      </Button>
                      <Button
                        onClick={() => { onRegenerate?.() }}
                        disabled={loading}
                      >
                        Generate another
                      </Button>
                    </div>
                  </div>
                ) : null}

                {!showSummary ? (
                  <>
                    <div className="mb-8 text-md font-medium">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm as any, remarkMath as any]}
                        rehypePlugins={[rehypeKatex as any]}
                      >
                        {quiz.questions[index].question}
                      </ReactMarkdown>
                    </div>

                    <div className="space-y-2">
                      {(() => {
                        const selected = selections[index] ?? null
                        const showFeedback = selected !== null
                        const correctIndex = quiz.questions[index].correctIndex
                        return quiz.questions[index].options.map((opt, i) => {
                          const isSelected = selected === i
                          const isCorrect = i === correctIndex
                          const shouldShowThis =
                            showFeedback &&
                            (
                              (selected === correctIndex && i === correctIndex) ||
                              (selected !== correctIndex && (i === correctIndex || i === selected))
                            )
                          const clickable = selected === null
                          const highlightClass = showFeedback
                            ? (isCorrect
                                ? "border-badge-green bg-badge-green-foreground"
                                : (isSelected ? "border-badge-red bg-badge-red-foreground" : ""))
                            : ""
                          const mutedClass = showFeedback && !shouldShowThis ? "opacity-60" : ""
                          return (
                            <div
                              key={i}
                              className={`rounded-md border p-2 transition-colors ${clickable ? "cursor-pointer" : "cursor-default"} ${highlightClass} ${mutedClass}`}
                              onClick={() => {
                                if (selected !== null) return
                                setSelections((prev) => {
                                  const next = [...prev]
                                  next[index] = i
                                  return next
                                })
                              }}
                              role="button"
                              aria-pressed={isSelected}
                              aria-disabled={selected !== null}
                              data-state={isSelected ? 'on' : undefined}
                            >
                              <div className="flex items-start justify-between">
                                <div className="text-sm">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm as any, remarkMath as any]}
                                    rehypePlugins={[rehypeKatex as any]}
                                  >
                                    {opt.text}
                                  </ReactMarkdown>
                                </div>
                              </div>
                              {shouldShowThis ? (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <ReactMarkdown
                                    remarkPlugins={[remarkGfm as any, remarkMath as any]}
                                    rehypePlugins={[rehypeKatex as any]}
                                  >
                                    {opt.explanation}
                                  </ReactMarkdown>
                                </div>
                              ) : null}
                            </div>
                          )
                        })
                      })()}
                    </div>

                    <div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <span className="flex items-center gap-1">
                            <IconBulb className="size-4" />
                            Hint
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-sm">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm as any, remarkMath as any]}
                              rehypePlugins={[rehypeKatex as any]}
                            >
                              {quiz.questions[index].tip}
                            </ReactMarkdown>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        className="rounded-full"
                        onClick={() => {
                          if (index > 0) {
                            setIndex(index - 1)
                          }
                        }}
                        disabled={index === 0}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center justify-between text-xs text-muted-foreground"> {index + 1} / {quiz.questions.length}</span>
                      <Button
                        onClick={() => {
                          const last = index === quiz.questions.length - 1
                          if (last) {
                            setShowSummary(true)
                          } else {
                            setIndex(index + 1)
                          }
                        }}
                      >
                        {index === quiz.questions.length - 1 ? 'Done' : ((selections[index] ?? null) === null ? 'Skip' : 'Next')}
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
        </DialogContent>
        </Dialog>
  )
}