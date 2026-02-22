import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog'

import type { QuestionResponse } from '../game/types'

interface QuestionAlertProps {
  question?: QuestionResponse
}

const getQuestionTitle = (question: QuestionResponse) => {
  if (question.type === 'RADAR') {
    const radius = question.data && 'radius' in question.data ? question.data.radius : undefined
    const hit = question.data && 'hit' in question.data ? question.data.hit : undefined

    return radius !== undefined ? `You have been ${hit ? 'hit' : 'missed'} by a ${radius}km radar` : 'Radar'
  }

  if (question.type === 'MATCHING') {
    const matchingType = question.data && 'type' in question.data ? question.data.type : undefined
    const hit = question.data && 'hit' in question.data ? question.data.hit : undefined

    return matchingType !== undefined
      ? `You have been ${hit ? 'hit' : 'missed'} by a ${matchingType === 'london-borough' ? 'London borough' : 'tube line'} match`
      : 'Matching'
  }

  return 'Question'
}

const QuestionAlert = ({ question }: QuestionAlertProps): ReactElement => {
  const [dismissedKey, setDismissedKey] = useState('')

  const questionKey = useMemo(() => {
    if (!question) {
      return ''
    }

    return `${question.type}:${JSON.stringify(question.data ?? {})}`
  }, [question])

  const open = Boolean(question) && dismissedKey !== questionKey

  if (!question) {
    return <div />
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setDismissedKey(questionKey)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getQuestionTitle(question)}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setDismissedKey(questionKey)
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { QuestionAlert }
