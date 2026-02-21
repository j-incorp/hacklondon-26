import { type ReactElement } from 'react'

interface RadarProps {
  size: number
}

const Radar = ({ size }: RadarProps): ReactElement => {
  return (
    <div className="inline-flex size-20 rounded-sm items-center justify-center bg-orange-500 active:bg-orange-600 text-lg font-medium text-white">
      {size} km
    </div>
  )
}

export { Radar }
