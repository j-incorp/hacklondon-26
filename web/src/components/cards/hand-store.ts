import { createStore } from '@tanstack/react-store'

import type { HandData } from './types'

const initialState: HandData = {
  cards: [
    { type: 'veto' },
    { type: 'veto' },
    { type: 'duplicate' },
    { type: 'time-bonus', amount: 5 },
    { type: 'curse', title: 'Rhyme curse' },
    { type: 'curse', title: 'Orange curse' },
  ],
}

const handStore = createStore(initialState)

export { handStore }
