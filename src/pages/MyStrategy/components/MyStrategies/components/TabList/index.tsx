import { Trans } from '@lingui/react/macro'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { memo, useMemo } from 'react'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { MyStrategyDataType } from 'store/mystrategy/mystrategy'
import styled from 'styled-components'

const TabListWrapper = styled.div`
  display: flex;
  height: 34px;
  .tab-list-wrapper {
    height: 34px;
    .move-tab-item {
      height: 32px;
    }
    .active-indicator {
      border-bottom: 2px solid ${({ theme }) => theme.textL1};
    }
  }
`

interface TabListProps {
  tabIndex: number
  onTabChange: (index: number) => void
}

export default memo(function TabList({ tabIndex, onTabChange }: TabListProps) {
  const { myStrategies } = useMyStrategies()
  const tabList = useMemo(() => {
    const releasedLen = myStrategies.filter(
      (strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED || strategy.status === STRATEGY_STATUS.PAUSED,
    ).length
    const unreleasedLen = myStrategies.filter(
      (strategy) =>
        strategy.status === STRATEGY_STATUS.DRAFT ||
        strategy.status === STRATEGY_STATUS.DRAFT_READY ||
        strategy.status === STRATEGY_STATUS.DEPLOYING,
    ).length
    return [
      {
        key: 0,
        text: (
          <span>
            <Trans>Launched</Trans>({releasedLen})
          </span>
        ),
        clickCallback: () => onTabChange(0),
      },
      {
        key: 1,
        text: (
          <span>
            <Trans>Draft</Trans>({unreleasedLen})
          </span>
        ),
        clickCallback: () => onTabChange(1),
      },
      {
        key: 2,
        text: <Trans>Archived</Trans>,
        clickCallback: () => onTabChange(2),
      },
    ]
  }, [myStrategies, onTabChange])

  return (
    <TabListWrapper>
      <MoveTabList moveType={MoveType.LINE} tabKey={tabIndex} tabList={tabList} />
    </TabListWrapper>
  )
})
