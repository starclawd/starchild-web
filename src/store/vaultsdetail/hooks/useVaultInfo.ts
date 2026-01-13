import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateVaultInfo, setLoadingVaultInfo } from '../reducer'
import { useGetVaultInfoQuery } from 'api/vaults'

/**
 * Hook for vault info - fetches and returns vault info
 */
export function useVaultInfo({ vaultId }: { vaultId: string | null }) {
  const dispatch = useDispatch()
  const vaultInfo = useSelector((state: RootState) => state.vaultsdetail.vaultInfo)
  const isLoadingVaultInfo = useSelector((state: RootState) => state.vaultsdetail.isLoadingVaultInfo)

  const { data, isLoading, error, refetch } = useGetVaultInfoQuery(
    { vault_id: vaultId || undefined },
    {
      skip: !vaultId,
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

  return {
    vaultInfo,
    isLoadingVaultInfo,
    error,
    refetch,
  }
}
