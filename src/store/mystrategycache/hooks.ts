import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { setStrategyTabKey, setActiveTab } from './reducer'
import { MY_PORTFOLIO_TAB_KEY, STRATEGY_TAB_KEY } from './mystrategycache'

// 获取和更新MyStrategy页面的tab
export function useMyStrategyTabKey(): [STRATEGY_TAB_KEY, (key: STRATEGY_TAB_KEY) => void] {
  const dispatch = useDispatch()
  const strategyTabKey = useSelector((state: RootState) => state.mystrategycache.strategyTabKey)

  const updateStrategyTabKey = useCallback(
    (key: STRATEGY_TAB_KEY) => {
      dispatch(setStrategyTabKey(key))
    },
    [dispatch],
  )

  return [strategyTabKey, updateStrategyTabKey]
}

// 获取和更新MyPortfolio页面的activeTab
export function useMyPortfolioActiveTab(): [MY_PORTFOLIO_TAB_KEY, (tab: MY_PORTFOLIO_TAB_KEY) => void] {
  const dispatch = useDispatch()
  const activeTab = useSelector((state: RootState) => state.mystrategycache.activeTab)

  const updateActiveTab = useCallback(
    (tab: MY_PORTFOLIO_TAB_KEY) => {
      dispatch(setActiveTab(tab))
    },
    [dispatch],
  )

  return [activeTab, updateActiveTab]
}
