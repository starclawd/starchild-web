import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import Transactions from './components/Transactions'
import { Trans } from '@lingui/react/macro'
import Performance from './components/Performance'
import TabList from 'components/TabList'
import { IconBase } from 'components/Icons'
import MyVaults from './components/MyVaults'
import MyStrategies from './components/MyStrategies'
import { useMyStrategyTabIndex } from 'store/mystrategycache/hooks'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

const MyPortfolioWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 400px);
  height: 100%;
`

const LeftTopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  width: 100%;
  padding: 80px 40px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black600};
  .tab-list-all {
    height: 48px;
    gap: 12px;
    .tab-item {
      padding: 0 20px;
      gap: 6px;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      i {
        font-size: 24px;
      }
      &.active {
        color: ${({ theme }) => theme.white};
      }
    }
  }
  .tab-list-strategy {
    height: 24px;
    gap: 4px;
    .tab-item {
      font-size: 11px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }
  }
`

const TabListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Title = styled.div`
  font-size: 64px;
  font-style: normal;
  font-weight: 500;
  line-height: 72px;
  font-family: 'PowerGrotesk';
  color: ${({ theme }) => theme.white};
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 400px;
  border-left: 1px solid ${({ theme }) => theme.black600};
`

const RightTop = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 146px;
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.black600};
`

const LeftBottomContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 40px;
`

enum MY_PORTFOLIO_TAB_KEY {
  VAULTS = 'vaults',
  STRATEGY = 'strategy',
}

export default memo(function MyPortfolio() {
  const [activeTab, setActiveTab] = useState(MY_PORTFOLIO_TAB_KEY.VAULTS)
  const [tabIndex, setTabIndex] = useMyStrategyTabIndex()
  const { myStrategies } = useMyStrategies()
  const releasedLen = myStrategies.filter(
    (strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED || strategy.status === STRATEGY_STATUS.PAUSED,
  ).length
  const unreleasedLen = myStrategies.filter(
    (strategy) =>
      strategy.status === STRATEGY_STATUS.DRAFT ||
      strategy.status === STRATEGY_STATUS.DRAFT_READY ||
      strategy.status === STRATEGY_STATUS.DEPLOYING,
  ).length
  const archivedLen = myStrategies.filter(
    (strategy) => strategy.status === STRATEGY_STATUS.DELISTED || strategy.status === STRATEGY_STATUS.ARCHIVED,
  ).length
  const tabList = useMemo(() => {
    return [
      {
        key: MY_PORTFOLIO_TAB_KEY.VAULTS,
        icon: <IconBase className='icon-my-vault' />,
        text: <Trans>My vaults portfolio</Trans>,
        clickCallback: () => setActiveTab(MY_PORTFOLIO_TAB_KEY.VAULTS),
      },
      {
        key: MY_PORTFOLIO_TAB_KEY.STRATEGY,
        icon: <IconBase className='icon-my-strategy' />,
        text: <Trans>My strategies</Trans>,
        clickCallback: () => setActiveTab(MY_PORTFOLIO_TAB_KEY.STRATEGY),
      },
    ]
  }, [])
  const strategyTabList = useMemo(() => {
    return [
      {
        key: 0,
        text: (
          <span>
            <Trans>Launched</Trans>({releasedLen})
          </span>
        ),
        clickCallback: () => setTabIndex(0),
      },
      {
        key: 1,
        text: (
          <span>
            <Trans>Draft</Trans>({unreleasedLen})
          </span>
        ),
        clickCallback: () => setTabIndex(1),
      },
      {
        key: 2,
        text: (
          <span>
            <Trans>Archived</Trans>({archivedLen})
          </span>
        ),
        clickCallback: () => setTabIndex(2),
      },
    ]
  }, [releasedLen, archivedLen, unreleasedLen, setTabIndex])
  return (
    <MyPortfolioWrapper>
      <LeftContent className='transparent-scroll-style'>
        <LeftTopContent>
          <Title>
            <Trans>My portfolio</Trans>
          </Title>
          <Performance />
          <TabListWrapper>
            <TabList className='tab-list-all' tabKey={activeTab} tabList={tabList} />
            {activeTab === MY_PORTFOLIO_TAB_KEY.STRATEGY && (
              <TabList className='tab-list-strategy' tabKey={tabIndex} tabList={strategyTabList} />
            )}
          </TabListWrapper>
        </LeftTopContent>
        <LeftBottomContent>
          {activeTab === MY_PORTFOLIO_TAB_KEY.VAULTS && <MyVaults />}
          {activeTab === MY_PORTFOLIO_TAB_KEY.STRATEGY && <MyStrategies />}
        </LeftBottomContent>
      </LeftContent>
      <RightContent>
        <RightTop>
          <VaultsWalletConnect />
        </RightTop>
        <Transactions />
      </RightContent>
    </MyPortfolioWrapper>
  )
})
