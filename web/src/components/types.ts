import * as z from 'zod'

const position = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
})

type Position = z.infer<typeof position>

export type { Position }

export { position }
