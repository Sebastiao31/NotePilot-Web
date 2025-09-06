"use client"

import React from 'react'
import { useFolders } from '@/hooks/use-folders'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const colorToAsset: Record<string, string> = {
  "#000000": "/folders/BlackFolder.svg",
  "#A2A2A2": "/folders/GrayFolder.svg",
  "#1B6CFF": "/folders/BlueFolder.svg",
  "#10A37F": "/folders/TurquoiseFolder.svg",
  "#18C964": "/folders/GreenFolder.svg",
  "#1F4B5C": "/folders/DarkBlueFolder.svg",
  "#8A4DFF": "/folders/PurpleFolder.svg",
  "#FF7AB6": "/folders/PinkFolder.svg",
  "#FF3344": "/folders/RedFolder.svg",
  "#FF6A49": "/folders/OrangeFolder.svg",
  "#F2BE4A": "/folders/YellowFolder.svg",
  "#875539": "/folders/BrownFolder.svg",
}

const FoldersList = () => {
  const { folders, loading } = useFolders()

  if (loading) return null
  if (!folders.length) return null

  return (
    <Carousel className="w-full" opts={{ align: "start", dragFree: true }}>
      <CarouselContent>
        {folders.map((f) => (
          <CarouselItem
            key={f.id}
            className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8"
          >
            <Link
              href={`/all-notes/folders/${f.id}`}
              className="group flex flex-col items-center gap-2 rounded-xl p-2 sm:p-3 md:p-4 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <img
                src={colorToAsset[f.color] ?? "/folders/GrayFolder.svg"}
                alt="folder"
                className="h-16 w-16 sm:h-20 sm:w-20 transition-transform group-hover:scale-[1.02]"
              />
              <div className="flex flex-col items-center leading-tight">
                <div className="text-sm sm:text-base font-medium text-foreground">
                  {f.name || 'Folder'}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {(f as any).notesCount ?? 0} Notes
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default FoldersList