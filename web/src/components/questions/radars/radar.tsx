import { type ReactElement } from 'react'

interface RadarProps {
  size: number
}

const Radar = ({ size }: RadarProps): ReactElement => {
  return (
    <div className="inline-flex items-center justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-white">
      {size} km
    </div>
  )
}

export { Radar }
