import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useGetVaultLatestTransactionHistoryQuery } from 'api/vaults'
import { setLoadingLatestTransactionHistory, updateLatestTransactionHistory } from '../reducer'

/**
 * MyVaultStats API数据获取hook
 */
export function useLatestTransactionHistory({
  vaultId,
  type,
  walletAddress,
}: {
  vaultId: string
  type: 'deposit' | 'withdrawal'
  walletAddress: string
}) {
  const dispatch = useDispatch()
  const latestTransactionHistory = useSelector((state: RootState) => state.vaultsdetail.latestTransactionHistory)
  const isLoadingLatestTransactionHistory = useSelector(
    (state: RootState) => state.vaultsdetail.isLoadingLatestTransactionHistory,
  )
  const { data, isLoading, refetch } = useGetVaultLatestTransactionHistoryQuery(
    {
      vaultId,
      walletAddress,
      type,
    },
    {
      skip: !vaultId || !walletAddress,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data) {
      dispatch(updateLatestTransactionHistory(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingLatestTransactionHistory(isLoading))
  }, [isLoading, dispatch])

  return {
    latestTransactionHistory,
    isLoadingLatestTransactionHistory,
    refetch,
  }
}
