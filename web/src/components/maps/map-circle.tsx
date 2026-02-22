import { type ReactElement } from 'react'
import { Circle } from 'react-leaflet'

interface MapCircleProps {
  center: [number, number] // Joe change to type Position
  radius: number // in meters
  color?: string
}

const MapCircle = ({ center, radius, color = 'black' }: MapCircleProps): ReactElement => {
  return <Circle center={center} pathOptions={{ color }} radius={radius} />
}

export { MapCircle }
