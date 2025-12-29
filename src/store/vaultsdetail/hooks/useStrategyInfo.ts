import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { RootState } from 'store'
import { updateStrategyInfo, setLoadingStrategyInfo } from '../reducer'
import { useGetStrategyPerformanceQuery } from 'api/strategy'

export function useStrategyInfo() {
  const strategyInfo = useSelector((state: RootState) => state.vaultsdetail.strategyInfo)
  const isLoadingStrategyInfo = useSelector((state: RootState) => state.vaultsdetail.isLoadingStrategyInfo)

  return [strategyInfo, isLoadingStrategyInfo] as const
}

export function useFetchStrategyInfo(strategyId: string | null) {
  const dispatch = useDispatch()

  const { data, isLoading, error } = useGetStrategyPerformanceQuery(
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

  return { error }
}
