import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { setChartTimeRange as setChartTimeRangeAction, VaultChartTimeRange } from '../reducer'
import { ParamFun } from 'types/global'

export function useChartTimeRange(): [VaultChartTimeRange, ParamFun<VaultChartTimeRange>] {
  const dispatch = useDispatch()
  const chartTimeRange = useSelector((state: RootState) => state.myvault.chartTimeRange)
  const setChartTimeRange = useCallback(
    (timeRange: VaultChartTimeRange) => {
      dispatch(setChartTimeRangeAction(timeRange))
    },
    [dispatch],
  )
  return [chartTimeRange, setChartTimeRange]
}
