import { Scale } from 'lucide-react'
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
        <Matching text="Same tube line" />
        <Matching text="Same London borough" />
        <Matching text="Same London zone" />
      </QuestionSelection>
    </div>
  )
}

export { Matchings }
