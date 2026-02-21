import circle from '@turf/circle'
import difference from '@turf/difference'
import { featureCollection, polygon } from '@turf/helpers'
import { type ReactElement } from 'react'
import { GeoJSON } from 'react-leaflet'

import { londonBoundary } from '@/lib/geo/geo-utils'

import { MapCircle } from './map-circle'

interface MapRadarMaskProps {
  center: [number, number] // Joe change to type Position
  radius: number // in meters
  radarSuccess?: boolean
}

const MapRadarMask = ({ center, radius, radarSuccess = false }: MapRadarMaskProps): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const londonBoundaryPolygon = polygon((londonBoundary?.geometry.coordinates as any) ?? [])

  if (radarSuccess) {
    const cutout = circle([center[1], center[0]], radius / 1000, { units: 'kilometers' })
    const mask = difference(featureCollection([londonBoundaryPolygon, cutout]))

    if (!mask) {
      return <div className="mapRadarMask">Mask Failed</div>
    }
    return (
      <GeoJSON
        key={`${center[0]}-${center[1]}-${radius}`}
        data={mask}
        style={{ fillColor: 'black', fillOpacity: 0.5, color: 'transparent', weight: 0 }}
        filter={(feature) => feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'}
      />
    )
  } else {
    return <MapCircle center={center} radius={radius} />
  }
}

export { MapRadarMask }
