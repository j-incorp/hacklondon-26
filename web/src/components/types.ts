import * as z from 'zod'

const location = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(),
})

type Location = z.infer<typeof location>

const defaultLocation: Location = {
  latitude: 0,
  longitude: 0,
  accuracy: 0,
}

export type { Location }

export { defaultLocation, location }
