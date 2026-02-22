import { useStore } from '@tanstack/react-store'
import { type ReactElement, useCallback, useEffect } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import { useLocation } from '@/hooks/use-location'

import { gameStore } from './game-store'
import type { Player } from './types'
import { message } from './types'

const PlayerList = ({ players }: { players: Player[] }): ReactElement => (
  <ul className="p-4 space-y-2">
    {players ? (
      players.map((p) => (
        <li key={p.id} className="text-lg">
          {p.name}
        </li>
      ))
    ) : (
      <li className="text-gray-500">No players yet</li>
    )}
  </ul>
)

const Game = (): ReactElement => {
  const store = useStore(gameStore, (state) => state)

  const { location } = useLocation()

  const { sendJsonMessage } = useWebSocket(
    `ws://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}?name=${store.lobby.name}`,
    {
      onMessage: (event: MessageEvent<string>) => {
        const parsed = message.safeParse(JSON.parse(event.data))

        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse incoming message', parsed.error)

          return
        }

        const msg = parsed.data

        switch (msg.type) {
          case 'PLAYER_INFO': {
            const { id, name, role } = msg.data

            // eslint-disable-next-line no-console
            console.log('Player info received', { id, name, role })
            gameStore.setState((prev) => ({ ...prev, playerId: id, role }))

            break
          }

          case 'PLAYER_JOINED': {
            const { playerId } = msg.data

            // eslint-disable-next-line no-console
            console.log('Player joined', { playerId })

            break
          }

          case 'PLAYER_LEFT': {
            const { playerId } = msg.data

            // eslint-disable-next-line no-console
            console.log('Player left', { playerId })

            break
          }

          case 'GAME_STATE_CHANGE': {
            const { state } = msg.data

            // eslint-disable-next-line no-console
            console.log('Game state changed', { state })

            break
          }

          case 'HIDING_PHASE_START': {
            const { duration } = msg.data

            // eslint-disable-next-line no-console
            console.log('Hiding phase started', { duration })

            break
          }

          case 'PLAYER_POSITION': {
            const { lat, long } = msg.data

            // eslint-disable-next-line no-console
            console.log('Player position update', { lat, long })

            break
          }

          case 'PLAYER_ACTION': {
            const { action, data } = msg.data

            // eslint-disable-next-line no-console
            console.log('Player action received', { action, data })

            break
          }

          case 'PLAYER_LIST_UPDATE': {
            const { players } = msg.data

            // eslint-disable-next-line no-console
            console.log('Player list updated', { players })

            gameStore.setState((prev) => ({
              ...prev,
              lobby: { ...prev.lobby, players },
            }))

            break
          }
        }
      },
    },
  )

  useEffect(() => {
    gameStore.setState((prev) => ({ ...prev, sendJsonMessage }))
  }, [sendJsonMessage])

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

  const startGame = useCallback(async () => {
    await fetch(`http://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}/start`, { method: 'POST' })
  }, [store.lobby.code])

  return (
    <div className="w-full h-full bg-gray-100">
      <h1 className="text-4xl font-bold">Lobby {store.lobby.code}</h1>
      <PlayerList players={store.lobby.players} />
      {store.lobby.players?.length === 2 && (
        <button
          className="mx-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={startGame}
          type="button"
        >
          Start Game
        </button>
      )}
    </div>
  )
}

export { Game }
