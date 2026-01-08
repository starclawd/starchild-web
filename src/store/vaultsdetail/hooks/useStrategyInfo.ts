import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from 'store'
import { updateStrategyInfo, setLoadingStrategyInfo } from '../reducer'
import { useGetStrategyPerformanceQuery } from 'api/strategy'

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
    isLoadingStrategyInfo,
    error,
    refetch,
  }
}
