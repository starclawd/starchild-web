import { memo } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import VaultPnLChart from '../VaultPnLChart'
import VaultPositionsOrders from '../VaultPositionsOrders'
import { vm } from 'pages/helper'
import { useActiveTab } from 'store/vaultsdetail/hooks'
import NoData from 'components/NoData'
import MoveTabList from 'components/MoveTabList'

const ContentTabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: ${({ theme }) => theme.black800};
  border-radius: 12px;
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

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const VaultContentTabs = memo(() => {
  const theme = useTheme()
  const [activeTab, setActiveTab] = useActiveTab()

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
      <TabsHeader>
        <MoveTabList tabIndex={tabIndex} tabList={tabList} activeIndicatorBackground={theme.text20} />
      </TabsHeader>

      <ContentArea>
        {/* PnL图表区域 */}
        <VaultPnLChart />

        {/* Positions/Orders表格区域 */}
        <VaultPositionsOrders />
      </ContentArea>
    </ContentTabsContainer>
  )
})

VaultContentTabs.displayName = 'VaultContentTabs'

export default VaultContentTabs
