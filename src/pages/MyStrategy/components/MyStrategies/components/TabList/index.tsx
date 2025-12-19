import { Trans } from '@lingui/react/macro'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { memo, useMemo } from 'react'
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
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Released</Trans>,
        clickCallback: () => onTabChange(0),
      },
      {
        key: 1,
        text: <Trans>Unreleased</Trans>,
        clickCallback: () => onTabChange(1),
      },
      {
        key: 2,
        text: <Trans>Delisted</Trans>,
        clickCallback: () => onTabChange(2),
      },
    ]
  }, [onTabChange])

  return (
    <TabListWrapper>
      <MoveTabList moveType={MoveType.LINE} tabIndex={tabIndex} tabList={tabList} />
    </TabListWrapper>
  )
})
