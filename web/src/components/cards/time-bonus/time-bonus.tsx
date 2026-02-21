import type { ReactElement } from 'react'

import { Card } from '../card'

interface TimeBonusProps {
  amount: number
}

const TimeBonus = ({ amount }: TimeBonusProps): ReactElement => {
  return <Card cardType="time-bonus">{amount}</Card>
}

export { TimeBonus }
