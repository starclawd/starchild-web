import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import { ButtonCommon } from 'components/Button'
import TabList from 'components/TabList'
import Pending from 'components/Pending'
import PaperTradingPerformance from 'pages/VaultDetail/components/PaperTradingPerformance'
import PaperTradingButtonWrapper from '../PaperTradingButtonWrapper'
import useParsedQueryString from 'hooks/useParsedQueryString'
import {
  VaultOpenOrders,
  VaultOrderHistory,
  VaultPositions,
} from 'pages/VaultDetail/components/VaultPositionsOrders/components'
import VaultChatArea from 'pages/VaultDetail/components/VaultChatArea'
import ScrollPageContent from 'components/ScrollPageContent'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
import { useStrategyOrderHistoryPaginated } from 'store/vaultsdetail/hooks/useStrategyOrderHistory'

const PaperTradingTabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.black600};

  .tab-item {
    border-right: 1px solid ${({ theme }) => theme.black600};
  }
`

const TabContent = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;

  .paper-trading-scroll {
    padding: 0;
  }
`

const TabPanel = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  width: 100%;
  height: 100%;
`

enum PAPER_TRADING_TAB_KEY {
  PERFORMANCE = 'performance',
  SIGNALS = 'signals',
  POSITIONS = 'positions',
  ORDERS = 'orders',
  ORDER_HISTORY = 'orderHistory',
}

export default memo(function PaperTradingTabs() {
  const { strategyId } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState(PAPER_TRADING_TAB_KEY.PERFORMANCE)

  // 获取数据统计信息用于显示Tab标题
  const { totalCount: totalStrategyPositions } = useStrategyPositions(strategyId || '')
  const { totalCount: totalStrategyOrders } = useStrategyOpenOrdersPaginated(strategyId || '')
  const { totalCount: totalStrategyHistory } = useStrategyOrderHistoryPaginated(strategyId || '')

  const handleTabClick = useCallback((key: PAPER_TRADING_TAB_KEY) => {
    setActiveTab(key)
  }, [])

  const tabList = useMemo(() => {
    return [
      {
        key: PAPER_TRADING_TAB_KEY.PERFORMANCE,
        icon: <IconBase className='icon-performance' />,
        text: <Trans>Performance</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.PERFORMANCE),
      },
      {
        key: PAPER_TRADING_TAB_KEY.SIGNALS,
        icon: <IconBase className='icon-signals' />,
        text: <Trans>Signals</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.SIGNALS),
      },
      {
        key: PAPER_TRADING_TAB_KEY.POSITIONS,
        icon: <IconBase className='icon-positions' />,
        text: <Trans>Positions{totalStrategyPositions > 0 && ` (${totalStrategyPositions})`}</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.POSITIONS),
      },
      {
        key: PAPER_TRADING_TAB_KEY.ORDERS,
        icon: <IconBase className='icon-orders' />,
        text: <Trans>Orders{totalStrategyOrders > 0 && ` (${totalStrategyOrders})`}</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.ORDERS),
      },
      {
        key: PAPER_TRADING_TAB_KEY.ORDER_HISTORY,
        icon: <IconBase className='icon-orders' />,
        text: <Trans>Order History{totalStrategyHistory > 0 && ` (${totalStrategyHistory})`}</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.ORDER_HISTORY),
      },
    ]
  }, [handleTabClick, totalStrategyPositions, totalStrategyOrders, totalStrategyHistory])

  const renderTabContent = useCallback(() => {
    return (
      <>
        <TabPanel $isActive={activeTab === PAPER_TRADING_TAB_KEY.PERFORMANCE}>
          <PaperTradingPerformance activeTab='strategy' vaultId='' strategyId={strategyId || ''} />
        </TabPanel>
        <TabPanel $isActive={activeTab === PAPER_TRADING_TAB_KEY.SIGNALS}>
          <VaultChatArea strategyId={strategyId || ''} />
        </TabPanel>
        <TabPanel $isActive={activeTab === PAPER_TRADING_TAB_KEY.POSITIONS}>
          <VaultPositions activeTab='strategy' vaultId={''} strategyId={strategyId || ''} />
        </TabPanel>
        <TabPanel $isActive={activeTab === PAPER_TRADING_TAB_KEY.ORDERS}>
          <VaultOpenOrders activeTab='strategy' vaultId={''} strategyId={strategyId || ''} />
        </TabPanel>
        <TabPanel $isActive={activeTab === PAPER_TRADING_TAB_KEY.ORDER_HISTORY}>
          <VaultOrderHistory activeTab='strategy' vaultId={''} strategyId={strategyId || ''} />
        </TabPanel>
      </>
    )
  }, [activeTab, strategyId])

  return (
    <PaperTradingTabsWrapper>
      <TabsHeader>
        <TabList tabKey={activeTab} tabList={tabList} />
        <PaperTradingButtonWrapper />
      </TabsHeader>
      <TabContent>
        <ScrollPageContent className='paper-trading-scroll'>{renderTabContent()}</ScrollPageContent>
      </TabContent>
    </PaperTradingTabsWrapper>
  )
})
