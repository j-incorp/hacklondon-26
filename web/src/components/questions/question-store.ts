import { createStore } from '@tanstack/react-store'

import type { QuestionData } from './types'

const initialState: QuestionData = {
  asked: [],
  responses: [],
}

const questionStore = createStore(initialState)

export { questionStore }
