import { CopyPlus } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/ui/button'

const Duplicate = (): ReactElement => {
  return (
    <Button
      className="flex flex-col w-24 h-40 items-center justify-center rounded-md border-2 border-mauve-700 bg-transparent text-mauve-700 px-3 py-2 text-sm font-medium hover:bg-mauve-700/10"
      onClick={() => {
        void 1
      }}
    >
      <CopyPlus className="size-6" />
      Duplicate
    </Button>
  )
}

export { Duplicate }
