import * as z from 'zod'

const card = z.object({
  type: z.enum(['curse', 'time-bonus', 'veto', 'duplicate']),
})

type Card = z.infer<typeof card>

export type { Card }

export { card }
