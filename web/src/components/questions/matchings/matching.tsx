import { type ReactElement } from 'react'

import { defaultLocation } from '@/components/types'
import { useLocation } from '@/hooks/use-location'
import { useQuestions } from '@/hooks/use-questions'
import { isDefined } from '@/lib/is/is-defined'
import { Button } from '@/ui/button'

import type { MatchingType } from './types'

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
      type: 'matching',
      data: {
        position: location ?? defaultLocation,
        matchingType: type,
      },
    })
  }

  const isDisabled = hasQuestionBeenAsked({
    type: 'matching',
    data: {
      position: location ?? defaultLocation,
      matchingType: type,
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
