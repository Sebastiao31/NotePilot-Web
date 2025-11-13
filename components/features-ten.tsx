import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowUp, Globe, Play, Plus, Signature, Sparkles } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Calendar1, Ellipsis, Italic, Strikethrough, Underline } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconChevronDown } from '@tabler/icons-react'
import Image from 'next/image'

export default function FeaturesSection() {
    return (
        <section id="features" className="scroll-mt-24">
            <div className="py-24">
                <div className="mx-auto w-full max-w-[1200px] px-6 ">
                    <p className="text-muted-foreground text-balance text-center max-w-sm mx-auto mb-4">Features</p>
                    <h2 className="text-foreground text-balance text-3xl max-w-sm mx-auto text-center font-medium md:text-4xl mb-12">
                        <span className="">Everything you need in one place</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/features/Feature_1.svg" alt="Feature 1" width={358} height={239} />
                            <div className=" items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Create from any source</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Create notes from any study material. Youtube, websites, PDFs, etc.</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/features/Feature_2.svg" alt="Feature 2" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Talk to your notes</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">The built-in AI chat understands your notes context and helps you go deeper.</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/features/Feature_3.svg" alt="Feature 3" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Interactive study tools</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Generate quizzes and flashcards automatically to test yourself. asdasdasd</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/features/Feature_4.svg" alt="Feature 4" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Organize your workflow</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Create folders and keep your workflow organized. asdasddasda</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <Image src="/features/Feature_5.svg" alt="Feature 5" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Create mindmaps</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Visualize your notes in a mindmap to see the big picture. asdasdadasd</p>

                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-8">
                            <div className="items-center flex flex-col">
                            <Image src="/features/Feature_6.svg" alt="Feature 6" width={358} height={239} />
                            <div className="items-center flex flex-col mt-4">
                                <h3 className="text-foreground text-lg font-semibold">Share your notes</h3>
                                <p className="text-muted-foreground mt-1 text-balance text-center max-w-sm">Share your notes with your friends and family. saddadadadas sadada</p>

                            </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

