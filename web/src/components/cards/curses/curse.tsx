import { Ghost } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/ui/button'

import type { Curse as CurseType } from '../types'

interface CurseProps {
  card: CurseType
}

const Curse = ({ card }: CurseProps): ReactElement => {
  return (
    <Button
      className="flex flex-col w-24 h-40 items-center justify-center rounded-md border-2 border-blue-700 bg-transparent text-blue-700 px-3 py-2 text-sm font-medium hover:bg-blue-700/10 wrap-break-word whitespace-normal"
      onClick={() => {
        void 1
      }}
    >
      <Ghost className="size-6" />
      {card.title}
    </Button>
  )
}

export { Curse }
