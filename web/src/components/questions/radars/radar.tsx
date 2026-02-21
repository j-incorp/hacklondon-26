import { type ReactElement } from 'react'

interface RadarProps {
  size: number
}

const Radar = ({ size }: RadarProps): ReactElement => {
  return (
    <div className="inline-flex size-24 rounded-sm items-center justify-center bg-orange-500 text-lg font-medium text-white">
      {size} km
    </div>
  )
}

export { Radar }
