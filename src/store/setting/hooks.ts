import { useLazyAddWatchlistQuery, useLazyDeleteWatchlistQuery, useLazyGetWatchlistQuery } from "api/setting"
import { useCallback } from "react"

export function useGetWatchlist() {
  const [triggerGetWatchlist] = useLazyGetWatchlistQuery()
  return useCallback(async () => {
    try {
      const data = await triggerGetWatchlist(1)
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetWatchlist])
}

export function useAddWatchlist() {
  const [triggerAddWatchlist] = useLazyAddWatchlistQuery()
  return useCallback(async (symbol: string) => {
    try {
      const data = await triggerAddWatchlist({ symbol })
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerAddWatchlist])
}

export function useDeleteWatchlist() {
  const [triggerDeleteWatchlist] = useLazyDeleteWatchlistQuery()
  return useCallback(async (symbol: string) => {
    try {
      const data = await triggerDeleteWatchlist({ symbol })
      console.log('data', data)
      return data
    } catch (error) {
      return error
    }
  }, [triggerDeleteWatchlist])
}