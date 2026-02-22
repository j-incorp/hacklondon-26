import { useStore } from '@tanstack/react-store'
import { type ReactElement, useEffect } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import { useLocation } from '@/hooks/use-location'

import { Tools } from '../tools/tools'
import { gameStore } from './game-store'

const Game = (): ReactElement => {
  const store = useStore(gameStore, (state) => state)

  const { location } = useLocation()

  const { sendJsonMessage } = useWebSocket(`ws://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}`, {
    onMessage: (event) => {
      // eslint-disable-next-line no-console
      console.log(event)
    },
  })

  useEffect(() => {
    if (!store.lobby.code) {
      return
    }

    if (!location) {
      return
    }

    const intervalId = window.setInterval(() => {
      sendJsonMessage({
        type: 'PLAYER_POSITION',
        data: {
          lat: location.latitude,
          long: location.longitude,
        },
      })
    }, 10_000)

    return () => window.clearInterval(intervalId)
  }, [sendJsonMessage, store.lobby.code, location])

  return (
    <div className="w-full h-full bg-gray-100">
      {JSON.stringify(store)}
      <Tools type="seeker" />
    </div>
  )
}

export { Game }
