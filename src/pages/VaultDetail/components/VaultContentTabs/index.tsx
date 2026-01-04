import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import PaperTradingPerformance from '../PaperTradingPerformance'
import VaultPositionsOrders from '../VaultPositionsOrders'
import { vm } from 'pages/helper'
import { useActiveTab, useCurrentStrategyId, useCurrentVaultId } from 'store/vaultsdetail/hooks'
import StrategyRadarChart from '../StrategyRadarChart'
import AiSummary from '../AiSummary'

const ContentTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const VaultContentTabs = memo(() => {
  const [activeTab] = useActiveTab()
  const vaultId = useCurrentVaultId()
  const [strategyId] = useCurrentStrategyId()

  return (
    <ContentTabsContainer>
      {/* PnL图表区域 */}
      <PaperTradingPerformance activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />

      {/* Positions/Orders表格区域 */}
      <VaultPositionsOrders activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />
    </ContentTabsContainer>
  )
})

VaultContentTabs.displayName = 'VaultContentTabs'

export default VaultContentTabs
