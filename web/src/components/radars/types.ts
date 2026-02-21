import * as z from 'zod'

import { position } from '../types'

const radarResponseSchema = z.object({
  position,
  radius: z.number(),
  hit: z.boolean(),
})

const radarRequestSchema = z.object({
  position,
  radius: z.number(),
})

type RadarRequestSchema = z.infer<typeof radarRequestSchema>
type RadarResponseSchema = z.infer<typeof radarResponseSchema>

export type { RadarRequestSchema, RadarResponseSchema }

export { radarRequestSchema, radarResponseSchema }
