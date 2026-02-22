import * as z from 'zod'

const cardType = z.literal(['curse', 'time-bonus', 'veto', 'duplicate'])

type CardType = z.infer<typeof cardType>

const veto = z.object({
  type: z.literal('veto'),
})

type Veto = z.infer<typeof veto>

const timeBonus = z.object({
  type: z.literal('time-bonus'),
  amount: z.number(),
})

type TimeBonus = z.infer<typeof timeBonus>

const curseType = z.enum(['orange', 'newspaper', 'fries', 'taxi', 'rhyme', 'signal-fault'])

type CurseType = z.infer<typeof curseType>

const curse = z.object({
  type: z.literal('curse'),
  title: z.string(),
  curseType: curseType,
})

type Curse = z.infer<typeof curse>

const duplicate = z.object({
  type: z.literal('duplicate'),
})

type Duplicate = z.infer<typeof duplicate>

const card = z.discriminatedUnion('type', [veto, timeBonus, curse, duplicate])

type Card = z.infer<typeof card>

const deck = z.object({
  cards: z.array(card),
})

type Deck = z.infer<typeof deck>

const handData = z.object({
  cards: z.array(card),
})

type HandData = z.infer<typeof handData>

export type { Card, CardType, Curse, CurseType, Deck, Duplicate, HandData, TimeBonus, Veto }

export { card, cardType, curse, curseType, deck, duplicate, handData, timeBonus, veto }
