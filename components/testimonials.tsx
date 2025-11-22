"use client"
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

const TESTIMONIALS = [
    {
        quote:
            '“Focusing during lectures has always been hard for me because of ADHD. NotePilot keeps everything organized and easy to follow. It really changed the way I study.”',
        school: 'Harvard Student',
        date: 'May 2025',
        logo: 'uni-small-logos/Harvard.svg',
        logoAlt: 'Harvard',
    },
    {
        quote:
            '“NotePilot turned my endless readings into short clear notes I can actually understand. It saves me so much time during exam season.”',
        school: 'Princeton Student',
        date: 'November 2024',
        logo: 'uni-small-logos/Princeton.svg',
        logoAlt: 'Princeton',
    },
    {
        quote:
            '“I use NotePilot to summarize long YouTube lectures and PDFs. It feels like having a smarter version of my own notes that gets straight to the point.”',
        school: 'Yale Student',
        date: 'March 2025',
        logo: 'uni-small-logos/Yale.svg',
        logoAlt: 'Yale',
    },
    {
        quote:
            '“The AI chat is my favorite part. I can ask questions about my notes anytime and it explains things in a way that actually makes sense.”',
        school: 'Stanford Student',
        date: ' February 2025',
        logo: 'uni-small-logos/Stanford.svg',
        logoAlt: 'Stanford',
    },
    {
        quote:
            '“NotePilot makes studying simple and fast. I upload my lecture files get clear summaries and even make flashcards to help me review.”',
        school: 'Penn Student',
        date: ' January 2025',
        logo: 'uni-small-logos/Penn.svg',
        logoAlt: 'Penn',
    },
]

const Testimonials = () => {

    
    return (
        <section id="testimonials" className="scroll-mt-24">
        <div className='py-24'>
            <div className='mx-auto w-full max-w-[1200px] px-6 '>
                <p className="text-muted-foreground text-balance text-center max-w-sm mx-auto mb-4">Testimonials</p>
                    <h2 className="text-foreground text-balance text-3xl max-w-lg mx-auto text-center font-medium md:text-4xl mb-8">
                        <span className="">Join +100K happy students.</span>
                    </h2>
            </div>
            <div className="md:grid max-w-[1200px] mx-auto gap-6 pt-12 px-4 lg:grid-cols-2">
                <div className="p-4  items-center justify-center rounded-xl gap-6 flex flex-col">
                    <Carousel className="w-full max-w-lg "
                    plugins={[
                        Autoplay({
                          delay: 4000,
                        }),
                      ]}
                      opts={{
                        loop: true,
                      }}>
                    <CarouselContent>
                        {TESTIMONIALS.map((t, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                            <Card className="bg-white shadow-none">
                                <CardContent className="flex w-full items-center justify-center p-4 h-auto aspect-auto md:aspect-square md:h-90 md:p-6">
                                <div className="flex flex-col gap-4 md:justify-around md:h-full">
                                    <p className="text-black font-medium text-base md:text-lg">
                                        {t.quote}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <img src={t.logo} alt={t.logoAlt} className="w-12 h-12 md:w-16 md:h-16" />
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-black text-xl md:text-2xl">{t.school}</h3>
                                            <p className="text-muted-foreground">{t.date}</p>
                                        </div>

                                    </div>
                                </div>
                                </CardContent>
                                
                                
                            </Card>

                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>

                <div className="hidden md:flex pl-24 pt-18 pb-18 max-w-lg mx-auto bg-[url('/Testimonials-bg-img.jpg')] bg-cover bg-center rounded-xl gap-6 flex flex-col justify-center overflow-hidden">
                    <div className="pt-2 pl-2 pb-2 rounded-tl-xl rounded-bl-xl  bg-action/20 hover:scale-105 transition-all duration-300">
                    <Image src="/Testimonials-img.png" alt="Testimonials-img" className="w-full rounded-tl-lg rounded-bl-lg" width={500} height={500} />
                    </div>
                </div>

                

            </div>

        </div>
    </section>
    )
}

export default Testimonials