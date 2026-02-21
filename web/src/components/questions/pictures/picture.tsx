import { type ReactElement } from 'react'

interface PictureProps {
  text: string
}

const Picture = ({ text }: PictureProps): ReactElement => {
  return (
    <div className="inline-flex size-24 items-center justify-center rounded-md bg-rose-700 px-3 py-2 text-lg font-medium text-white">
      {text}
    </div>
  )
}

export { Picture }
