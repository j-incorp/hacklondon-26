import type { ReactNode } from 'react'

interface CardSelectionProps {
  children: ReactNode
}

const CardSelection = ({ children }: CardSelectionProps) => {
  return (
    <div className="w-full">
      <div className="grid w-full grid-flow-col auto-cols-fr items-start gap-4">{children}</div>
    </div>
  )
}

export { CardSelection }
