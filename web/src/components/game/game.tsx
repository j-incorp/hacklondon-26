import { useStore } from '@tanstack/react-store'
import type { ReactElement } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'

import { Tools } from '../tools/tools'
import { gameStore } from './game-store'

const Game = (): ReactElement => {
  const store = useStore(gameStore, (state) => state)

  const { } = useWebSocket(`ws://${import.meta.env.VITE_API_URL}/lobby/${store.lobby.code}`)

  return (
    <div className="w-full h-full bg-gray-100">
      {JSON.stringify(store)}
      <Tools type="seeker" />
    </div>
  )
}

export { Game }
