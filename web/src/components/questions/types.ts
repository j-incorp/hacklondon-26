import * as z from 'zod'

const questionType = z.literal(['radar', 'picture', 'matching'])

const question = z.object({
  type: questionType,
})

const questionResponse = z.object({
  type: questionType,
})

type Question = z.infer<typeof question>
type QuestionResponse = z.infer<typeof questionResponse>

export type { Question, QuestionResponse }

export { question, questionResponse }
