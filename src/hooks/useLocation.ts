'use client'

import { useEffect, useState } from 'react'

export function useLocation() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported'))
      setLoading(false)
      return
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      setLoading(false)
    }

    const handleError = (error: GeolocationPositionError) => {
      setError(new Error(error.message))
      setLoading(false)
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    })
  }, [])

  return { location, loading, error }
}
