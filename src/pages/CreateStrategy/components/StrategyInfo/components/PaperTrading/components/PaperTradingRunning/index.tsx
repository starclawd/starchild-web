import { memo } from 'react'
import styled, { css } from 'styled-components'
import ScrollPageContent from 'components/ScrollPageContent'
import useParsedQueryString from 'hooks/useParsedQueryString'
import PaperTradingPerformance from 'pages/VaultDetail/components/PaperTradingPerformance'
import VaultPositionsOrders from 'pages/VaultDetail/components/VaultPositionsOrders'
import VaultChatArea from 'pages/VaultDetail/components/VaultChatArea'
import { useIsShowSignals } from 'store/createstrategy/hooks/usePaperTrading'
import { ANI_DURATION } from 'constants/index'
import { useIsShowRestart } from 'store/createstrategy/hooks/useRestart'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'

const PaperTradingContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
`

const PaperTradingMainContent = styled.div<{ $isShowRestart: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: calc(100% - 320px);
  height: 100%;
  margin: 0;
  background: ${({ theme }) => theme.black1000};
  .paper-trading-scroll {
    padding: 0;
    padding-right: 4px !important;
  }
  ${({ $isShowRestart }) =>
    $isShowRestart &&
    css`
      .paper-trading-scroll {
        padding-bottom: 56px;
      }
    `}
`

const PaperTradingChatSidebar = styled.div<{ $isShowSignals: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 300px;
  transition: all ${ANI_DURATION}s;
  ${({ $isShowSignals }) =>
    !$isShowSignals &&
    css`
      width: 0;
      overflow: hidden;
    `}
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
  const isShowRestart = useIsShowRestart()
  const activeTab = DETAIL_TYPE.STRATEGY
  const [isShowSignals] = useIsShowSignals()

  return (
    <PaperTradingContainer>
      <PaperTradingMainContent $isShowRestart={isShowRestart}>
        <ScrollPageContent className='paper-trading-scroll'>
          <PaperTradingContentWrapper>
            {/* PnL图表区域 */}
            <PaperTradingPerformance activeTab={activeTab} vaultId={''} strategyId={strategyId || ''} />

            {/* Positions/Orders表格区域 */}
            <VaultPositionsOrders activeTab={activeTab} vaultId={''} strategyId={strategyId || ''} />
          </PaperTradingContentWrapper>
        </ScrollPageContent>
      </PaperTradingMainContent>

      <PaperTradingChatSidebar $isShowSignals={isShowSignals}>
        <VaultChatArea strategyId={strategyId || ''} isShowRestart={isShowRestart} />
      </PaperTradingChatSidebar>
    </PaperTradingContainer>
  )
})

PaperTradingRunning.displayName = 'PaperTradingRunning'

export default PaperTradingRunning
