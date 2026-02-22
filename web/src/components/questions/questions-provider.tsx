import { useStore } from '@tanstack/react-store'
import { createContext, type ReactNode } from 'react'

import { gameStore } from '../game/game-store'
import type { MatchingQuestion, PictureQuestion, QuestionRequest, QuestionResponse, RadarQuestion } from '../game/types'
import { questionStore } from './question-store'
import type { QuestionData } from './types'

interface QuestionsContextValue {
  getData: () => QuestionData
  setData: (data: QuestionData) => void
  askQuestion: (data: QuestionRequest) => void
  addQuestionResponse: (response: QuestionResponse) => void
  hasQuestionBeenAsked: (question: QuestionRequest) => boolean
}

const initialState: QuestionsContextValue = {
  getData: () => ({}) as QuestionData,
  setData: () => void 0,
  askQuestion: () => void 0,
  addQuestionResponse: () => void 0,
  hasQuestionBeenAsked: () => false,
}

const QuestionsProviderContext = createContext<QuestionsContextValue>(initialState)

interface QuestionsProviderProps {
  children: ReactNode
}

const QuestionsProvider = ({ children, ...props }: QuestionsProviderProps) => {
  const store = useStore(questionStore, (state) => state)

  const getData = () => {
    return store
  }

  const setData = (data: QuestionData) => {
    questionStore.setState((prev) => ({
      ...prev,
      ...data,
    }))
  }

  const askQuestion = (data: QuestionRequest) => {
    questionStore.setState((prev) => ({
      ...prev,
      asked: [...prev.asked, data],
    }))

    const { sendJsonMessage } = gameStore.state

    sendJsonMessage?.({
      type: 'PLAYER_ACTION',
      data: {
        action: 'ASK_QUESTION',
        data,
      },
    })
  }

  const addQuestionResponse = (response: QuestionResponse) => {
    questionStore.setState((prev) => ({
      ...prev,
      responses: [...prev.responses, response],
    }))
  }

  const hasQuestionBeenAsked = (question: QuestionRequest) => {
    return store.asked.some((askedQuestion) => {
      if (askedQuestion.type !== question.type) {
        return false
      }

      if (askedQuestion.type === 'RADAR' && question.type === 'RADAR') {
        const askedData = askedQuestion.data as RadarQuestion | undefined
        const questionData = question.data as RadarQuestion | undefined

        return askedData?.radius === questionData?.radius
      }

      if (askedQuestion.type === 'MATCHING' && question.type === 'MATCHING') {
        const askedData = askedQuestion.data as MatchingQuestion | undefined
        const questionData = question.data as MatchingQuestion | undefined

        return askedData?.type === questionData?.type
      }

      if (askedQuestion.type === 'PICTURE' && question.type === 'PICTURE') {
        const askedData = askedQuestion.data as PictureQuestion | undefined
        const questionData = question.data as PictureQuestion | undefined

        return askedData?.type === questionData?.type
      }

      return false
    })
  }

  const value = {
    getData: getData,
    setData: setData,
    askQuestion: askQuestion,
    addQuestionResponse: addQuestionResponse,
    hasQuestionBeenAsked: hasQuestionBeenAsked,
  }

  return (
    <QuestionsProviderContext.Provider {...props} value={value}>
      {children}
    </QuestionsProviderContext.Provider>
  )
}

export { QuestionsProvider, QuestionsProviderContext }
