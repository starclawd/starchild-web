import { memo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      gap: ${vm(16)};
    `}
`

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: flex-start;
      gap: ${vm(12)};
    `}
`

const TableTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(18)};
  `}
`

const SubTabs = styled.div`
  display: flex;
  gap: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      width: 100%;
      justify-content: center;
    `}
`

const SubTabButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  background: ${({ $active, theme }) => ($active ? theme.jade10 : 'transparent')};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.jade10 : theme.lineDark8)};
  border-radius: 4px;
  color: ${({ $active, theme }) => ($active ? theme.black900 : theme.textL2)};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.jade10 : theme.black600)};
    color: ${({ $active, theme }) => ($active ? theme.black900 : theme.textL1)};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(12)};
      font-size: ${vm(14)};
    `}
`

const TableContent = styled.div`
  width: 100%;
  overflow-x: auto;
`

const PlaceholderTable = styled.div`
  width: 100%;
  min-height: 300px;
  background: ${({ theme }) => theme.black800};
  border: 2px dashed ${({ theme }) => theme.lineDark6};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.textL3};
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-height: ${vm(250)};
      font-size: ${vm(16)};
      gap: ${vm(12)};
      padding: ${vm(20)};
    `}
`

const MockDataIndicator = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL4};
  background: ${({ theme }) => theme.black600};
  padding: 4px 8px;
  border-radius: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      padding: ${vm(4)} ${vm(8)};
    `}
`

interface VaultPositionsOrdersProps {
  activeTab: 'strategy' | 'vaults'
}

type SubTabType = 'positions' | 'orders'

const VaultPositionsOrders = memo<VaultPositionsOrdersProps>(({ activeTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('positions')

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          <Trans>
            {activeTab === 'strategy' ? 'Strategy Data' : 'Vault Data'}
          </Trans>
        </TableTitle>
        <SubTabs>
          <SubTabButton
            $active={activeSubTab === 'positions'}
            onClick={() => setActiveSubTab('positions')}
          >
            <Trans>Positions</Trans>
          </SubTabButton>
          <SubTabButton
            $active={activeSubTab === 'orders'}
            onClick={() => setActiveSubTab('orders')}
          >
            <Trans>Orders</Trans>
          </SubTabButton>
        </SubTabs>
      </TableHeader>

      <TableContent>
        <PlaceholderTable>
          <Trans>
            {activeSubTab === 'positions' ? 'Positions Table' : 'Orders Table'} - Coming Soon
          </Trans>
          <MockDataIndicator>
            <Trans>Real-time data will be integrated</Trans>
          </MockDataIndicator>
        </PlaceholderTable>
      </TableContent>
    </TableContainer>
  )
})

VaultPositionsOrders.displayName = 'VaultPositionsOrders'

export default VaultPositionsOrders
