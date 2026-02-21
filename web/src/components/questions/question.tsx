import type { ReactElement, TouchEvent } from 'react'
import { useMemo, useRef, useState } from 'react'

import { Matchings } from './matchings/matchings'
import { Pictures } from './pictures/pictures'
import { Radars } from './radars/radars'

const Questions = (): ReactElement => {
  const questions = useMemo(
    () => [
      <Matchings className="h-100" key="matchings" />,
      <Radars className="h-100" key="radars" />,
      <Pictures className="h-100" key="pictures" />,
    ],
    [],
  )

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
        const nextIndex = Math.min(index + 1, questions.length - 1)

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
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div
        key={activeIndex}
        className={`flex-1 animate-in fade-in duration-300 ${
          direction === 'next' ? 'slide-in-from-right-6' : 'slide-in-from-left-6'
        }`}
      >
        {questions[activeIndex]}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2" aria-label="Question progress">
        {questions.map((_, index) => (
          <span
            key={`question-dot-${index}`}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary' : 'bg-muted-foreground/40'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

export { Questions }
