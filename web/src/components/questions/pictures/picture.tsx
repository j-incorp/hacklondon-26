import { type ReactElement } from 'react'

import { useLocation } from '@/hooks/use-location'
import { useQuestions } from '@/hooks/use-questions'
import { isDefined } from '@/lib/is/is-defined'
import { Button } from '@/ui/button'

import type { PictureType } from '../../game/types'

interface PictureProps {
  title: string
  description?: string
  icon?: ReactElement
  type: PictureType
}

const Picture = ({ title, icon, type }: PictureProps): ReactElement => {
  const { askQuestion, hasQuestionBeenAsked } = useQuestions()
  const { location } = useLocation()

  const handleClick = () => {
    askQuestion({
      type: 'PICTURE',
      position: location,
      data: {
        type,
      },
    })
  }

  const isDisabled = hasQuestionBeenAsked({
    type: 'PICTURE',
    position: location,
    data: {
      type,
    },
  })

  return (
    <Button
      className="inline-flex size-20 items-center justify-center rounded-md bg-rose-700 active:bg-rose-800 px-3 py-2 text-lg font-medium text-white"
      disabled={isDisabled}
      onClick={handleClick}
    >
      {isDefined(icon) ? icon : title}
    </Button>
  )
}

export { Picture }
