import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useCallback } from 'react'
import { updateStrategyInfoTabIndex } from '../reducer'
import { STRATEGY_TAB_INDEX } from '../createstrategy'

export function useStrategyInfoTabIndex(): [STRATEGY_TAB_INDEX, (index: STRATEGY_TAB_INDEX) => void] {
  const dispatch = useDispatch()
  const strategyInfoTabIndex = useSelector((state: RootState) => state.createstrategy.strategyInfoTabIndex)
  const setStrategyInfoTabIndex = useCallback(
    (index: STRATEGY_TAB_INDEX) => {
      dispatch(updateStrategyInfoTabIndex(index))
    },
    [dispatch],
  )
  return [strategyInfoTabIndex, setStrategyInfoTabIndex]
}
