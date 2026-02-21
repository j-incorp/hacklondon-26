import { type ReactNode } from 'react'

interface QuestionSelectionProps {
  children: ReactNode
}

const QuestionSelection = ({ children }: QuestionSelectionProps) => {
  return <div className="grid grid-cols-3 place-items-center gap-2">{children}</div>
}

export { QuestionSelection }
