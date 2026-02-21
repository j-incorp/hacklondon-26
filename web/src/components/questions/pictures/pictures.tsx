import { Building, Building2, Camera, CloudSun, RailSymbol, Waves } from 'lucide-react'
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
        <Picture
          title="5 building"
          description="Take a picture of 5 buildings in the same scene."
          icon={<Building2 className="size-8" />}
        />
        <Picture
          title="Tallest building"
          description="Take a picture of the tallest building visible from the station."
          icon={<Building className="size-8" />}
        />
        <Picture
          title="Train station"
          description="Take a picture of the train station"
          icon={<RailSymbol className="size-8" />}
        />
        <Picture
          title="Largest body of water"
          description="Take a picture of the largest body of water"
          icon={<Waves className="size-8" />}
        />
        <Picture title="The sky" description="Take a picture of the sky" icon={<CloudSun className="size-8" />} />
      </QuestionSelection>
    </div>
  )
}

export { Pictures }
