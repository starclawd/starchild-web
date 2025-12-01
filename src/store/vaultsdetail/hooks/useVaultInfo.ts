import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateVaultInfo, setLoadingVaultInfo } from '../reducer'
import { useGetVaultInfoQuery } from 'api/vaults'
import type { VaultInfo } from 'api/vaults'
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
