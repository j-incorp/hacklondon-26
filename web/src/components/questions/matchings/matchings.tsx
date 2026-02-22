import { House, Scale, TrainFrontTunnel } from 'lucide-react'
import { type ReactElement } from 'react'

import { QuestionSelection } from '../question-selection'
import { Matching } from './matching'

interface MatchingsProps {
  className?: string
}

const Matchings = ({ className }: MatchingsProps): ReactElement => {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-3 mb-4">
        <Scale className="size-12 text-sky-700" />
        <div>
          <h3>Matchings</h3>
          <p>Draw 3, pick 1</p>
        </div>
      </div>
      <QuestionSelection>
        <Matching
          title="Same tube line"
          description="Is the hider on the same tube line as you?"
          icon={<TrainFrontTunnel className="size-8" />}
          type="tube-line"
        />
        <Matching
          title="Same London borough"
          description="Is the hider in the same London borough as you?"
          icon={<House className="size-8" />}
          type="london-borough"
        />
      </QuestionSelection>
    </div>
  )
}

export { Matchings }
