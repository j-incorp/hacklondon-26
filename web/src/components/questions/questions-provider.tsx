import { useStore } from '@tanstack/react-store'
import { createContext, type ReactNode } from 'react'

import { questionStore } from './question-store'
import type { Question, QuestionData, QuestionResponse } from './types'

interface QuestionsContextValue {
  getData: () => QuestionData
  setData: (data: QuestionData) => void
  askQuestion: (data: Question) => void
  addQuestionResponse: (response: QuestionResponse) => void
  hasQuestionBeenAsked: (question: Question) => boolean
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

  const askQuestion = (data: Question) => {
    questionStore.setState((prev) => ({
      ...prev,
      asked: [...prev.asked, data],
    }))
  }

  const addQuestionResponse = (response: QuestionResponse) => {
    questionStore.setState((prev) => ({
      ...prev,
      responses: [...prev.responses, response],
    }))
  }

  const hasQuestionBeenAsked = (question: Question) => {
    return store.asked.some((askedQuestion) => {
      if (askedQuestion.type === 'radar' && question.type === 'radar') {
        return askedQuestion.data.radius === question.data.radius
      }

      if (askedQuestion.type === 'matching' && question.type === 'matching') {
        return askedQuestion.data.matchingType === question.data.matchingType
      }

      if (askedQuestion.type === 'picture' && question.type === 'picture') {
        return askedQuestion.data.pictureType === question.data.pictureType
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
