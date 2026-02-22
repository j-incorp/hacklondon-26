import { useContext } from 'react'

import { HandProviderContext } from '@/components/cards/hand-provider'

const useHand = () => {
  const context = useContext(HandProviderContext)

  if (context === undefined) {
    throw new Error('useHand must be used within a HandProvider')
  }

  return context
}

export { useHand }
