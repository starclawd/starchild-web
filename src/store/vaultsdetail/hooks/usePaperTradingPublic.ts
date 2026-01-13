import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import type { RootState } from 'store'
import { useGetPaperTradingCurrentPublicQuery, useLazyGetPaperTradingCurrentPublicQuery } from 'api/createStrategy'
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
  const [triggerGetPaperTradingCurrentPublic] = useLazyGetPaperTradingCurrentPublicQuery()

  const fetchPaperTradingPublic = useCallback(
    async (id: string) => {
      try {
        const result = await triggerGetPaperTradingCurrentPublic({ strategy_id: id })
        if (result.data?.status === 'success') {
          dispatch(updatePaperTradingPublicData(result.data.data))
        }
        return result
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerGetPaperTradingCurrentPublic, dispatch],
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
    fetchPaperTradingPublic,
  }
}
