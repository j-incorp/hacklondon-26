import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { CameraCapture } from '@/components/camera/camera-capture'
import type { PictureQuestion, PictureType } from '@/components/game/types'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog'

const pictureTitles: Record<PictureType, string> = {
  'five-buildings': 'Five Buildings',
  'tallest-building': 'Tallest Building',
  'train-station': 'Train Station',
  'body-of-water': 'Body of Water',
  sky: 'Sky',
  'street-sign': 'Street Sign',
  clock: 'Clock',
  'bus-route-number': 'Bus Route Number',
  'street-art': 'Street Art',
  church: 'Church',
  'strava-map': 'Strava Map',
  'monument-shadow': 'Monument Shadow',
}

interface PictureAlertProps {
  question?: PictureQuestion
  onCapture: (file: File) => void | Promise<void>
}

const PictureAlert = ({ question, onCapture }: PictureAlertProps): ReactElement => {
  const [dismissedKey, setDismissedKey] = useState('')

  const questionKey = useMemo(() => {
    if (!question) {
      return ''
    }
    return `PICTURE:${question.type}`
  }, [question])

  const open = Boolean(question) && dismissedKey !== questionKey

  const handleCapture = async (file: File) => {
    await onCapture(file)
    setDismissedKey(questionKey)
  }

  if (!question) {
    return <div />
  }

  const title = pictureTitles[question.type] ?? 'Picture'

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
          <AlertDialogTitle>Please take a picture of {title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <CameraCapture onCapture={handleCapture} className="w-full" />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { PictureAlert }
