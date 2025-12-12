import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useEffect } from 'react'
import { updateStrategyBacktestData, changeIsLoadingStrategyBacktest } from '../reducer'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useGetStrategyBacktestDataQuery } from 'api/strategyBacktest'

export function useStrategyBacktest() {
  const dispatch = useDispatch()
  const { strategyId } = useParsedQueryString()
  const strategyBacktestData = useSelector((state: RootState) => state.createstrategy.strategyBacktestData)
  const isLoadingStrategyBacktest = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyBacktest)
  const { data, isLoading, error, refetch } = useGetStrategyBacktestDataQuery(
    { strategyId: strategyId || '' },
    {
      skip: !strategyId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data?.result) {
      dispatch(updateStrategyBacktestData(data.result))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(changeIsLoadingStrategyBacktest({ isLoadingStrategyBacktest: isLoading }))
  }, [isLoading, dispatch])

  return {
    strategyBacktestData,
    isLoadingStrategyBacktest,
    error,
    refetch,
  }
}
