import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useCallback } from 'react'
import { updateStrategyInfoTabIndex } from '../reducer'

export function useStrategyInfoTabIndex(): [number, (index: number) => void] {
  const dispatch = useDispatch()
  const strategyInfoTabIndex = useSelector((state: RootState) => state.createStrategy.strategyInfoTabIndex)
  const setStrategyInfoTabIndex = useCallback(
    (index: number) => {
      dispatch(updateStrategyInfoTabIndex(index))
    },
    [dispatch],
  )
  return [strategyInfoTabIndex, setStrategyInfoTabIndex]
}
