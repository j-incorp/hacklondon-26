import { RadarIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { QuestionSelection } from '../question-selection'
import { Radar } from './radar'

interface RadarsProps {
  className?: string
}

const Radars = ({ className }: RadarsProps): ReactElement => {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-3 mb-4">
        <RadarIcon className="size-12 text-orange-500" />
        <div>
          <h3>Radars</h3>
          <p>Draw 2, pick 1</p>
        </div>
      </div>
      <QuestionSelection>
        <Radar size={0.25} />
        <Radar size={0.5} />
        <Radar size={1} />
        <Radar size={2} />
        <Radar size={5} />
        <Radar size={8} />
        <Radar size={10} />
        <Radar size={12} />
        <Radar size={15} />
      </QuestionSelection>
    </div>
  )
}

export { Radars }
