import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { setChartType as setChartTypeAction } from '../reducer'
import { ParamFun } from 'types/global'
import { CHART_TYPE } from 'store/vaultsdetail/vaultsdetail'

export function useChartType(): [CHART_TYPE, ParamFun<CHART_TYPE>] {
  const dispatch = useDispatch()
  const chartType = useSelector((state: RootState) => state.myvault.chartType)
  const setChartType = useCallback(
    (type: CHART_TYPE) => {
      dispatch(setChartTypeAction(type))
    },
    [dispatch],
  )
  return [chartType, setChartType]
}
