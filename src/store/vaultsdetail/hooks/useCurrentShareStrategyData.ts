import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { StrategiesOverviewDataType } from 'api/strategy'
import { ParamFun } from 'types/global'
import { updateCurrentShareStrategyData } from '../reducer'

export function useCurrentShareStrategyData(): [
  StrategiesOverviewDataType | null,
  ParamFun<StrategiesOverviewDataType | null>,
] {
  const dispatch = useDispatch()
  const currentShareStrategyData = useSelector((state: RootState) => state.vaultsdetail.currentShareStrategyData)
  const setCurrentShareStrategyData = useCallback(
    (data: StrategiesOverviewDataType | null) => {
      dispatch(updateCurrentShareStrategyData(data))
    },
    [dispatch],
  )
  return [currentShareStrategyData, setCurrentShareStrategyData]
}
