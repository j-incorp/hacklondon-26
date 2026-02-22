import L from 'leaflet'
import { type ReactElement, useEffect, useRef } from 'react'
import { Marker, useMap } from 'react-leaflet'
interface PlayerMarkerProps {
  lat: number
  lng: number
  color?: string
}

const createPlayerIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `
    <style>
      @keyframes pulse {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
      }
      .pulse-ring {
        animation: pulse 2s ease-out infinite;
      }
    </style>
    <div style="position:relative; width:18px; height:18px;">
      <div class="pulse-ring" style="
        position: absolute;
        width: 35px;
        height: 35px;
        background-color: ${color}4D;
        border-radius: 50%;
        top: 50%;
        left: 50%;
      "></div>
      <div style="
        width: 18px;
        height: 18px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        position: relative;
        z-index: 1;
      "></div>
    </div>
  `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  })

const PlayerMarker = ({ lat, lng, color = '#f54900' }: PlayerMarkerProps): ReactElement => {
  const markerRef = useRef<L.Marker | null>(null)
  const map = useMap()

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
      map.panTo([lat, lng])
    }
  }, [lat, lng, color, map])

  return <Marker ref={markerRef} position={[lat, lng]} icon={createPlayerIcon(color)}></Marker>
}

export { PlayerMarker }
