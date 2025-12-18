import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { setChartType as setChartTypeAction } from '../reducer'
import { ParamFun } from 'types/global'
import { VaultChartType } from 'store/vaultsdetail/vaultsdetail'

export function useChartType(): [VaultChartType, ParamFun<VaultChartType>] {
  const dispatch = useDispatch()
  const chartType = useSelector((state: RootState) => state.myvault.chartType)
  const setChartType = useCallback(
    (type: VaultChartType) => {
      dispatch(setChartTypeAction(type))
    },
    [dispatch],
  )
  return [chartType, setChartType]
}
