import { Camera } from 'lucide-react'
import { type ReactElement } from 'react'

import { QuestionSelection } from '../question-selection'
import { Picture } from './picture'

interface PicturesProps {
  className?: string
}

const Pictures = ({ className }: PicturesProps): ReactElement => {
  return (
    <div className={className}>
      <div className="inline-flex items-center gap-3 mb-4">
        <Camera className="size-12 text-rose-700" />
        <div>
          <h3>Pictures</h3>
          <p>Draw 1, pick 1</p>
        </div>
      </div>
      <QuestionSelection>
        <Picture text="5 building" />
        <Picture text="Tallest building" />
        <Picture text="Train station" />
      </QuestionSelection>
    </div>
  )
}

export { Pictures }
