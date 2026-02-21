import { useStore } from '@tanstack/react-store'
import type { ReactElement } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import { gameStore } from './game-store'

const Game = (): ReactElement => {
  const store = useStore(gameStore, (state) => state)

  const {} = useWebSocket(`${import.meta.env.VITE_API_URL}/ws`)

  return <div className="w-full h-full bg-gray-100">{JSON.stringify(store)}</div>
}

export { Game }
