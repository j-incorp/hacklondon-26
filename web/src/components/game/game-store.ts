import { createStore } from '@tanstack/react-store'

import type { Game } from './types'

interface GameStore extends Game {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendJsonMessage: ((message: any) => void) | null
}

const initialState: GameStore = {
  playerId: '',
  role: '',
  gameState: 'WAITING_FOR_PLAYERS',
  hidingPhaseEndTime: new Date(),
  currentQuestion: undefined,
  currentPictureQuestion: undefined,
  lobby: {
    code: '',
    name: '',
    players: [],
  },
  sendJsonMessage: null,
}

const gameStore = createStore(initialState)

export type { GameStore }
export { gameStore }
