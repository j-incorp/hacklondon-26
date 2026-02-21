import circle from '@turf/circle'
import difference from '@turf/difference'
import { featureCollection, polygon } from '@turf/helpers'
import { type ReactElement } from 'react'
import { GeoJSON } from 'react-leaflet'

interface MapRadarMaskProps {
  center: [number, number] // Joe change to type Position
  radius: number // in meters
}

const LondonBorderPolygon = polygon([
  [
    [-0.510375, 51.28676],
    [0.334015, 51.28676],
    [0.334015, 51.691874],
    [-0.510375, 51.691874],
    [-0.510375, 51.28676],
  ],
])

const MapRadarMask = ({ center, radius }: MapRadarMaskProps): ReactElement => {
  const cutout = circle([center[1], center[0]], radius / 1000, { units: 'kilometers' })
  const mask = difference(featureCollection([LondonBorderPolygon, cutout]))

  if (!mask) {
    return <div className="mapRadarMask">Mask Failed</div>
  }
  return (
    <GeoJSON
      key={`${center[0]}-${center[1]}-${radius}`}
      data={mask}
      style={{ fillColor: 'black', fillOpacity: 0.5, color: 'black' }}
    />
  )
}

export { MapRadarMask }
