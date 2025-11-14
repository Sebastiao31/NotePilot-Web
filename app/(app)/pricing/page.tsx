import React from 'react'
import { PricingTable } from '@clerk/nextjs'


export default function PricingPage() {
    return (
        <main className="p-8 my-8 flex flex-col gap-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold">NotePilot Pro</h1>
                <p className="text-muted-foreground">Take the most out of NotePilot with all the features.</p>
            </div>
            <PricingTable />
        </main>
    )
}