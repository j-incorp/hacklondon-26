/* eslint-disable @typescript-eslint/no-explicit-any */
import { circle } from '@turf/circle'
import difference from '@turf/difference'
import { featureCollection, polygon } from '@turf/helpers'
import { union } from '@turf/union'
import { type ReactElement, useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'

import { getTubeStationsByLine, londonBoundary } from '@/lib/geo/geo-utils'

import { MapCircle } from './map-circle'

interface TubeLineMaskProps {
  lineName: string
  lineSuccess?: boolean
  color?: string
}

const TubeLineMask = ({ lineName, lineSuccess = false, color = 'black' }: TubeLineMaskProps): ReactElement => {
  const [stations, setStations] = useState<{ stationName: string; lat: number; lng: number }[]>([])

  useEffect(() => {
    void getTubeStationsByLine(lineName.toLowerCase()).then(setStations)
  }, [lineName])

  const stationCentroids = stations.map((station): [number, number] => [station.lat, station.lng])

  if (lineSuccess) {
    const londonBoundaryPolygon = polygon(londonBoundary?.geometry.coordinates as [number, number][][])

    const cutouts = stationCentroids.map((centroid) => {
      // Create a small circle around each station centroid to use as a cutout
      return circle([centroid[1], centroid[0]], 0.25, { units: 'kilometers' })
    })

    if (cutouts.length === 0) {
      return <div>Loading...</div>
    }

    // Union all cutouts into one shape first
    const combinedCutout = cutouts.reduce((acc, cutout): any => {
      if (!acc) {
        return cutout
      }
      return union(featureCollection([acc, cutout])) ?? cutout
    })

    // Union the combined cutout with the London boundary to create the mask
    const mask = difference(featureCollection([londonBoundaryPolygon, combinedCutout]))

    if (!mask) {
      return <div className="tubeLineMask">Tube Line Mask for {lineName} Failed</div>
    }

    return (
      <GeoJSON
        key={`${lineName}`}
        data={mask}
        style={{ fillColor: 'black', fillOpacity: 0.5, color: color, weight: 1.5 }}
      />
    )
  } else {
    return (
      <div>
        {stationCentroids.map((centroid, index) => (
          <MapCircle key={`${lineName}-station-${index}`} center={centroid} radius={250} color={color} />
        ))}
      </div>
    )
  }
}

export { TubeLineMask }
