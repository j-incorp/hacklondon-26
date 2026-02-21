import * as z from 'zod'

import { matchingRequestSchema, matchingResponseSchema } from './matchings/types'
import { pictureRequestSchema, pictureResponseSchema } from './pictures/types'
import { radarRequestSchema, radarResponseSchema } from './radars/types'

const radarQuestion = z.object({
  type: z.literal('radar'),
  data: radarRequestSchema,
})

const matchingQuestion = z.object({
  type: z.literal('matching'),
  data: matchingRequestSchema,
})

const pictureQuestion = z.object({
  type: z.literal('picture'),
  data: pictureRequestSchema,
})

const question = z.discriminatedUnion('type', [radarQuestion, matchingQuestion, pictureQuestion])

type Question = z.infer<typeof question>

const radarQuestionResponse = z.object({
  type: z.literal('radar'),
  data: radarResponseSchema,
})

const matchingQuestionResponse = z.object({
  type: z.literal('matching'),
  data: matchingResponseSchema,
})

const pictureQuestionResponse = z.object({
  type: z.literal('picture'),
  data: pictureResponseSchema,
})

const questionResponse = z.discriminatedUnion('type', [
  radarQuestionResponse,
  matchingQuestionResponse,
  pictureQuestionResponse,
])

type QuestionResponse = z.infer<typeof questionResponse>

const questionData = z.object({
  asked: z.array(question),
  responses: z.array(questionResponse),
})

type QuestionData = z.infer<typeof questionData>

export type { Question, QuestionData, QuestionResponse }

export { question, questionData, questionResponse }
