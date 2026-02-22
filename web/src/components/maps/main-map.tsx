/* eslint-disable no-console */
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { type ReactElement, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { GeoJSON } from 'react-leaflet'

import londonMask from '@/components/maps/consts/london-boundary.json'
import { getLondonBorough } from '@/lib/geo/geo-utils'

import { BoroughMask } from './borough-mask'
import { TubeLineMask } from './tube-line-mask'
import { PlayerMarker } from './player-marker'

const hattonCross = [51.46644304791559, -0.4234032595292248]

interface MainMapProps {
  center: [number, number]
  zoom: number
}

const MainMap = ({ center, zoom }: MainMapProps): ReactElement => {
  // getTubeStopInfo(51.505, -0.09).then((info) => {
  //   console.log('Tube Stop Info:', info)
  // })

  const borough = getLondonBorough(hattonCross[0], hattonCross[1])

  console.log('Borough:', borough)

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        key="london-mask"
        data={londonMask as Feature<Polygon | MultiPolygon>}
        style={{ fillColor: 'black', fillOpacity: 0.5, color: 'transparent' }}
      />
      {/* <BoroughMask boroughName="Hounslow" boroughSuccess={false} color="orange" /> */}
      {/* <MapRadarMask center={[51.505, -0.09]} radius={10000} radarSuccess={true} /> */}

      {/* <TubeLineMask lineName="Piccadilly" lineSuccess={true} color="blue" /> */}
      <PlayerMarker lat={51.605} lng={-0.09} color="#000000" />
    </MapContainer>
  )
}

export { MainMap }
