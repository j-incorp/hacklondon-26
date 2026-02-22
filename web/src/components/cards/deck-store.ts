import { createStore } from '@tanstack/react-store'

import type { Card } from './types'

const initialState: { cards: Card[] } = {
  cards: [
    {
      type: 'veto',
    },
    {
      type: 'time-bonus',
      amount: 5,
    },
    {
      type: 'time-bonus',
      amount: 5,
    },
    {
      type: 'time-bonus',
      amount: 5,
    },
    {
      type: 'time-bonus',
      amount: 5,
    },
    {
      type: 'time-bonus',
      amount: 5,
    },
    {
      type: 'time-bonus',
      amount: 10,
    },
    {
      type: 'time-bonus',
      amount: 10,
    },
    {
      type: 'time-bonus',
      amount: 10,
    },
    {
      type: 'time-bonus',
      amount: 10,
    },
    {
      type: 'time-bonus',
      amount: 15,
    },
    {
      type: 'time-bonus',
      amount: 15,
    },
    {
      type: 'time-bonus',
      amount: 15,
    },
    {
      type: 'time-bonus',
      amount: 20,
    },
    {
      type: 'time-bonus',
      amount: 20,
    },
    {
      type: 'curse',
      title: 'Orange curse',
      curseType: 'orange',
    },
    {
      type: 'curse',
      title: 'Newspaper curse',
      curseType: 'newspaper',
    },
    {
      type: 'curse',
      title: 'Fries curse',
      curseType: 'fries',
    },
    {
      type: 'curse',
      title: 'Taxi curse',
      curseType: 'taxi',
    },
    {
      type: 'curse',
      title: 'Rhyme curse',
      curseType: 'rhyme',
    },
    {
      type: 'curse',
      title: 'Signal fault',
      curseType: 'signal-fault',
    },
  ],
}

const deckStore = createStore(initialState)

export { deckStore }
