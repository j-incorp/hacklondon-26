import { type ReactElement } from 'react'

import { defaultLocation } from '@/components/types'
import { useQuestions } from '@/hooks/use-questions'
import { isDefined } from '@/lib/is/is-defined'
import { Button } from '@/ui/button'

import type { PictureType } from './types'

interface PictureProps {
  title: string
  description?: string
  icon?: ReactElement
  type: PictureType
}

const Picture = ({ title, icon, type }: PictureProps): ReactElement => {
  const { askQuestion, hasQuestionBeenAsked } = useQuestions()

  const handleClick = () => {
    askQuestion({
      type: 'picture',
      data: {
        position: {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
        },
        pictureType: type,
      },
    })
  }

  const isDisabled = hasQuestionBeenAsked({
    type: 'picture',
    data: {
      position: defaultLocation,
      pictureType: type,
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
