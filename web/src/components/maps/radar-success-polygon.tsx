import { type ReactElement } from 'react'
import { SVGOverlay } from 'react-leaflet'

interface RadarSuccessPolygonProps {
  center: [number, number] // Joe change to type Position
  radius: number // in meters
}

const bounds = [
  [-90, -180],
  [90, 180],
]

const RadarSuccessPolygon = ({ center, radius }: RadarSuccessPolygonProps): ReactElement => {
  return (
    <SVGOverlay bounds={bounds} opacity={0.5}>
      <defs>
        <mask id="radar-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx={center[0]} cy={center[1]} r={radius} fill="black" />
        </mask>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="rgba(255, 0, 0, 0.5)" mask="url(#radar-mask)" />
    </SVGOverlay>
  )
}

export { RadarSuccessPolygon }
