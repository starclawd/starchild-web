import { memo, useEffect } from 'react'
import styled from 'styled-components'
import ScrollPageContent from 'components/ScrollPageContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import VaultPnLChart from 'pages/VaultDetail/components/VaultPnLChart'
import VaultPositionsOrders from 'pages/VaultDetail/components/VaultPositionsOrders'
import VaultChatArea from 'pages/VaultDetail/components/VaultChatArea'
import { useChartTimeRange } from 'store/vaultsdetail/hooks'

const PaperTradingContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
`

const PaperTradingMainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 320px);
  height: 100%;
  margin: 0;
  background: ${({ theme }) => theme.black1000};
  .paper-trading-scroll {
    padding: 0;
    padding-right: 8px;
  }
`

const PaperTradingChatSidebar = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
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
  const [, setChartTimeRange] = useChartTimeRange()

  useEffect(() => {
    setChartTimeRange('24h')
  }, [setChartTimeRange])

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

      <PaperTradingChatSidebar>
        <VaultChatArea isPaperTrading={true} strategyId={strategyId || ''} />
      </PaperTradingChatSidebar>
    </PaperTradingContainer>
  )
})

PaperTradingRunning.displayName = 'PaperTradingRunning'

export default PaperTradingRunning
