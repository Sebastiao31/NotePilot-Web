import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function StatsSection() {
    return (
        <section>
            <div className="py-12">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">Study better. Learn faster.</h2>
                        </div>
                        <div className="flex justify-end gap-3">
                            
                            <Button
                                asChild
                                className="rounded-full px-5 text-base"
                                size="lg">
                                <Link href="notes">Start Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
