import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { setChartStrategyId as setChartStrategyIdAction } from '../reducer'
import { ParamFun } from 'types/global'

export function useChartStrategyId(): [string | null, ParamFun<string | null>] {
  const dispatch = useDispatch()
  const chartStrategyId = useSelector((state: RootState) => state.mystrategy.chartStrategyId)
  const setChartStrategyId = useCallback(
    (strategyId: string | null) => {
      dispatch(setChartStrategyIdAction(strategyId))
    },
    [dispatch],
  )
  return [chartStrategyId, setChartStrategyId]
}
