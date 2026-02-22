/* eslint-disable no-console */
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { type ReactElement } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { GeoJSON } from 'react-leaflet'

import londonMask from '@/components/maps/consts/london-boundary.json'
// import { getLondonBorough } from '@/lib/geo/geo-utils'

// import { MapRadarMask } from './map-radar-mask'
// import { BoroughMask } from './borough-mask'
import { PlayerMarker } from './player-marker'
// import { TubeLineMask } from './tube-line-mask'

const hattonCross = [51.46644304791559, -0.4234032595292248]

interface MainMapProps {
  lat: number
  lng: number
  seekerLat?: number
  seekerLng?: number
  zoom: number
  children?: React.ReactNode
}

const MainMap = ({ lat, lng, seekerLat, seekerLng, zoom, children }: MainMapProps): ReactElement => {
  const center: [number, number] = [lat, lng]
  // getTubeStopInfo(51.505, -0.09).then((info) => {
  //   console.log('Tube Stop Info:', info)
  // })

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl={true}
      style={{ height: '100%', width: '100%' }}
    >
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
      <PlayerMarker lat={lat} lng={lng} color="#000000" />
      {seekerLat && seekerLng && <PlayerMarker lat={seekerLat} lng={seekerLng} seekerMarker={true} color="#f54900" />}
      {children}
    </MapContainer>
  )
}

export { MainMap }
