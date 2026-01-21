import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import PaperTradingPerformance from 'pages/VaultDetail/components/PaperTradingPerformance'
import PaperTradingButtonWrapper from '../PaperTradingButtonWrapper'
import useParsedQueryString from 'hooks/useParsedQueryString'
import VaultOrderHistory from 'pages/VaultDetail/components/VaultPositionsOrders/components/VaultOrderHistory'
import VaultPositions from 'pages/VaultDetail/components/VaultPositionsOrders/components/VaultPositions'
import VaultOpenOrders from 'pages/VaultDetail/components/VaultPositionsOrders/components/VaultOpenOrders'
import VaultChatArea from 'pages/VaultDetail/components/VaultChatArea'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
import { useStrategyOrderHistoryPaginated } from 'store/vaultsdetail/hooks/useStrategyOrderHistory'
import MoveTabList from 'components/MoveTabList'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import { PAPER_TRADING_TAB_KEY } from 'store/createstrategy/createstrategy'
import { useWindowSize } from 'hooks/useWindowSize'
import { useIsShowExpandPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import { MEDIA_WIDTHS } from 'theme/styled'

const PaperTradingTabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  padding-left: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};

  .move-tab-item {
    padding: 0;
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

export default memo(function PaperTradingTabs() {
  const { strategyId } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState(PAPER_TRADING_TAB_KEY.PERFORMANCE)
  const [isShowExpandPaperTrading] = useIsShowExpandPaperTrading()
  const { width } = useWindowSize()
  const isShowCount = useMemo(() => {
    return !(!isShowExpandPaperTrading && Number(width) < MEDIA_WIDTHS.width1440)
  }, [isShowExpandPaperTrading, width])

  const isShowIcon = useMemo(() => {
    return !(!isShowExpandPaperTrading && Number(width) < MEDIA_WIDTHS.width1440)
  }, [isShowExpandPaperTrading, width])

  // 获取数据统计信息用于显示Tab标题
  const { totalCount: totalStrategyPositions } = useStrategyPositions(strategyId)
  const { totalCount: totalStrategyOrders } = useStrategyOpenOrdersPaginated(strategyId)
  const { totalCount: totalStrategyHistory } = useStrategyOrderHistoryPaginated(strategyId)

  const handleTabClick = useCallback((key: PAPER_TRADING_TAB_KEY) => {
    setActiveTab(key)
  }, [])

  const tabList = useMemo(() => {
    return [
      {
        key: PAPER_TRADING_TAB_KEY.PERFORMANCE,
        icon: isShowIcon ? <IconBase className='icon-performance' /> : null,
        text: <Trans>Performance</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.PERFORMANCE),
        content: <PaperTradingPerformance activeTab={DETAIL_TYPE.STRATEGY} vaultId='' strategyId={strategyId} />,
      },
      {
        key: PAPER_TRADING_TAB_KEY.SIGNALS,
        icon: isShowIcon ? <IconBase className='icon-signals' /> : null,
        text: <Trans>Signals</Trans>,
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.SIGNALS),
        content: <VaultChatArea />,
      },
      {
        key: PAPER_TRADING_TAB_KEY.POSITIONS,
        icon: isShowIcon ? <IconBase className='icon-positions' /> : null,
        text: (
          <>
            <Trans>Positions</Trans>
            {isShowCount && ` (${totalStrategyPositions})`}
          </>
        ),
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.POSITIONS),
        content: <VaultPositions activeTab={DETAIL_TYPE.STRATEGY} vaultId='' strategyId={strategyId || ''} />,
      },
      {
        key: PAPER_TRADING_TAB_KEY.ORDERS,
        icon: isShowIcon ? <IconBase className='icon-orders' /> : null,
        text: (
          <>
            <Trans>Open orders</Trans>
            {isShowCount && ` (${totalStrategyOrders})`}
          </>
        ),
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.ORDERS),
        content: <VaultOpenOrders activeTab={DETAIL_TYPE.STRATEGY} vaultId='' strategyId={strategyId || ''} />,
      },
      {
        key: PAPER_TRADING_TAB_KEY.ORDER_HISTORY,
        icon: isShowIcon ? <IconBase className='icon-orders' /> : null,
        text: (
          <>
            <Trans>History</Trans>
            {isShowCount && ` (${totalStrategyHistory})`}
          </>
        ),
        clickCallback: () => handleTabClick(PAPER_TRADING_TAB_KEY.ORDER_HISTORY),
        content: <VaultOrderHistory activeTab={DETAIL_TYPE.STRATEGY} vaultId='' strategyId={strategyId || ''} />,
      },
    ]
  }, [
    handleTabClick,
    isShowCount,
    isShowIcon,
    strategyId,
    totalStrategyPositions,
    totalStrategyOrders,
    totalStrategyHistory,
  ])

  return (
    <PaperTradingTabsWrapper>
      <Header>
        <MoveTabList gap={20} tabKey={activeTab} tabList={tabList} />
        <PaperTradingButtonWrapper />
      </Header>
      <TabContent className='scroll-style'>
        {tabList.map((tab) => (
          <TabPanel key={tab.key} $isActive={activeTab === tab.key}>
            {tab.content}
          </TabPanel>
        ))}
      </TabContent>
    </PaperTradingTabsWrapper>
  )
})
