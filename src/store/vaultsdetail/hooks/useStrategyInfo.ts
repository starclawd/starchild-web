import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { RootState } from 'store'
import { updateStrategyInfo, setLoadingStrategyInfo } from '../reducer'
import { useGetStrategyPerformanceQuery, useLazyGetStrategyPerformanceQuery } from 'api/strategy'

export function useStrategyInfo({ strategyId }: { strategyId: string | null }) {
  const dispatch = useDispatch()
  const strategyInfo = useSelector((state: RootState) => state.vaultsdetail.strategyInfo)
  const isLoadingStrategyInfo = useSelector((state: RootState) => state.vaultsdetail.isLoadingStrategyInfo)

  const { data, isLoading, error, refetch } = useGetStrategyPerformanceQuery(
    {
      strategy_id: strategyId || '',
      period: 'all',
    },
    {
      skip: !strategyId,
      refetchOnMountOrArgChange: true,
    },
  )

  const [getStrategyPerformance, { isLoading: isLazyLoading }] = useLazyGetStrategyPerformanceQuery()

  const fetchStrategyInfo = useCallback(
    async (id?: string) => {
      const targetId = id || strategyId
      if (!targetId) return
      try {
        dispatch(setLoadingStrategyInfo(true))
        const result = await getStrategyPerformance({ strategy_id: targetId, period: 'all' }).unwrap()
        if (result) {
          dispatch(updateStrategyInfo(result))
        }
      } catch (err) {
        console.error('Fetch strategy info failed:', err)
        dispatch(updateStrategyInfo(null))
      } finally {
        dispatch(setLoadingStrategyInfo(false))
      }
    },
    [getStrategyPerformance, strategyId, dispatch],
  )

  useEffect(() => {
    if (data) {
      dispatch(updateStrategyInfo(data))
    } else if (error) {
      dispatch(updateStrategyInfo(null))
    }
  }, [data, error, dispatch])

  useEffect(() => {
    dispatch(setLoadingStrategyInfo(isLoading))
  }, [isLoading, dispatch])

  return {
    strategyInfo,
    isLoadingStrategyInfo: isLoadingStrategyInfo || isLazyLoading,
    error,
    refetch,
    fetchStrategyInfo,
  }
}
