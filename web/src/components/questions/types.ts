import * as z from 'zod'

import { questionRequest, questionResponse } from '../game/types'

const questionData = z.object({
  asked: z.array(questionRequest),
  responses: z.array(questionResponse),
})

type QuestionData = z.infer<typeof questionData>

export type { QuestionData }

export { questionData }
