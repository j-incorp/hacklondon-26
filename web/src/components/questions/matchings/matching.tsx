import { type ReactElement } from 'react'

interface MatchingProps {
  text: string
}

const Matching = ({ text }: MatchingProps): ReactElement => {
  return (
    <div className="inline-flex size-24 items-center justify-center rounded-md bg-sky-700 px-3 py-2 text-lg font-medium text-white">
      {text}
    </div>
  )
}

export { Matching }
