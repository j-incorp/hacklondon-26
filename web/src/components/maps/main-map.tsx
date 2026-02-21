import { type ReactElement } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapCircle } from './map-circle'
import { RadarSuccessPolygon } from './radar-success-polygon'

const MainMap = (): ReactElement => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {/* <MapCircle center={[51.505, -0.09]} radius={100} draggable={true} /> */}
      <RadarSuccessPolygon center={[51.505, -0.09]} radius={100} />
    </MapContainer>
  )
}

export { MainMap }
