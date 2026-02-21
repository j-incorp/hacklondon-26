import { featureCollection } from '@turf/helpers'
import union from '@turf/union'
import { type Feature, type MultiPolygon,type Polygon } from 'geojson'

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

export { fetchLondonBoundary }
