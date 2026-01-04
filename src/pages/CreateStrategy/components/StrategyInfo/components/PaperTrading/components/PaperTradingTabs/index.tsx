import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import { ButtonCommon } from 'components/Button'
import TabList from 'components/TabList'
import Pending from 'components/Pending'
import PaperTradingPerformance from 'pages/VaultDetail/components/PaperTradingPerformance'
import PaperTradingRunPause from './components/PaperTradingRunPause'
import { useHandleStartPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { useIsStep3Deploying } from 'store/createstrategy/hooks/useDeployment'
import useParsedQueryString from 'hooks/useParsedQueryString'
import {
  VaultOpenOrders,
  VaultOrderHistory,
  VaultPositions,
} from 'pages/VaultDetail/components/VaultPositionsOrders/components'
import VaultChatArea from 'pages/VaultDetail/components/VaultChatArea'
import ScrollPageContent from 'components/ScrollPageContent'

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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0;
`

const RestartButton = styled(ButtonCommon)`
  width: fit-content;
  min-width: 80px;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 0 12px;
  border-radius: 0;
  border-top: none;
  border-left: 1px solid ${({ theme }) => theme.black600};
  color: ${({ theme }) => theme.textL3};
  background: ${({ theme }) => theme.black900};
  gap: 4px;

  .icon-arrow-loading {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.black800};
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
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const isStep3Deploying = useIsStep3Deploying(strategyId || '')

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
        text: <Trans>Positions</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.POSITIONS),
      },
      {
        key: PAPER_TRADING_TAB_KEY.ORDERS,
        icon: <IconBase className='icon-orders' />,
        text: <Trans>Orders</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.ORDERS),
      },
      {
        key: PAPER_TRADING_TAB_KEY.ORDER_HISTORY,
        icon: <IconBase className='icon-orders' />,
        text: <Trans>Order History</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.ORDER_HISTORY),
      },
    ]
  }, [handleTabClick])

  const handleRestart = useCallback(() => {
    if (isStep3Deploying) {
      return
    }
    handleStartPaperTrading()
  }, [handleStartPaperTrading, isStep3Deploying])

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
        <ButtonWrapper>
          <PaperTradingRunPause />
          <RestartButton $disabled={isStep3Deploying} onClick={handleRestart}>
            <IconBase className='icon-arrow-loading' />
            <Trans>Restart</Trans>
          </RestartButton>
        </ButtonWrapper>
      </TabsHeader>
      <TabContent>
        <ScrollPageContent className='paper-trading-scroll'>{renderTabContent()}</ScrollPageContent>
      </TabContent>
    </PaperTradingTabsWrapper>
  )
})
