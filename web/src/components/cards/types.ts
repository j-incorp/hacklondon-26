import * as z from 'zod'

const cardType = z.literal(['curse', 'time-bonus', 'veto', 'duplicate'])

type CardType = z.infer<typeof cardType>

const card = z.object({
  type: cardType,
})

type Card = z.infer<typeof card>

const deck = z.object({
  cards: z.array(card),
})

type Deck = z.infer<typeof deck>

const hand = z.object({
  cards: z.array(card),
})

type Hand = z.infer<typeof hand>

export type { Card, CardType, Deck, Hand }

export { card, cardType, deck, hand }
