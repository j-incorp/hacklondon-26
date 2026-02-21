import { useContext } from 'react'

import { QuestionsProviderContext } from '@/components/questions/questions-provider'

const useQuestions = () => {
  const context = useContext(QuestionsProviderContext)

  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider')
  }

  return context
}

export { useQuestions }
