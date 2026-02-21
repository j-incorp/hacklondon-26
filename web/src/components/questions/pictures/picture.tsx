import { type ReactElement } from 'react'

import { isDefined } from '@/lib/is/is-defined'

interface PictureProps {
  title: string
  description?: string
  icon?: ReactElement
}

const Picture = ({ title, icon }: PictureProps): ReactElement => {
  return (
    <div className="inline-flex size-20 items-center justify-center rounded-md bg-rose-700 active:bg-rose-800 px-3 py-2 text-lg font-medium text-white">
      {isDefined(icon) ? icon : title}
    </div>
  )
}

export { Picture }
