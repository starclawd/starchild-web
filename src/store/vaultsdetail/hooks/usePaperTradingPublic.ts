import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import type { RootState } from 'store'
import { useGetPaperTradingCurrentPublicQuery } from 'api/createStrategy'
import { updatePaperTradingPublicData, setLoadingPaperTradingPublic } from '../reducer'

export function usePaperTradingPublic({ strategyId }: { strategyId: string }) {
  const dispatch = useDispatch()
  const paperTradingPublicData = useSelector((state: RootState) => state.vaultsdetail.paperTradingPublicData)
  const isLoadingPaperTradingPublic = useSelector((state: RootState) => state.vaultsdetail.isLoadingPaperTradingPublic)

  const { data, isLoading, error, refetch } = useGetPaperTradingCurrentPublicQuery(
    { strategy_id: strategyId },
    {
      skip: !strategyId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updatePaperTradingPublicData(data.data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingPaperTradingPublic(isLoading))
  }, [isLoading, dispatch])

  return {
    paperTradingPublicData,
    isLoadingPaperTradingPublic,
    error,
    refetch,
  }
}
