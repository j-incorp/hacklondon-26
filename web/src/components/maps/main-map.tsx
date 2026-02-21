/* eslint-disable no-console */
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { type ReactElement } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { GeoJSON } from 'react-leaflet'

import londonMask from '@/components/maps/consts/london-boundary.json'
import { getLondonBorough } from '@/lib/geo/geo-utils'

import { BoroughMask } from './borough-mask'

const hattonCross = [51.46644304791559, -0.4234032595292248]

const MainMap = (): ReactElement => {
  // getTubeStopInfo(51.505, -0.09).then((info) => {
  //   console.log('Tube Stop Info:', info)
  // })

  const borough = getLondonBorough(hattonCross[0], hattonCross[1])

  console.log('Borough:', borough)

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        key="london-mask"
        data={londonMask as Feature<Polygon | MultiPolygon>}
        style={{ fillColor: 'black', fillOpacity: 0.5, color: 'transparent' }}
      />
      <BoroughMask boroughName="Hounslow" boroughSuccess={false} />
      {/* <MapRadarMask center={[51.505, -0.09]} radius={10000} radarSuccess={true} /> */}

      {/* <MapCircle center={[51.505, -0.09]} radius={10000} /> */}
    </MapContainer>
  )
}

export { MainMap }
