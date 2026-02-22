import { type ReactElement } from 'react'

import { useLocation } from '@/hooks/use-location'
import { useQuestions } from '@/hooks/use-questions'
import { isDefined } from '@/lib/is/is-defined'
import { Button } from '@/ui/button'

import type { MatchingType } from '../../game/types'

interface MatchingProps {
  title: string
  description?: string
  icon?: ReactElement
  type: MatchingType
}

const Matching = ({ title, icon, type }: MatchingProps): ReactElement => {
  const { askQuestion, hasQuestionBeenAsked } = useQuestions()

  const { location } = useLocation()

  const handleClick = () => {
    askQuestion({
      type: 'MATCHING',
      position: location,
      data: {
        type,
      },
    })
  }

  const isDisabled = hasQuestionBeenAsked({
    type: 'MATCHING',
    position: location,
    data: {
      type,
    },
  })

  return (
    <Button
      className="inline-flex size-20 items-center justify-center rounded-md bg-sky-700 active:bg-sky-800 px-3 py-2 text-lg font-medium text-white"
      disabled={isDisabled}
      onClick={handleClick}
    >
      {isDefined(icon) ? icon : title}
    </Button>
  )
}

export { Matching }
