import type { ReactElement, ReactNode } from 'react'

import type { CardType } from './types'

interface CardProps {
  cardType: CardType
  children?: ReactNode
}

const Card = (props: CardProps): ReactElement => {
  return (
    <div>
      {props.cardType}
      {props.children}
    </div>
  )
}

export { Card }
