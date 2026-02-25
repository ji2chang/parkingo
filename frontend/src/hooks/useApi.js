import { useState, useCallback, useRef } from 'react'

/**
 * Generic hook to execute an async API function with loading/error state.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(api.getParkings)
 *   useEffect(() => { execute({ citta: 'Milano' }) }, [execute])
 */
export function useApi(apiFn) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const execute = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiFn(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err.message ?? 'Errore sconosciuto')
        return null
      } finally {
        setLoading(false)
      }
    },
    [apiFn]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}
