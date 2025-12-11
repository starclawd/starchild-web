import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import MoveTabList from 'components/MoveTabList'
import { useStrategyInfoTabIndex } from 'store/createstrategy/hooks/useTabIndex'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/themecache/hooks'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
  width: 100%;
  height: 44px;
`

const TabListWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
`

const DeployButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 96px;
  height: 44px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
  border-radius: 32px;
  color: ${({ theme }) => theme.textDark98};
  background: ${({ theme }) => theme.brand200};
`

export default function Header() {
  const theme = useTheme()
  const [strategyInfoTabIndex, setStrategyInfoTabIndex] = useStrategyInfoTabIndex()
  const handleTabClick = useCallback(
    (index: number) => {
      return () => {
        setStrategyInfoTabIndex(index)
      }
    },
    [setStrategyInfoTabIndex],
  )
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Create</Trans>,
        clickCallback: handleTabClick(0),
      },
      {
        key: 1,
        text: <Trans>Code</Trans>,
        clickCallback: handleTabClick(1),
      },
      {
        key: 2,
        text: <Trans>Backtest</Trans>,
        clickCallback: handleTabClick(2),
      },
      {
        key: 3,
        text: <Trans>Paper Trading</Trans>,
        clickCallback: handleTabClick(3),
      },
    ]
  }, [handleTabClick])
  return (
    <HeaderWrapper>
      <TabListWrapper>
        <MoveTabList activeIndicatorBackground={theme.text20} tabIndex={strategyInfoTabIndex} tabList={tabList} />
      </TabListWrapper>
      <DeployButton>
        <Trans>Deploy</Trans>
      </DeployButton>
    </HeaderWrapper>
  )
}
