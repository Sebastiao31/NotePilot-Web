import React from 'react'
import { PricingTable } from '@clerk/nextjs'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"


export default function PricingPage() {
    return (
        <main className="p-8 my-8 flex flex-col gap-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold">NotePilot Pro</h1>
                <p className="text-muted-foreground">Take the most out of NotePilot with all the features.</p>
            </div>
            <PricingTable />

            <div className="flex items-center gap-2 justify-center">
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-3 ">
                    <Avatar className='size-7'>
                    <AvatarImage src="/people/man_1.jpg" alt="John Doe" />
                    </Avatar>
                    <Avatar className='size-7'>
                    <AvatarImage
                        src="/people/man_2.jpg"
                        alt="Jane Doe"
                    />
                    </Avatar>
                    <Avatar className='size-7'>
                    <AvatarImage
                        src="/people/man_3.jpg"
                        alt="Jim Doe"
                    />
                    </Avatar>
                </div>
            <div>
                <p className="text-muted-foreground">Join +100k Students</p>
            </div>
            </div>
        </main>
    )
}