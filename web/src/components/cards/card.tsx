import type { ReactElement } from 'react'

import { Curse } from './curses/curse'
import { Duplicate } from './duplicate/duplicate'
import { TimeBonus } from './time-bonus/time-bonus'
import type { Card } from './types'
import { Veto } from './veto/veto'

interface CardProps {
  card: Card
}

const Card = ({ card }: CardProps): ReactElement => {
  if (card.type === 'veto') {
    return <Veto />
  }

  if (card.type === 'time-bonus') {
    return <TimeBonus card={card} />
  }

  if (card.type === 'curse') {
    return <Curse card={card} />
  }

  if (card.type === 'duplicate') {
    return <Duplicate />
  }

  return <div></div>
}

export { Card }
