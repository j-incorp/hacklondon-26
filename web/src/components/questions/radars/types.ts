import * as z from 'zod'

import { location } from '../../types'

const radarResponseSchema = z.object({
  position: location,
  radius: z.number(),
  hit: z.boolean(),
})

type RadarRequestSchema = z.infer<typeof radarRequestSchema>

const radarRequestSchema = z.object({
  position: location,
  radius: z.number(),
})

type RadarResponseSchema = z.infer<typeof radarResponseSchema>

export type { RadarRequestSchema, RadarResponseSchema }

export { radarRequestSchema, radarResponseSchema }
