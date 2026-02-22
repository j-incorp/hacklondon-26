import { type ReactElement } from 'react'

import { defaultPosition } from '@/components/types'
import { useLocation } from '@/hooks/use-location'
import { useQuestions } from '@/hooks/use-questions'
import { Button } from '@/ui/button'

interface RadarProps {
  size: number
}

const Radar = ({ size }: RadarProps): ReactElement => {
  const { askQuestion, hasQuestionBeenAsked } = useQuestions()
  const { location } = useLocation()

  const handleClick = () => {
    if (!location) {
      return
    }

    askQuestion({
      type: 'RADAR',
      position: location ?? defaultPosition,
      data: {
        radius: size * 1000,
      },
    })
  }

  const isDisabled =
    !location ||
    hasQuestionBeenAsked({
      type: 'RADAR',
      position: location ?? defaultPosition,
      data: {
        radius: size * 1000,
      },
    })

  return (
    <Button
      className="inline-flex size-20 rounded-sm items-center justify-center bg-orange-500 active:bg-orange-600 text-lg font-medium text-white"
      disabled={isDisabled}
      onClick={handleClick}
    >
      {size} km
    </Button>
  )
}

export { Radar }
