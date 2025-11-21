import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUp, Globe, Play, Plus, Signature, Sparkles } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Calendar1, Ellipsis, Italic, Strikethrough, Underline } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconChevronDown } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="scroll-mt-24">
            <div className="py-24">
                <div className="mx-auto w-full max-w-[1200px] px-6 ">
                    <p className="text-muted-foreground text-balance text-center max-w-sm mx-auto mb-4">How it works</p>
                    <h2 className="text-foreground text-balance text-3xl max-w-lg mx-auto text-center font-medium md:text-4xl mb-12">
                        <span className="">We like to keep it simple. Transcribe, summarize, learn.</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/HIW/HIW_1.svg" alt="Feature 1" width={358} height={239} />
                            <div className=" items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Transcribe</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Record or upload. NotePilot will trancribe the content of the choosen source.</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/HIW/HIW_2.svg" alt="Feature 2" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Summarize</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Our AI condenses content into  a clear, readable summary in seconds.</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/HIW/HIW_3.svg" alt="Feature 3" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Learn</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Review, study, practice, chat with your note and actually learn faster.</p>

                            </div>
                        </div>



                        

                    </div>

                    <div className="flex justify-center mt-16">
                        <Button className="rounded-full text-base" size="lg">
                            <Link href="/notes">
                                Try NotePilot for FREE
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

