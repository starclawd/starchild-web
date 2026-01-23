import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import Transactions from './components/Transactions'
import { Trans } from '@lingui/react/macro'
import Performance from './components/Performance'
import TabList, { TAB_TYPE } from 'components/TabList'
import { IconBase } from 'components/Icons'
import MyVaults from './components/MyVaults'
import MyStrategies from './components/MyStrategies'
import { useMyStrategyTabKey, useMyPortfolioActiveTab } from 'store/mystrategycache/hooks'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import { MY_PORTFOLIO_TAB_KEY, STRATEGY_TAB_KEY } from 'store/mystrategycache/mystrategycache'
import { WALLET_CONNECT_MODE } from 'store/vaults/vaults'

const MyPortfolioWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const InnerContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1220px;
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
  .tab-list-all {
    height: 48px;
    .tab-item {
      padding: 0;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      i {
        font-size: 24px;
      }
    }
  }
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
  border-left: 1px solid ${({ theme }) => theme.black800};
`

const RightTop = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 146px;
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const LeftBottomContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 40px 20px;
`

export default memo(function MyPortfolio() {
  const [activeTab, setActiveTab] = useMyPortfolioActiveTab()
  const [strategyTabKey, setStrategyTabKey] = useMyStrategyTabKey()
  const { myStrategies } = useMyStrategies()
  const releasedLen = myStrategies.filter(
    (strategy) => strategy.status === STRATEGY_STATUS.DEPLOYED || strategy.status === STRATEGY_STATUS.PAUSED,
  ).length
  const unreleasedLen = myStrategies.filter(
    (strategy) =>
      strategy.status === STRATEGY_STATUS.DRAFT ||
      strategy.status === STRATEGY_STATUS.DRAFT_READY ||
      strategy.status === STRATEGY_STATUS.DEPLOYING ||
      strategy.status === STRATEGY_STATUS.PAPER_TRADING,
  ).length
  const archivedLen = myStrategies.filter(
    (strategy) => strategy.status === STRATEGY_STATUS.DELISTED || strategy.status === STRATEGY_STATUS.ARCHIVED,
  ).length
  const tabList = useMemo(() => {
    return [
      {
        key: MY_PORTFOLIO_TAB_KEY.VAULT,
        icon: <IconBase className='icon-my-vault' />,
        text: <Trans>My vaults portfolio</Trans>,
        clickCallback: () => setActiveTab(MY_PORTFOLIO_TAB_KEY.VAULT),
      },
      {
        key: MY_PORTFOLIO_TAB_KEY.STRATEGY,
        icon: <IconBase className='icon-my-strategy' />,
        text: <Trans>My strategies</Trans>,
        clickCallback: () => setActiveTab(MY_PORTFOLIO_TAB_KEY.STRATEGY),
      },
    ]
  }, [setActiveTab])
  const strategyTabList = useMemo(() => {
    return [
      {
        key: STRATEGY_TAB_KEY.LAUNCHED,
        text: (
          <span>
            <Trans>Launched</Trans>({releasedLen})
          </span>
        ),
        clickCallback: () => setStrategyTabKey(STRATEGY_TAB_KEY.LAUNCHED),
      },
      {
        key: STRATEGY_TAB_KEY.DRAFT,
        text: (
          <span>
            <Trans>Draft</Trans>({unreleasedLen})
          </span>
        ),
        clickCallback: () => setStrategyTabKey(STRATEGY_TAB_KEY.DRAFT),
      },
      {
        key: STRATEGY_TAB_KEY.ARCHIVED,
        text: (
          <span>
            <Trans>Archived</Trans>({archivedLen})
          </span>
        ),
        clickCallback: () => setStrategyTabKey(STRATEGY_TAB_KEY.ARCHIVED),
      },
    ]
  }, [releasedLen, archivedLen, unreleasedLen, setStrategyTabKey])
  return (
    <MyPortfolioWrapper>
      <InnerContent>
        <LeftContent className='transparent-scroll-style'>
          <LeftTopContent>
            <Title>
              <Trans>My portfolio</Trans>
            </Title>
            <Performance />
            <TabListWrapper>
              <TabList className='tab-list-all' gap={20} tabKey={activeTab} tabList={tabList} />
              {activeTab === MY_PORTFOLIO_TAB_KEY.STRATEGY && (
                <TabList
                  className='tab-list-strategy'
                  tabKey={strategyTabKey}
                  tabList={strategyTabList}
                  tabType={TAB_TYPE.SIMPLE}
                />
              )}
            </TabListWrapper>
          </LeftTopContent>
          <LeftBottomContent>
            {activeTab === MY_PORTFOLIO_TAB_KEY.VAULT && <MyVaults />}
            {activeTab === MY_PORTFOLIO_TAB_KEY.STRATEGY && <MyStrategies />}
          </LeftBottomContent>
        </LeftContent>
        <RightContent>
          <RightTop>
            <VaultsWalletConnect mode={WALLET_CONNECT_MODE.EXPAND} />
          </RightTop>
          <Transactions />
        </RightContent>
      </InnerContent>
    </MyPortfolioWrapper>
  )
})
