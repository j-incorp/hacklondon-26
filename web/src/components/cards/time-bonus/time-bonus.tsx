import { Clock1 } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/ui/button'

import type { TimeBonus as TimeBonusType } from '../types'

interface TimeBonusProps {
  card: TimeBonusType
}

const TimeBonus = ({ card }: TimeBonusProps): ReactElement => {
  return (
    <Button
      className="flex flex-col w-24 h-40 items-center justify-center rounded-md border-2 border-blue-700 bg-transparent text-blue-700 px-3 py-2 text-sm font-medium hover:bg-blue-700/10"
      onClick={() => {
        void 1
      }}
    >
      <Clock1 className="size-6" />
      {card.amount} min
    </Button>
  )
}

export { TimeBonus }
