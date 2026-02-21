import { type ReactElement } from 'react'
import { Circle } from 'react-leaflet'

interface MapCircleProps {
  center: [number, number] // Joe change to type Position
  radius: number // in meters
}

const MapCircle = ({ center, radius }: MapCircleProps): ReactElement => {
  return <Circle center={center} pathOptions={{ color: 'red' }} radius={radius} />
}

export { MapCircle }
