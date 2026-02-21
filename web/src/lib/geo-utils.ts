import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { featureCollection, point } from '@turf/helpers'
import union from '@turf/union'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'

import boroughsData from '@/components/maps/consts/london-boroughs.json' assert { type: 'json' }

const fetchLondonBoundary = async (): Promise<Feature<Polygon | MultiPolygon> | null> => {
  const response = await fetch(
    'https://raw.githubusercontent.com/radoi90/housequest-data/master/london_boroughs.geojson',
  )
  const data = await response.json()

  const merged = data.features.reduce(
    (acc: Feature<Polygon | MultiPolygon> | null, feature: Feature<Polygon | MultiPolygon>) => {
      if (!acc) {
        return feature
      }
      return union(featureCollection([acc, feature]))
    },
    null,
  )

  return merged
}

const getLondonBorough = (lat: number, lng: number): string | null => {
  const userPoint = point([lng, lat])

  const match = boroughsData.features.find((feature) => booleanPointInPolygon(userPoint, feature))

  return match ? match.properties?.name || null : null
}

const getLondonBoroughBoundary = (boroughName: string): Feature<Polygon | MultiPolygon> | null => {
  const match = boroughsData.features.find((feature) => feature.properties?.name === boroughName)

  return match || null
}
// Get all borough boundaries appart from the one we want to mask out, then union them together to create a single mask geometry
const getLondonBoroughBoundaries = (boroughName: string): Feature<Polygon | MultiPolygon>[] => {
  const otherBoroughs = boroughsData.features.filter((feature) => feature.properties?.name !== boroughName)
  return otherBoroughs as Feature<Polygon | MultiPolygon>[]
}

// =============================TFL=============================

interface TubeStopInfo {
  nearestTubeStop: string | null
  lines: string[]
  zone: string[] | null
}

const getTubeStopInfo = async (lat: number, lng: number): Promise<TubeStopInfo> => {
  const url = new URL('https://api.tfl.gov.uk/StopPoint')

  url.searchParams.append('stopTypes', 'NaptanMetroStation')
  url.searchParams.append('lat', lat.toString())
  url.searchParams.append('lon', lng.toString())
  url.searchParams.append('radius', '1000')

  const response = await fetch(url)
  const data = await response.json()

  if (!data.stopPoints || data.stopPoints.length === 0) {
    return {
      nearestTubeStop: null,
      lines: [],
      zone: null,
    }
  }

  const nearestStop = data.stopPoints[0]

  const lines = nearestStop.lines ? nearestStop.lines.map((line: { name: string }) => line.name) : []
  const zone =
    nearestStop.additionalProperties
      ?.find((prop: { key: string }) => prop.key === 'Zone')
      ?.value.split('+')
      .map((z: string) => parseInt(z, 10)) || null

  console.log('TFL API response:', data)
  console.log('Nearest Tube Stop:', nearestStop)
  console.log('Nearest Tube Stop Name:', nearestStop.commonName)
  console.log('Lines:', lines)
  console.log('Zone:', zone)

  return {
    nearestTubeStop: nearestStop.commonName || null,
    lines,
    zone,
  }
}

const getLocationInfo = async (lat: number, lng: number) => {
  const borough = getLondonBorough(lat, lng)
  const tubeInfo = await getTubeStopInfo(lat, lng)
  return {
    borough,
    tubeInfo,
  }
}

const londonBoundary: Feature<Polygon | MultiPolygon> | null = (
  boroughsData as GeoJSON.FeatureCollection
).features.reduce((acc: Feature<Polygon | MultiPolygon> | null, feature) => {
  if (!acc) {
    return feature as Feature<Polygon | MultiPolygon>
  }
  return union(featureCollection([acc, feature as Feature<Polygon | MultiPolygon>]))
}, null)

// TODO ZODify the above functions

export {
  fetchLondonBoundary,
  getLondonBorough,
  getTubeStopInfo,
  getLocationInfo,
  londonBoundary,
  getLondonBoroughBoundary,
  getLondonBoroughBoundaries,
}
