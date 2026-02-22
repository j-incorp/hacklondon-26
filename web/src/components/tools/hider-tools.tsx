import { Book, WalletCards } from 'lucide-react'
import type { ReactElement, TouchEvent } from 'react'
import { useRef, useState } from 'react'

import { useHand } from '@/hooks/use-hand'
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

import { Card } from '../cards/card'
import { CardSelection } from '../cards/card-selection'

const CARDS_PER_PAGE = 3

const HiderTools = (): ReactElement => {
  const { getCards } = useHand()

  const cards = getCards()

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE)

  const [activePage, setActivePage] = useState(0)
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
      setActivePage((page) => {
        const nextPage = Math.min(page + 1, totalPages - 1)
        if (nextPage !== page) {
          setDirection('next')
        }
        return nextPage
      })
    } else {
      setActivePage((page) => {
        const prevPage = Math.max(page - 1, 0)
        if (prevPage !== page) {
          setDirection('prev')
        }
        return prevPage
      })
    }

    touch.current = null
  }

  const startIndex = activePage * CARDS_PER_PAGE

  const visibleCards = cards.slice(startIndex, startIndex + CARDS_PER_PAGE)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-primary text-white hover:bg-orange-600 focus-visible:ring-orange-400"
        >
          <Book className="size-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[70dvh] flex flex-col" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <DrawerHeader className="mb-4">
          <DrawerTitle className="inline-flex items-center justify-center gap-2 mb-2">
            <WalletCards className="size-5" />
            Deck
          </DrawerTitle>
          <DrawerDescription>
            Use these cards to claim more time or slow the seekers down! Click on a card to get more information and use
            it.
          </DrawerDescription>
        </DrawerHeader>
        <div
          key={activePage}
          className={`h-[60%] flex flex-col items-center justify-center animate-in fade-in duration-300 ${
            direction === 'next' ? 'slide-in-from-right-6' : 'slide-in-from-left-6'
          }`}
        >
          <div className="px-4 h-full w-full">
            <CardSelection>
              {isNonEmptyArray(visibleCards)
                ? visibleCards.map((card, index) => (
                    <div key={`card-${startIndex + index}`}>
                      <Card card={card} />
                    </div>
                  ))
                : undefined}
            </CardSelection>
          </div>
        </div>
        <DrawerFooter className="h-auto">
          <div className="flex items-center justify-center gap-2" aria-label="Question progress">
            {isNonEmptyArray(cards) &&
              Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={`page-dot-${index}`}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === activePage ? 'bg-primary' : 'bg-muted-foreground/40'
                  }`}
                  aria-hidden="true"
                />
              ))}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export { HiderTools }
