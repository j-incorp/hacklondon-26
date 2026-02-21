import type { ReactElement, ReactNode } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'

import type { Position } from '../types'

interface LocationProviderState {
  location?: Position
  error?: GeolocationPositionError
  loading?: boolean
}

const initialState: LocationProviderState = {
  location: undefined,
  error: undefined,
  loading: undefined,
}

const LocationProviderContext = createContext<LocationProviderState>(initialState)

interface LocationProviderProps {
  children: ReactNode
  options?: PositionOptions
}

const geolocationSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator

const LocationProvider = ({ children, options }: LocationProviderProps): ReactElement => {
  const [location, setLocation] = useState<Position | undefined>(undefined)
  const [error, setError] = useState<GeolocationPositionError | undefined>(() => {
    if (!geolocationSupported) {
      return {
        code: 2,
        message: 'Geolocation is not supported by this browser.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError
    }

    return undefined
  })
  const [loading, setLoading] = useState(geolocationSupported)

  useEffect(() => {
    if (!geolocationSupported) {
      return
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      })

      setError(undefined)

      setLoading(false)
    }

    const onError = (err: GeolocationPositionError) => {
      setError(err)

      setLoading(false)
    }

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10_000,
      maximumAge: 0,
      ...options,
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [options])

  const value = useMemo<LocationProviderState>(() => ({ location, error, loading }), [location, error, loading])

  return <LocationProviderContext.Provider value={value}>{children}</LocationProviderContext.Provider>
}

export type { LocationProviderProps, LocationProviderState }

export { LocationProvider, LocationProviderContext }
