import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { setStrategyTabIndex, setLeftWidth, DEFAULT_LEFT_WIDTH } from './reducer'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

// 获取和更新特定策略的tab索引
export function useStrategyTabIndex(strategyId?: string): [STRATEGY_TAB_INDEX, (index: STRATEGY_TAB_INDEX) => void] {
  const dispatch = useDispatch()
  const tabIndex = useSelector((state: RootState) =>
    strategyId ? state.createstrategycache.strategyTabIndexMap[strategyId] : undefined,
  )

  const updateTabIndex = useCallback(
    (index: STRATEGY_TAB_INDEX) => {
      if (strategyId) {
        dispatch(setStrategyTabIndex({ strategyId, tabIndex: index }))
      }
    },
    [dispatch, strategyId],
  )

  // 如果没有缓存的值，返回默认值 CREATE
  const currentTabIndex = tabIndex || STRATEGY_TAB_INDEX.CREATE

  return [currentTabIndex, updateTabIndex]
}

// 获取和更新左侧面板宽度
export function useLeftWidth(): [number, (width: number) => void] {
  const dispatch = useDispatch()
  const leftWidth = useSelector((state: RootState) => state.createstrategycache.leftWidth)

  const updateLeftWidth = useCallback(
    (width: number) => {
      dispatch(setLeftWidth(width))
    },
    [dispatch],
  )

  return [leftWidth ?? DEFAULT_LEFT_WIDTH, updateLeftWidth]
}
