import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateVaultInfo, setLoadingVaultInfo, updateVaultLpInfo } from '../reducer'
import { useGetVaultInfoQuery, useGetVaultLpInfoQuery } from 'api/vaults'
import type { VaultInfo, VaultLpInfo } from 'api/vaults'
import { ParamFun } from 'types/global'

/**
 * Hook for vault info - returns vault info and setter
 */
export function useVaultInfo(): [VaultInfo | null, ParamFun<VaultInfo | null>] {
  const dispatch = useDispatch()
  const vaultInfo = useSelector((state: RootState) => state.vaultsdetail.vaultInfo)

  const setVaultInfo = useCallback(
    (value: VaultInfo | null) => {
      dispatch(updateVaultInfo(value))
    },
    [dispatch],
  )

  return [vaultInfo, setVaultInfo]
}

/**
 * Hook to fetch and update vault info based on currentVaultId
 */
export function useFetchVaultInfo() {
  const dispatch = useDispatch()
  const currentVaultId = useSelector((state: RootState) => state.vaultsdetail.currentVaultId)
  const isLoadingVaultInfo = useSelector((state: RootState) => state.vaultsdetail.isLoadingVaultInfo)

  const { data, isLoading, error, refetch } = useGetVaultInfoQuery(
    { vault_id: currentVaultId || undefined },
    {
      skip: !currentVaultId,
    },
  )

  useEffect(() => {
    if (data !== undefined) {
      if (data.length > 0) {
        dispatch(updateVaultInfo(data[0]))
      } else {
        dispatch(updateVaultInfo(null))
      }
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingVaultInfo(isLoading))
  }, [isLoading, dispatch])

  return { data, isLoading: isLoadingVaultInfo, error, refetch }
}

export function useFetchVaultLpInfo({ walletAddress, vaultId }: { walletAddress: string; vaultId: string }) {
  const dispatch = useDispatch()
  const [, setVaultLpInfo] = useVaultLpInfo()
  const isLoadingVaultLpInfo = useSelector((state: RootState) => state.vaultsdetail.isLoadingVaultLpInfo)

  const { data, isLoading, error, refetch } = useGetVaultLpInfoQuery(
    { walletAddress, vaultId },
    {
      skip: !walletAddress || !vaultId,
    },
  )

  useEffect(() => {
    if (data !== undefined) {
      if (data.length > 0) {
        setVaultLpInfo(data[0])
      } else {
        setVaultLpInfo(null)
      }
    }
  }, [data, setVaultLpInfo])

  useEffect(() => {
    dispatch(setLoadingVaultInfo(isLoading))
  }, [isLoading, dispatch])

  return { data, isLoading: isLoadingVaultLpInfo, error, refetch }
}

export function useVaultLpInfo(): [VaultLpInfo | null, ParamFun<VaultLpInfo | null>] {
  const dispatch = useDispatch()
  const vaultLpInfo = useSelector((state: RootState) => state.vaultsdetail.vaultLpInfo)

  const setVaultLpInfo = useCallback(
    (value: VaultLpInfo | null) => {
      dispatch(updateVaultLpInfo(value))
    },
    [dispatch],
  )

  return [
    vaultLpInfo || {
      vault_id: '',
      lp_nav: 0,
      lp_tvl: 0,
      total_main_shares: 0,
      available_main_shares: 0,
      potential_pnl: 0,
      total_performance_fees: 0,
    },
    setVaultLpInfo,
  ]
}
