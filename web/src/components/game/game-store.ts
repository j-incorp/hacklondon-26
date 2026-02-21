import { createStore } from '@tanstack/react-store'

import type { Game } from './types'

const initialState: Game = {
  playerId: '',
  lobby: {
    code: '',
    name: '',
  },
}

const gameStore = createStore(initialState)

export { gameStore }
