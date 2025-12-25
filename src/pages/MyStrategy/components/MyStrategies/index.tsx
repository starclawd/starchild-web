import { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import TabList from './components/TabList'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Pending from 'components/Pending'
import StrategyItem from './components/StrategyItem'
import NoData from 'components/NoData'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy.d'
import { StrategiesOverviewStrategy } from 'api/strategy'

const MyStrategiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const StrategiesListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 135px;
`

export default memo(function MyStrategies() {
  const { myStrategies, isLoadingMyStrategies } = useMyStrategies()
  const [tabIndex, setTabIndex] = useState(0)
  const hasInitialized = useRef(false)

  // 过滤策略的工具函数
  const filterStrategiesByTab = useCallback((strategies: StrategiesOverviewStrategy[], tabIndex: number) => {
    switch (tabIndex) {
      case 0: // Released
        return strategies.filter(
          (strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED || strategy.status === STRATEGY_STATUS.PAUSED,
        )
      case 1: // Unreleased
        return strategies.filter(
          (strategy) =>
            strategy.status === STRATEGY_STATUS.DRAFT ||
            strategy.status === STRATEGY_STATUS.DRAFT_READY ||
            strategy.status === STRATEGY_STATUS.DEPLOYING,
        )
      case 2: // Delisted
        return strategies.filter(
          (strategy) => strategy.status === STRATEGY_STATUS.DELISTED || strategy.status === STRATEGY_STATUS.ARCHIVED,
        )
      default:
        return strategies
    }
  }, [])

  const filteredStrategies = useMemo(
    () => filterStrategiesByTab(myStrategies, tabIndex),
    [filterStrategiesByTab, myStrategies, tabIndex],
  )

  // 计算各tab的策略数量
  const releasedCount = useMemo(
    () => filterStrategiesByTab(myStrategies, 0).length,
    [filterStrategiesByTab, myStrategies],
  )
  const unreleasedCount = useMemo(
    () => filterStrategiesByTab(myStrategies, 1).length,
    [filterStrategiesByTab, myStrategies],
  )

  // 初始状态自动切换tab：如果Released为空但Unreleased不为空，则切换到Unreleased tab
  useEffect(() => {
    if (!hasInitialized.current && releasedCount === 0 && unreleasedCount > 0 && tabIndex === 0) {
      setTabIndex(1)
      hasInitialized.current = true
    } else if (!hasInitialized.current && (releasedCount !== 0 || unreleasedCount !== 0)) {
      // 标记为已初始化，即使不需要切换tab
      hasInitialized.current = true
    }
  }, [releasedCount, unreleasedCount, tabIndex])

  const handleTabChange = useCallback((index: number) => {
    setTabIndex(index)
  }, [])

  return (
    <MyStrategiesWrapper>
      <TabList tabIndex={tabIndex} onTabChange={handleTabChange} />
      <StrategiesListWrapper>
        {isLoadingMyStrategies ? (
          <Pending isNotButtonLoading />
        ) : filteredStrategies.length > 0 ? (
          filteredStrategies.map((strategy) => <StrategyItem key={strategy.strategy_id} strategy={strategy} />)
        ) : (
          <NoData />
        )}
      </StrategiesListWrapper>
    </MyStrategiesWrapper>
  )
})
