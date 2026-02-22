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

import type { Curse } from '../cards/types'

interface CurseAlertProps {
  curse?: Curse
}

const CurseAlert = ({ curse }: CurseAlertProps): ReactElement => {
  const [dismissedKey, setDismissedKey] = useState('')

  const curseKey = useMemo(() => {
    if (!curse) {
      return ''
    }

    return `${curse.curseType}:${curse.title}`
  }, [curse])

  const open = Boolean(curse) && dismissedKey !== curseKey

  if (!curse) {
    return <div />
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setDismissedKey(curseKey)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You have been cursed with {curse.title}, check the guide if you are unsure about this curse.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              setDismissedKey(curseKey)
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { CurseAlert }
