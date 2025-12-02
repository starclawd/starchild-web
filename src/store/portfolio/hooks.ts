import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useCallback, useEffect } from 'react'
import { useGetVaultLpInfoQuery, VaultLpInfo } from 'api/vaults'
import { setLoadingVaultLpInfoList, updateVaultLpInfoList } from './reducer'

export function useFetchVaultLpInfoList({ walletAddress }: { walletAddress: string }) {
  const dispatch = useDispatch()
  const [, setVaultLpInfoList] = useVaultLpInfoList()
  const isLoadingVaultLpInfoList = useSelector((state: RootState) => state.portfolio.isLoadingVaultLpInfoList)

  const { data, isLoading, error, refetch } = useGetVaultLpInfoQuery(
    { walletAddress },
    {
      skip: !walletAddress,
    },
  )

  useEffect(() => {
    if (data !== undefined) {
      if (data.length > 0) {
        setVaultLpInfoList(data)
      } else {
        setVaultLpInfoList([])
      }
    }
  }, [data, setVaultLpInfoList])

  useEffect(() => {
    dispatch(setLoadingVaultLpInfoList(isLoading))
  }, [isLoading, dispatch])

  return { data, isLoading: isLoadingVaultLpInfoList, error, refetch }
}

export function useVaultLpInfoList(): [VaultLpInfo[], (vaultLpInfoList: VaultLpInfo[]) => void] {
  const dispatch = useDispatch()
  const vaultLpInfoList = useSelector((state: RootState) => state.portfolio.vaultLpInfoList)
  const setVaultLpInfoList = useCallback(
    (vaultLpInfoList: VaultLpInfo[]) => {
      dispatch(updateVaultLpInfoList(vaultLpInfoList))
    },
    [dispatch],
  )
  return [vaultLpInfoList, setVaultLpInfoList]
}
