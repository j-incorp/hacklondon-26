import { useStore } from '@tanstack/react-store'
import type { ReactNode } from 'react'
import { createContext, type ReactElement } from 'react'

import { deckStore } from './deck-store'
import { handStore } from './hand-store'
import type { Card } from './types'

const MAX_HAND_SIZE = 6

interface HandProviderContextValue {
  drawCard: () => void
  getCards: () => Card[]
  addCardToHand: (card: Card) => void
  removeCardFromHand: (index: number) => void
  duplicateCardInHand: (card: Card) => void
  isHandFull: () => boolean
}

const initialState: HandProviderContextValue = {
  drawCard: () => void 0,
  getCards: () => [],
  addCardToHand: () => void 0,
  removeCardFromHand: () => void 0,
  duplicateCardInHand: () => void 0,
  isHandFull: () => false,
}

const HandProviderContext = createContext<HandProviderContextValue>(initialState)

interface HandProviderProps {
  children: ReactNode
}

const getRandomIndex = (max: number) => {
  if (max <= 0) {
    return -1
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint32Array(1)

    crypto.getRandomValues(buffer)

    return buffer[0] % max
  }

  return Math.floor(Math.random() * max)
}

const HandProvider = ({ children, ...props }: HandProviderProps): ReactElement => {
  const hand = useStore(handStore, (state) => state)

  const deck = useStore(deckStore, (state) => state)

  const drawCard = () => {
    if (isHandFull()) {
      return
    }

    const index = getRandomIndex(deck.cards.length)

    if (index < 0) {
      return
    }

    const card = deck.cards[index]

    deckStore.setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }))

    if (!card) {
      return
    }

    addCardToHand(card)
  }

  const getCards = () => {
    return hand.cards
  }

  const addCardToHand = (card: Card) => {
    if (isHandFull()) {
      return
    }

    handStore.setState((prev) => ({
      ...prev,
      cards: [...prev.cards, card],
    }))
  }

  const removeCardFromHand = (index: number) => {
    handStore.setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }))
  }

  const duplicateCardInHand = (card: Card) => {
    handStore.setState((prev) => ({
      ...prev,
      cards: [...prev.cards, card],
    }))
  }

  const isHandFull = () => {
    return hand.cards.length > MAX_HAND_SIZE
  }

  const value = {
    drawCard: drawCard,
    getCards: getCards,
    addCardToHand: addCardToHand,
    removeCardFromHand: removeCardFromHand,
    duplicateCardInHand: duplicateCardInHand,
    isHandFull: isHandFull,
  }

  return (
    <HandProviderContext.Provider {...props} value={value}>
      {children}
    </HandProviderContext.Provider>
  )
}

export type { HandProviderContextValue, HandProviderProps }

export { HandProvider, HandProviderContext }
