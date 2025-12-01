import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useLazyGetVaultLatestTransactionHistoryQuery, VaultTransactionHistory } from 'api/vaults'
import { updateLatestTransactionHistory } from '../reducer'

/**
 * MyVaultStats API数据获取hook
 */
export function useFetchLatestTransactionHistoryData() {
  const [latestTransactionHistory, setLatestTransactionHistory] = useLatestTransactionHistory()
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingMyStats)
  const [triggerGetLatestTransactionHistory] = useLazyGetVaultLatestTransactionHistoryQuery()

  const fetchLatestTransactionHistory = useCallback(
    async ({
      vaultId,
      type,
      walletAddress,
    }: {
      vaultId: string
      type: 'deposit' | 'withdrawal'
      walletAddress: string
    }) => {
      try {
        const result = await triggerGetLatestTransactionHistory({
          vaultId,
          walletAddress,
          type,
        })
        if (result.data) {
          setLatestTransactionHistory(result.data)
          return { success: true, data: result.data }
        } else {
          console.error('Failed to fetch latest transaction history:', result.error)
          return { success: false, error: result.error }
        }
      } catch (error) {
        console.error('Error fetching my vault stats:', error)
        return { success: false, error }
      }
    },
    [triggerGetLatestTransactionHistory, setLatestTransactionHistory],
  )

  return {
    latestTransactionHistory,
    isLoading,
    fetchLatestTransactionHistory,
  }
}

export function useLatestTransactionHistory(): [VaultTransactionHistory[], (value: VaultTransactionHistory[]) => void] {
  const dispatch = useDispatch()
  const latestTransactionHistory = useSelector((state: RootState) => state.vaults.latestTransactionHistory)

  const setLatestTransactionHistory = useCallback(
    (value: VaultTransactionHistory[]) => {
      dispatch(updateLatestTransactionHistory(value))
    },
    [dispatch],
  )

  return [latestTransactionHistory, setLatestTransactionHistory]
}
