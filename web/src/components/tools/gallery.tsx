import { Images } from 'lucide-react'
import type { ReactElement, TouchEvent } from 'react'
import { useRef, useState } from 'react'

import { useQuestions } from '@/hooks/use-questions'
import { isNonEmptyArray } from '@/lib/is/is-non-empty-array'
import { Button } from '@/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/ui/drawer'

import type { PictureResponse } from '../game/types'

const Gallery = (): ReactElement => {
  const { getResponses } = useQuestions()

  const responses = getResponses()

  const images = responses
    .filter((response) => response.type === 'PICTURE')
    .map((response) => response.data as PictureResponse)

  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const touch = useRef<number | null>(null)

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touch.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touch.current === null) {
      return
    }

    const endX = event.changedTouches[0]?.clientX ?? touch.current
    const deltaX = endX - touch.current
    const swipeThreshold = 40

    if (Math.abs(deltaX) < swipeThreshold) {
      touch.current = null

      return
    }

    if (deltaX < 0) {
      setActiveIndex((index) => {
        const nextIndex = Math.min(index + 1, images.length - 1)
        if (nextIndex !== index) {
          setDirection('next')
        }
        return nextIndex
      })
    } else {
      setActiveIndex((index) => {
        const prevIndex = Math.max(index - 1, 0)
        if (prevIndex !== index) {
          setDirection('prev')
        }
        return prevIndex
      })
    }

    touch.current = null
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-primary text-white hover:bg-orange-600 focus-visible:ring-orange-400"
        >
          <Images className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70dvh] flex flex-col" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <DrawerHeader className="mb-4">
          <DrawerTitle className="inline-flex items-center justify-center gap-2 mb-2">
            <Images className="size-5" />
            Gallery
          </DrawerTitle>
          <DrawerDescription>Swipe to browse photos taken during the game.</DrawerDescription>
        </DrawerHeader>
        <div
          key={activeIndex}
          className={`flex-1 overflow-hidden flex items-center justify-center px-4 animate-in fade-in duration-300 ${
            direction === 'next' ? 'slide-in-from-right-6' : 'slide-in-from-left-6'
          }`}
        >
          {isNonEmptyArray(images) ? (
            <img
              src={images[activeIndex]?.pictureUrl}
              alt={`Photo ${activeIndex + 1} of ${images.length}`}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          ) : (
            <p className="text-muted-foreground">No photos yet.</p>
          )}
        </div>
        <DrawerFooter className="h-auto">
          {isNonEmptyArray(images) && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-2" aria-label="Gallery progress">
                {images.map((_, index) => (
                  <span
                    key={`gallery-dot-${index}`}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === activeIndex ? 'bg-primary' : 'bg-muted-foreground/40'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export { Gallery }
