import { SkipForward } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/ui/button'

import type { Veto } from '../types'

const Veto = (): ReactElement => {
  return (
    <Button
      className="flex flex-col w-24 h-40 items-center justify-center rounded-md border-2 border-rose-700 bg-transparent text-rose-700 px-3 py-2 text-sm font-medium hover:bg-rose-700/10"
      onClick={() => {
        void 1
      }}
    >
      <SkipForward className="size-6" />
      Veto
    </Button>
  )
}

export { Veto }
