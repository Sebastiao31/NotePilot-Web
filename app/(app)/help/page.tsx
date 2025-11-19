import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function HelpPage() {

    const faqItems = [
        {
            id: 'faq-1',
            question: 'Is my language supported?',
            answer: 'Most likely! NotePilot supports +100 languages.',
        },
        {
            id: 'faq-2',
            question: 'My audio upload isn\'t working?',
            answer: 'First we\'re genuinely sorry about that. Currently NotePilot supports almost any audifo format, however it doesn\'t work very well with .wav files, we are working on it and will have it fixed soon. Try converting your .wav file to .mp3 or .m4a format and see if that works.',
        },
        {
            id: 'faq-3',
            question: 'My transcript was cut short?',
            answer: 'We apologize for the inconvenience and are working to make this process smoother and more reliable. First, please check if the the source is actually complete, if it is, unfrotunately there is nothing we can do about it. We apologize and understand how frustrating this can be.',
        },
        
    ]

    const subscriptionsItems = [
        {
            id: 'subscriptions-1',
            question: 'How do I cancel my subscription?',
            answer: 'You can cancel your subscription at any time by going to "Manage Account" -> "Billing" -> "Manage" and then just click the button to cancel your subscription.',
        },
        {
            id: 'subscriptions-2',
            question: 'What plans are available?',
            answer: 'You can susbcribe to NotePilot Pro yearly or monthly. The yearly plan is cheaper and you save 45% compared to the monthly plan.',
        },
        {
            id: 'subscriptions-3',
            question: 'How do I change my payment method?',
            answer: 'You can change your payment method at any time by going to "Manage Account" -> "Billing" -> "Add new payment method" and then just click the button to change your payment method.',
        },
        {
            id: 'subscriptions-4',
            question: 'Cancel free trial?',
            answer: 'You can cancel your free trial at any time by going to "Manage Account" -> "Billing" -> "Manage" and then just click the button to cancel your free trial.',
        },
        
    ]
    return (
        <main className="p-8 my-8 flex flex-col gap-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold">Help Center</h1>
                <p className="text-muted-foreground">Search our help center for answers to your questions.</p>
            </div>

            <div className="space-y-4">
                <Label className="text-lg font-medium">Notes generation</Label>
			<Accordion type="single" collapsible>
				{faqItems.map((item) => (
					<AccordionItem key={item.id} value={item.id} className="bg-accent px-4 rounded-md border-none mb-2">
						<AccordionTrigger>{item.question}</AccordionTrigger>
						<AccordionContent>
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

            
            </div>

            <div className="space-y-4">
                <Label className="text-lg font-medium">Subscriptions & payments</Label>
			<Accordion type="single" collapsible>
				{subscriptionsItems.map((item) => (
					<AccordionItem key={item.id} value={item.id} className="bg-accent px-4 rounded-md border-none mb-2">
						<AccordionTrigger>{item.question}</AccordionTrigger>
						<AccordionContent>
							{item.answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

            
            </div>

            <div>
                <h2 className="text-lg font-medium">Contact us</h2>
                <p className="text-muted-foreground text-sm">NotePilot was a tool made for you. Help us improve it.</p>
                <div className="my-4">
                <Textarea
                    placeholder="Enter your message here"
                    className="w-full"
                />
                </div>
                <Button>
                    <Mail className="size-4" />
                    <span>Contact us</span>
                </Button>
            </div>
        </main>
    )
}