import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import VaultPnLChart from '../VaultPnLChart'
import VaultPositionsOrders from '../VaultPositionsOrders'
import { vm } from 'pages/helper'
import { useActiveTab } from 'store/vaultsdetail/hooks'
import NoData from 'components/NoData'

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
  padding: 0 0 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(16)};
      align-items: flex-start;
      padding: 0 0 ${vm(16)} 0;
    `}
`

const TabsList = styled.div`
  display: flex;
  gap: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      width: 100%;
      justify-content: center;
    `}
`

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: ${({ $active, theme }) => ($active ? theme.textL1 : theme.textL3)};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.textL1};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      &::after {
        content: '';
        position: absolute;
        bottom: -16px;
        left: 0;
        right: 0;
        height: 2px;
        background: ${theme.jade10};
        border-radius: 1px;
      }
    `}

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
      padding: ${vm(8)} ${vm(16)};

      &::after {
        bottom: -${vm(16)};
      }
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
  const [activeTab, setActiveTab] = useActiveTab()

  return (
    <ContentTabsContainer>
      <TabsHeader>
        <TabsList>
          <TabButton $active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')}>
            <Trans>Strategy</Trans>
          </TabButton>
          <TabButton $active={activeTab === 'vaults'} onClick={() => setActiveTab('vaults')}>
            <Trans>Vaults</Trans>
          </TabButton>
        </TabsList>
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
