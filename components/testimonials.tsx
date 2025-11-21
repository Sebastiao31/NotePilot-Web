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
            <div className="grid max-w-[1200px] mx-auto lg:grid-cols-2 md:grid-cols-1    gap-4   pt-20">
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
                        {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                            <Card className="bg-white shadow-none">
                                {index == 0 && (
                                    <CardContent className="flex w-full h-90 bg-white aspect-square items-center justify-center p-6">
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-black font-medium text-md">
                                        “Focusing during lectures has always been hard for me because of ADHD. NotePilot keeps everything organized and easy to follow. It really changed the way I study.”
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img src="uni-small-logos/Harvard.svg" alt="Harvard" className="w-16 h-16" />
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-black text-2xl">Harvard Student</h3>
                                                <p className="text-muted-foreground">May 2025</p>
                                            </div>

                                        </div>
                                    </div>
                                    </CardContent>
                                )}

                                {index == 1 && (
                                    <CardContent className="flex w-full h-90 aspect-square items-center justify-center p-6">
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-black font-medium text-md">
                                        “NotePilot turned my endless readings into short clear notes I can actually understand. It saves me so much time during exam season.”
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img src="uni-small-logos/Princeton.svg" alt="Princeton" className="w-16 h-16" />
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-black text-2xl">Princeton Student</h3>
                                                <p className="text-muted-foreground">November 2024</p>
                                            </div>

                                        </div>
                                    </div>
                                    </CardContent>
                                )}

                            {index == 2 && (
                                    <CardContent className="flex w-full h-90 aspect-square items-center justify-center p-6">
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-black font-medium text-md">
                                        “I use NotePilot to summarize long YouTube lectures and PDFs. It feels like having a smarter version of my own notes that gets straight to the point.”
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img src="uni-small-logos/Yale.svg" alt="Yale" className="w-16 h-16" />
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-black text-2xl">Yale Student</h3>
                                                <p className="text-muted-foreground">March 2025</p>
                                            </div>

                                        </div>
                                    </div>
                                    </CardContent>
                                )}

                                
                            {index == 3 && (
                                    <CardContent className="flex w-full h-90 aspect-square items-center justify-center p-6">
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-black font-medium text-md">
                                        “The AI chat is my favorite part. I can ask questions about my notes anytime and it explains things in a way that actually makes sense.”
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img src="uni-small-logos/Stanford.svg" alt="Stanford" className="w-16 h-16" />
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-black text-2xl">Stanford Student</h3>
                                                <p className="text-muted-foreground"> February 2025</p>
                                            </div>

                                        </div>
                                    </div>
                                    </CardContent>
                                )}

                                                                
                            {index == 4 && (
                                    <CardContent className="flex w-full h-90 aspect-square items-center justify-center p-6">
                                    <div className="flex flex-col justify-around h-full">
                                        <p className="text-black font-medium text-md">
                                        “NotePilot makes studying simple and fast. I upload my lecture files get clear summaries and even make flashcards to help me review.”
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <img src="uni-small-logos/Penn.svg" alt="Penn" className="w-16 h-16" />
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-black text-2xl">Penn Student</h3>
                                                <p className="text-muted-foreground"> January 2025</p>
                                            </div>

                                        </div>
                                    </div>
                                    </CardContent>
                                )}
                                
                                
                            </Card>

                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                    </Carousel>
                </div>

                <div className="pl-24 pt-18 pb-18 max-w-lg mx-auto bg-[url('/testimonials-bg-img.jpg')] bg-cover bg-center rounded-xl gap-6 flex flex-col justify-center overflow-hidden">
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