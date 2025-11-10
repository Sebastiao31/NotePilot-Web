import React from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { IconLoader2 } from "@tabler/icons-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

type Flashcard = { front: string; back: string }
type FlashcardsPayload = { cards: Flashcard[]; source: "summary" | "transcript" }

export function FlashcardsDialog({
	open,
	onOpenChange,
	loading,
	cards,
	error,
	onRegenerate,
}: {
	open?: boolean
	onOpenChange?: (open: boolean) => void
	loading?: boolean
	cards?: FlashcardsPayload | null
	error?: string | null
	onRegenerate?: () => void
}) {
	const [index, setIndex] = React.useState(0)
	const [showBack, setShowBack] = React.useState(false)

	React.useEffect(() => {
		setIndex(0)
		setShowBack(false)
	}, [cards, open])

	const controlledProps = open === undefined ? {} : {
		open,
		onOpenChange: (next: boolean) => {
			if (loading && open && !next) return
			onOpenChange?.(next)
		}
	}

	const hasCards = !!cards && Array.isArray(cards.cards) && cards.cards.length > 0
	const total = hasCards ? cards!.cards.length : 0

	return (
		<Dialog {...controlledProps}>
			<DialogContent
				onEscapeKeyDown={(e) => { if (loading) e.preventDefault() }}
				onPointerDownOutside={(e) => { if (loading) e.preventDefault() }}
				showCloseButton={!loading}
			>
				<DialogHeader>
					<DialogTitle>Flashcards</DialogTitle>
					{loading ? (
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconLoader2 className="size-4 animate-spin" />
							<span className="animate-pulse">Generating flashcards. This may take a few seconds.</span>
						</div>
					) : null}
				</DialogHeader>

				{!loading && error ? (
					<div className="space-y-4 pt-4">
						<div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
							{error}
						</div>
						<div className="flex items-center justify-end gap-2">
							<Button variant="ghost" onClick={() => onOpenChange?.(false)}>Close</Button>
							<Button onClick={() => onRegenerate?.()}>Try again</Button>
						</div>
					</div>
				) : null}

				{!loading && !error && hasCards ? (
					<div className="space-y-4 pt-2">
						{(() => {
							const themes = [
								{ border: "border-badge-red", bg: "bg-badge-red-foreground", text: "text-badge-red" },
								{ border: "border-badge-purple", bg: "bg-badge-purple-foreground", text: "text-badge-purple" },
								{ border: "border-badge-blue", bg: "bg-badge-blue-foreground", text: "text-badge-blue" },
								{ border: "border-badge-green", bg: "bg-badge-green-foreground", text: "text-badge-green" },
							]
							const theme = themes[index % themes.length]
							return (
								<div
									className={`rounded-2xl border min-h-[200px] p-8 flex items-center justify-center text-center cursor-pointer ${theme.bg} ${theme.border} ${theme.text} transition-colors`}
									onClick={() => setShowBack((v) => !v)}
									role="button"
									aria-pressed={showBack}
									title="Click to flip"
								>
									<div className="text-base leading-7 text-center max-w-[680px]">
										<ReactMarkdown
											remarkPlugins={[remarkGfm as any, remarkMath as any]}
											rehypePlugins={[rehypeKatex as any]}
											components={{
												h1: (props) => <h3 className="text-base font-semibold mb-2" {...props} />,
												h2: (props) => <h4 className="text-sm font-semibold mt-4" {...props} />,
												h3: (props) => <h5 className="text-sm font-semibold mt-3" {...props} />,
												p: (props) => <p className="mb-2" {...props} />,
												ul: (props) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
												ol: (props) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
												li: (props) => <li className="leading-7" {...props} />,
												a: (props) => <a className="underline underline-offset-2 hover:opacity-90" target="_blank" rel="noreferrer" {...props} />,
												hr: () => <hr className="my-3 border-t " />,
												code(props) {
													const { inline, className, children, ...rest } = props as any
													if (inline) {
														return (
															<code className={`bg-muted/20 px-1 py-0.5 rounded ${className || ""}`} {...rest}>
																{children}
															</code>
														)
													}
													return (
														<pre className="bg-muted/20 p-3 rounded-md overflow-x-auto">
															<code className={className} {...rest}>{children}</code>
														</pre>
													)
												},
											}}
										>
											{showBack ? cards!.cards[index].back : cards!.cards[index].front}
										</ReactMarkdown>
									</div>
								</div>
							)
						})()}
						<div className="flex items-center justify-between">
							<Button
								variant="ghost"
								className="rounded-full"
								onClick={() => {
									if (index > 0) {
										setIndex(index - 1)
										setShowBack(false)
									}
								}}
								disabled={index === 0}
							>
								Previous
							</Button>
							<span className="text-xs text-muted-foreground">{index + 1} / {total}</span>
							<Button
								onClick={() => {
									const last = index === total - 1
									if (last) {
										onOpenChange?.(false)
										return
									}
									setIndex(index + 1)
									setShowBack(false)
								}}
							>
								{index === total - 1 ? "Done" : "Next"}
							</Button>
						</div>
					</div>
				) : null}
			</DialogContent>
		</Dialog>
	)
}