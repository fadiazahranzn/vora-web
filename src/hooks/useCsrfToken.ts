'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to manage CSRF token for API requests
 * Fetches the token on mount and provides it for mutation requests
 *
 * @returns Object containing the CSRF token and loading state
 *
 * @example
 * const { csrfToken, isLoading } = useCsrfToken()
 *
 * fetch('/api/habits', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'X-CSRF-Token': csrfToken || '',
 *   },
 *   body: JSON.stringify(data),
 * })
 */
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await fetch('/api/csrf-token')
        if (!response.ok) {
          throw new Error('Failed to fetch CSRF token')
        }
        const data = await response.json()
        setCsrfToken(data.token)
      } catch (err) {
        console.error('Error fetching CSRF token:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchCsrfToken()
  }, [])

  return { csrfToken, isLoading, error }
}
