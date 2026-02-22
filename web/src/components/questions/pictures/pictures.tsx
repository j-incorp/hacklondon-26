import {
  Building,
  Building2,
  Camera,
  CloudSun,
  RailSymbol,
  Waves,
  PaintbrushVertical,
  BusFront,
  Pyramid,
  Landmark,
  Signpost,
  Church,
  PersonStanding,
  Clock,
} from 'lucide-react'
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
          type="five-buildings"
        />
        <Picture
          title="Tallest building"
          description="Take a picture of the tallest building visible from the station."
          icon={<Building className="size-8" />}
          type="tallest-building"
        />
        <Picture
          title="Train station"
          description="Take a picture of the train station"
          icon={<RailSymbol className="size-8" />}
          type="train-station"
        />
        <Picture
          title="Largest body of water"
          description="Take a picture of the largest body of water"
          icon={<Waves className="size-8" />}
          type="body-of-water"
        />
        <Picture
          title="The sky"
          description="Take a picture of the sky"
          icon={<CloudSun className="size-8" />}
          type="sky"
        />
        <Picture
          title="Street art"
          description="Take a picture of street art"
          icon={<PaintbrushVertical className="size-8" />}
          type="street-art"
        />
        <Picture
          title="Bus Route Number"
          description="Take a picture of a bus with a route number on it (Hide route name)"
          icon={<BusFront className="size-8" />}
          type="bus-route-number"
        />
        <Picture
          title="Street Sign"
          description="Take a picture of a street sign (Blur out the street name)"
          icon={<Signpost className="size-8" />}
          type="street-sign"
        />
        <Picture
          title="Monument Shadow"
          description="Take a picture of a piece of public art (e.g. statue, sculpture, mural)"
          icon={<Pyramid className="size-8" />}
          type="monument-shadow"
        />
        <Picture
          title="Strava Map"
          description="Take a picture of a Strava map (take at least 6 turns around your hiding zone)"
          icon={<PersonStanding className="size-8" />}
          type="strava-map"
        />
        <Picture
          title="Church"
          description="Take a picture of the nearest church/cathedral"
          icon={<Church className="size-8" />}
          type="church"
        />
        <Picture
          title="Clock"
          description="Take a picture of the biggest clock in your hiding zone"
          icon={<Clock className="size-8" />}
          type="clock"
        />
      </QuestionSelection>
    </div>
  )
}

export { Pictures }
