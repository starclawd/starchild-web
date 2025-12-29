import { memo } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import VaultPnLChart from '../VaultPnLChart'
import VaultPositionsOrders from '../VaultPositionsOrders'
import { vm } from 'pages/helper'
import { useActiveTab, useCurrentStrategyId, useCurrentVaultId } from 'store/vaultsdetail/hooks'
import NoData from 'components/NoData'
import MoveTabList from 'components/MoveTabList'

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

const TabsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(16)};
      align-items: flex-start;
      padding: 0 0 ${vm(16)} 0;
    `}
`

const VaultContentTabs = memo(() => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useActiveTab()
  const vaultId = useCurrentVaultId()
  const [strategyId] = useCurrentStrategyId()

  const tabList = [
    {
      key: 0,
      text: <Trans>Strategy</Trans>,
      clickCallback: () => setActiveTab('strategy'),
    },
    {
      key: 1,
      text: <Trans>Vaults</Trans>,
      clickCallback: () => setActiveTab('vaults'),
    },
  ]

  const tabIndex = activeTab === 'strategy' ? 0 : 1

  return (
    <ContentTabsContainer>
      {/* 只有当vaultId存在时才显示TabsHeader */}
      {vaultId && (
        <TabsHeader>
          <MoveTabList tabKey={tabIndex} tabList={tabList} activeIndicatorBackground={theme.text20} />
        </TabsHeader>
      )}

      {/* PnL图表区域 */}
      <VaultPnLChart activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />

      {/* Positions/Orders表格区域 */}
      <VaultPositionsOrders activeTab={activeTab} vaultId={vaultId || ''} strategyId={strategyId || ''} />
    </ContentTabsContainer>
  )
})

VaultContentTabs.displayName = 'VaultContentTabs'

export default VaultContentTabs
