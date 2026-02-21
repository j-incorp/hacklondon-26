/* eslint-disable no-console */
import { type ReactElement } from 'react'
import { GeoJSON } from 'react-leaflet'

import { getLondonBoroughBoundaries, getLondonBoroughBoundary } from '@/lib/geo/geo-utils'
import { isNonEmptyArray } from '@/lib/is/is-non-empty-array'

interface BoroughMaskProps {
  boroughName: string
  boroughSuccess?: boolean
}

const boroughBoundary = getLondonBoroughBoundary('Hammersmith and Fulham')

console.log('Borough Boundary:', boroughBoundary)

const BoroughMask = ({ boroughName, boroughSuccess }: BoroughMaskProps): ReactElement => {
  if (boroughSuccess) {
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

    return (
      <div>
        {isNonEmptyArray(boroughBoundaries)
          ? boroughBoundaries.map((boundary, index) => (
              <GeoJSON
                key={`${boroughName}-mask-${index}`}
                data={boundary}
                style={{ fillColor: 'black', fillOpacity: 0.5, color: 'black' }}
              />
            ))
          : undefined}
      </div>
    )
  }
}

export { BoroughMask }
