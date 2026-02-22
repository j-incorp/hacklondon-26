import type { ReactElement } from 'react'

import { useLocation } from '@/hooks/use-location'

const Location = (): ReactElement => {
  const { location, loading, error } = useLocation()

  if (loading) {
    return <div>loading location...</div>
  }

  if (error) {
    return <div>error loading location: {error.message}</div>
  }

  return (
    <div>
      lat: {location?.lat} long: {location?.long}
    </div>
  )
}

export { Location }
