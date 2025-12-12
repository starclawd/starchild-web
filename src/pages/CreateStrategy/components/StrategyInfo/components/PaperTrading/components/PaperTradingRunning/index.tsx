import { memo, useEffect } from 'react'
import styled from 'styled-components'
import ScrollPageContent from 'components/ScrollPageContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentVaultId, useCurrentStrategyId, useFetchVaultInfo } from 'store/vaultsdetail/hooks'
import detailBg from 'assets/vaults/detail-bg.png'
import { useAppKitAccount } from '@reown/appkit/react'
import {
  useAllStrategiesOverview,
  useFetchAllStrategiesOverviewData,
} from 'store/vaults/hooks/useAllStrategiesOverview'
import VaultContentTabs from 'pages/VaultDetail/components/VaultContentTabs'
import VaultPnLChart from 'pages/VaultDetail/components/VaultPnLChart'
import VaultPositionsOrders from 'pages/VaultDetail/components/VaultPositionsOrders'

const PaperTradingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.black900};
`

const PaperTradingMainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 320px);
  height: 100%;
  margin: 0;
  .paper-trading-scroll {
    padding: 0;
  }
`

const PaperTradingChatSidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  background: ${({ theme }) => theme.black1000};
`

const PaperTradingContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  flex: 1;
`

const PaperTradingRunning = memo(() => {
  // 解析URL参数
  const { strategyId } = useParsedQueryString()
  const dataMode = 'paper_trading'
  const activeTab = 'strategy'

  return (
    <PaperTradingContainer>
      <PaperTradingMainContent>
        <ScrollPageContent className='paper-trading-scroll'>
          <PaperTradingContentWrapper>
            {/* PnL图表区域 */}
            <VaultPnLChart activeTab={activeTab} vaultId={''} strategyId={strategyId || ''} dataMode={dataMode} />

            {/* Positions/Orders表格区域 */}
            <VaultPositionsOrders
              activeTab={activeTab}
              vaultId={''}
              strategyId={strategyId || ''}
              dataMode={dataMode}
            />
          </PaperTradingContentWrapper>
        </ScrollPageContent>
      </PaperTradingMainContent>

      <PaperTradingChatSidebar>{/* TODO: 信号列表内容区域 */}</PaperTradingChatSidebar>
    </PaperTradingContainer>
  )
})

PaperTradingRunning.displayName = 'PaperTradingRunning'

export default PaperTradingRunning
