import type { ReactNode } from 'react'

interface CardSelectionProps {
  children: ReactNode
}

const CardSelection = ({ children }: CardSelectionProps) => {
  return (
    <div className="w-full h-full">
      <div className="grid h-full w-full grid-flow-col auto-cols-fr items-center gap-4">{children}</div>
    </div>
  )
}

export { CardSelection }
