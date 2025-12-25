import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import TabList from './components/TabList'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { useMyStrategyTabIndex } from 'store/mystrategycache/hooks'
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
  const [tabIndex, setTabIndex] = useMyStrategyTabIndex()

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

  const handleTabChange = useCallback(
    (index: number) => {
      setTabIndex(index)
    },
    [setTabIndex],
  )

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
