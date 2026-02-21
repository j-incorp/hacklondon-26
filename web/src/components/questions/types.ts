import * as z from 'zod'

const question = z.object({
  type: z.enum(['radar', 'picture', 'matching']),
})

type Question = z.infer<typeof question>

export type { Question }

export { question }
