import * as z from 'zod'

import { location } from '@/components/types'

const matchingsType = z.literal(['london-zone', 'london-borough', 'tube-line', 'train-station', 'sky'])

type MatchingType = z.infer<typeof matchingsType>

const matchingResponseSchema = z.object({
  position: location,
  matchingType: z.string(),
  hit: z.boolean(),
})

type MatchingResponseSchema = z.infer<typeof matchingResponseSchema>

const matchingRequestSchema = z.object({
  position: location,
  matchingType: z.string(),
})

type MatchingRequestSchema = z.infer<typeof matchingRequestSchema>

export type { MatchingRequestSchema, MatchingResponseSchema, MatchingType }

export { matchingRequestSchema, matchingResponseSchema, matchingsType }
