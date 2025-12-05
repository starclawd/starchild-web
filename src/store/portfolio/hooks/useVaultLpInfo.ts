import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect } from 'react'
import { useGetVaultLpInfoQuery } from 'api/vaults'
import { setLoadingVaultLpInfoList, updateVaultLpInfoList } from '../reducer'

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
