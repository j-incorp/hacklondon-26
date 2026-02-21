import circle from '@turf/circle'
import difference from '@turf/difference'
import { featureCollection, polygon } from '@turf/helpers'
import { type ReactElement } from 'react'
import { GeoJSON } from 'react-leaflet'
import { MapCircle } from './map-circle'
import { getLondonBoroughBoundary, getLondonBoroughBoundaries } from '@/lib/geo-utils'
import { MapRadarMask } from './map-radar-mask'
import { union } from '@turf/union'

interface BoroughMaskProps {
  boroughName: string
  borough_success?: boolean
}

const boroughBoundary = getLondonBoroughBoundary('Hammersmith and Fulham')

console.log('Borough Boundary:', boroughBoundary)

const BoroughMask = ({ boroughName, borough_success }: BoroughMaskProps): ReactElement => {
  if (borough_success) {
    const boroughBoundary = getLondonBoroughBoundary(boroughName)

    const mask = boroughBoundary?.geometry

    if (!mask) {
      return <div className="mapRadarMask">Mask Failed</div>
    }
    return (
      <GeoJSON
        key={`${boroughName}-mask`}
        data={mask}
        style={{ fillColor: 'black', fillOpacity: 0.5, color: 'black' }}
      />
    )
  } else {
    const boroughBoundaries = getLondonBoroughBoundaries(boroughName).map((feature) => feature.geometry)

    console.log('Borough Boundaries:', boroughBoundaries)

    if (!boroughBoundaries || boroughBoundaries.length === 0) {
      return <div className="mapRadarMask">Mask Failed</div>
    }

    return boroughBoundaries.map((boundary, index) => (
      <GeoJSON
        key={`${boroughName}-mask-${index}`}
        data={boundary}
        style={{ fillColor: 'black', fillOpacity: 0.5, color: 'black' }}
      />
    ))
  }
}

export { BoroughMask }
