import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect } from 'react'
import { useGetVaultLpInfoQuery } from 'api/vaults'
import { setLoadingVaultLpInfoList, updateVaultLpInfoList, updateVaultLpInfo, setLoadingVaultLpInfo } from '../reducer'

export function useVaultLpInfoList({ walletAddress }: { walletAddress: string }) {
  const dispatch = useDispatch()
  const vaultLpInfoList = useSelector((state: RootState) => state.portfolio.vaultLpInfoList)
  const isLoadingVaultLpInfoList = useSelector((state: RootState) => state.portfolio.isLoadingVaultLpInfoList)

  const { data, isLoading, error, refetch } = useGetVaultLpInfoQuery(
    { walletAddress },
    {
      skip: !walletAddress,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data !== undefined) {
      if (data.length > 0) {
        dispatch(updateVaultLpInfoList(data))
      } else {
        dispatch(updateVaultLpInfoList([]))
      }
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingVaultLpInfoList(isLoading))
  }, [isLoading, dispatch])

  return { vaultLpInfoList, isLoadingVaultLpInfoList, error, refetch }
}

export function useVaultLpInfo({ walletAddress, vaultId }: { walletAddress: string; vaultId: string }) {
  const dispatch = useDispatch()
  const vaultLpInfo = useSelector((state: RootState) => state.portfolio.vaultLpInfo)
  const isLoadingVaultLpInfo = useSelector((state: RootState) => state.portfolio.isLoadingVaultLpInfo)

  const { data, isLoading, error, refetch } = useGetVaultLpInfoQuery(
    { walletAddress, vaultId },
    {
      skip: !walletAddress || !vaultId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        dispatch(updateVaultLpInfo(data[0]))
      } else {
        dispatch(updateVaultLpInfo(null))
      }
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingVaultLpInfo(isLoading))
  }, [isLoading, dispatch])

  return {
    vaultLpInfo: vaultLpInfo || {
      vault_id: '',
      lp_nav: 0,
      lp_tvl: 0,
      total_main_shares: 0,
      available_main_shares: 0,
      potential_pnl: 0,
      total_performance_fees: 0,
    },
    isLoadingVaultLpInfo,
    error,
    refetch,
  }
}
