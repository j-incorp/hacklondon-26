import { isNonEmptyArray } from '@tanstack/react-form'
import { RadarIcon } from 'lucide-react'
import { type ReactElement } from 'react'

import { QuestionSelection } from '../question-selection'
import { Radar } from './radar'

interface RadarsProps {
  className?: string
}

const RADAR_SIZES = [0.25, 0.5, 1, 2, 5, 8, 10, 12, 15]

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
        {isNonEmptyArray(RADAR_SIZES) ? RADAR_SIZES.map((size) => <Radar key={size} size={size} />) : undefined}
      </QuestionSelection>
    </div>
  )
}

export { Radars }
