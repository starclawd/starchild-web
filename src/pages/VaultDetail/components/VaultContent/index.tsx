import { memo } from 'react'
import styled, { css } from 'styled-components'
import PaperTradingPerformance from '../PaperTradingPerformance'
import VaultPositionsOrders from '../VaultPositionsOrders'
import { vm } from 'pages/helper'
import { useActiveTab, useCurrentVaultId } from 'store/vaultsdetail/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'

const VaultContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

const VaultContent = memo(() => {
  const [activeTab] = useActiveTab()
  const currentVaultId = useCurrentVaultId()
  const { strategyId } = useParsedQueryString()

  return (
    <VaultContentContainer>
      {/* PnL图表区域 */}
      <PaperTradingPerformance activeTab={activeTab} vaultId={currentVaultId} strategyId={strategyId} />

      {/* Positions/Orders表格区域 */}
      <VaultPositionsOrders activeTab={activeTab} vaultId={currentVaultId} strategyId={strategyId} />
    </VaultContentContainer>
  )
})

VaultContent.displayName = 'VaultContent'

export default VaultContent
