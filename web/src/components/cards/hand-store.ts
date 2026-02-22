import { createStore } from '@tanstack/react-store'

import type { HandData } from './types'

const initialState: HandData = {
  cards: [],
}

const handStore = createStore(initialState)

export { handStore }
