'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'What is NotePilot?',
            answer: 'NotePilot is an AI summary generator that creates concise, editable notes from YouTube videos, websites, PDFs, audio recordings, pasted text, and futurally more sources.',
        },
        {
            id: 'item-2',
            question: 'Can I edit the generated summaries?',
            answer: 'Absolutely. Every summary is editable, your free to amke the changes that you want, add lists, tables, math expressions, etc.',
        },
        {
            id: 'item-3',
            question: 'How accurate are the summaries?',
            answer: 'NotePilot uses latest AI models in the world that understand context and structure. Summaries are highly accurate and optimized for clarity. We constantly test and evaluate new models to ensure highest quality generations.',
        },
        {
            id: 'item-4',
            question: 'Are my notes private?',
            answer: '100%. Your are the only one who can access your notes.',
        },
        {
            id: 'item-5',
            question: 'Is NotePilot ok to use at my school?',
            answer: 'Yes. NotePilot IS NOT a cheating tool, it\'s a tool to help you learn, capture key details and practice what you\'ve learned.',
        },
        {
            id: 'item-6',
            question: 'Does it work on mobile?',
            answer: 'Yes, you can use NotePilot on mobile, but we suggest desktop for the best expreience. Launching mobile app very soon!',
        },
    ]

    return (
        <section id="faqs" className="py-16 md:py-24 scroll-mt-24">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-foreground text-4xl font-semibold">FAQs</h2>
                        <p className="text-muted-foreground mt-4 text-balance text-lg">Your questions answered</p>
                        
                    </div>

                    <div className="md:col-span-3">
                        <Accordion
                            type="single"
                            collapsible>
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}>
                                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <p className="text-muted-foreground mt-6 md:hidden">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
