import { useContext } from 'react'

import type { LocationProviderState } from '@/components/location/location-provider'
import { LocationProviderContext } from '@/components/location/location-provider'

const useLocation = (): LocationProviderState => {
  const context = useContext(LocationProviderContext)

  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }

  return context
}

export { useLocation }
