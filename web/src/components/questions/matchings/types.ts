import * as z from 'zod'

import { position } from '@/components/types'

const matchingsType = z.literal(['london-zone', 'london-borough', 'tube-line', 'train-station', 'sky'])

const matchingResponseSchema = z.object({
  position,
  matchingType: z.string(),
  hit: z.boolean(),
})

type MatchingType = z.infer<typeof matchingsType>
type MatchingResponseSchema = z.infer<typeof matchingResponseSchema>

export type { MatchingResponseSchema, MatchingType }

export { matchingResponseSchema, matchingsType }
