import { type ReactElement } from 'react'

import { isDefined } from '@/lib/is/is-defined'

interface MatchingProps {
  title: string
  description?: string
  icon?: ReactElement
}

const Matching = ({ title, icon }: MatchingProps): ReactElement => {
  return (
    <div className="inline-flex size-20 items-center justify-center rounded-md bg-sky-700 active:bg-sky-800 px-3 py-2 text-lg font-medium text-white">
      {isDefined(icon) ? icon : title}
    </div>
  )
}

export { Matching }
