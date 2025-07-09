import { useDispatch, useSelector } from 'react-redux'
import { updateShowRecentTransactions } from './reducer'
import { useCallback } from 'react'
import { RootState } from 'store'

export function useShowRecentTransactions(): [boolean, (newShowRecentTransactions: boolean) => void] {
  const dispatch = useDispatch()
  const showRecentTransactions = useSelector((state: RootState) => state.portfoliocache.showRecentTransactions)

  const setShowRecentTransactions = useCallback(
    (newShowRecentTransactions: boolean) => {
      dispatch(updateShowRecentTransactions(newShowRecentTransactions))
    },
    [dispatch],
  )

  return [showRecentTransactions, setShowRecentTransactions]
}
