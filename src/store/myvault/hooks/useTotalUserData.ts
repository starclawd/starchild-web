import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect } from 'react'
import { useGetVaultsTotalUserDataQuery } from 'api/strategy'
import { updateTotalUserData, setLoadingTotalUserData } from '../reducer'

export function useTotalUserData({ walletAddress }: { walletAddress: string }) {
  const dispatch = useDispatch()
  const totalUserData = useSelector((state: RootState) => state.myvault.totalUserData)
  const isLoadingTotalUserData = useSelector((state: RootState) => state.myvault.isLoadingTotalUserData)

  const { data, isLoading, error, refetch } = useGetVaultsTotalUserDataQuery(
    { walletAddress },
    {
      skip: !walletAddress,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data !== undefined) {
      dispatch(updateTotalUserData(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingTotalUserData(isLoading))
  }, [isLoading, dispatch])

  return { totalUserData, isLoadingTotalUserData, error, refetch }
}
