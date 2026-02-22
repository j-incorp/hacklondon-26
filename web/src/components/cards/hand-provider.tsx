import { useStore } from '@tanstack/react-store'
import type { ReactNode } from 'react'
import { createContext, type ReactElement } from 'react'

import { handStore } from './hand-store'
import type { Card } from './types'

const MAX_HAND_SIZE = 6

interface HandProviderContextValue {
  getCards: () => Card[]
  addCardToHand: (card: Card) => void
  removeCardFromHand: (index: number) => void
  duplicateCardInHand: (card: Card) => void
  isHandFull: () => boolean
}

const initialState: HandProviderContextValue = {
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

const HandProvider = ({ children, ...props }: HandProviderProps): ReactElement => {
  const store = useStore(handStore, (state) => state)

  const getCards = () => {
    return store.cards
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
    return store.cards.length > MAX_HAND_SIZE
  }

  const value = {
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
