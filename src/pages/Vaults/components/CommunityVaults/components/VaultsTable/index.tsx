import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { CommunityVault } from 'store/vaults/vaults'
import MiniPnLChart from '../MiniPnLChart'
import { useMiniChartData } from 'store/vaults/hooks/useMiniChartData'
import NetworkIcon from 'components/NetworkIcon'

interface VaultsTableProps {
  vaults: CommunityVault[]
  onRowClick?: (vaultId: string) => void
}

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.bgL1};
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
`

const HeaderRow = styled.tr``

const HeaderCell = styled.th<{ $sortable?: boolean; $sorted?: boolean }>`
  padding: 16px 12px;
  text-align: left;
  font-weight: 500;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgL1};
  position: relative;
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  white-space: nowrap;

  &:hover {
    background: ${({ theme, $sortable }) => ($sortable ? theme.bgL2 : theme.bgL1)};
  }

  ${({ $sortable }) =>
    $sortable &&
    `
    &::after {
      content: '';
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      border: 1px solid currentColor;
      border-left: none;
      border-top: none;
      transform: translateY(-50%) rotate(45deg);
      opacity: 0.5;
    }
  `}

  ${({ $sorted }) =>
    $sorted &&
    `
    &::after {
      opacity: 1;
    }
  `}
`

const TableBody = styled.tbody``

const DataRow = styled.tr`
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.bgL1};
  }

  &:last-child {
    border-bottom: none;
  }
`

const DataCell = styled.td`
  padding: 16px 12px;
  color: ${({ theme }) => theme.textL1};
  white-space: nowrap;
  vertical-align: middle;
`

const VaultNameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const VaultName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
`

const VaultBuilder = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL2};
`

const StrategyProvider = styled.div`
  color: ${({ theme }) => theme.textL1};
  font-weight: 500;
`

const NetworksList = styled.div`
  display: flex;
  align-items: center;
`

const AdditionalNetworks = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL2};
  padding: 2px 6px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 4px;
`

const TVLCell = styled(DataCell)`
  font-weight: 500;
`

const APYCell = styled(DataCell)<{ $hasValue: boolean }>`
  color: ${({ theme, $hasValue }) => ($hasValue ? theme.textL1 : theme.textL2)};
`

const PnLCell = styled(DataCell)<{ $isProfit?: boolean }>`
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.textL2 : $isProfit ? theme.green100 : theme.ruby50};
`

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PnLValue = styled.div<{ $isProfit?: boolean }>`
  font-weight: 500;
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.textL2 : $isProfit ? theme.green100 : theme.ruby50};
`

const BalanceCell = styled(DataCell)<{ $hasBalance: boolean }>`
  color: ${({ theme, $hasBalance }) => ($hasBalance ? theme.textL1 : theme.textL2)};
  font-weight: ${({ $hasBalance }) => ($hasBalance ? '500' : 'normal')};
`

const ChartPnLCell = memo<{ vault: CommunityVault }>(({ vault }) => {
  const { data, isLoading, isPositive, hasData } = useMiniChartData({
    vaultId: vault.id,
    enabled: true,
  })

  return (
    <PnLCell $isProfit={isPositive}>
      <ChartContainer>
        {!isLoading && hasData && <MiniPnLChart data={data} isPositive={isPositive} width={60} height={24} />}
        <PnLValue $isProfit={isPositive}>
          {vault.allTimePnL !== null ? `$${vault.allTimePnL.toFixed(2)}` : '-'}
        </PnLValue>
      </ChartContainer>
    </PnLCell>
  )
})

const VaultsTable = memo<VaultsTableProps>(({ vaults, onRowClick }) => {
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortField(field)
        setSortOrder('desc')
      }
    },
    [sortField, sortOrder],
  )

  const handleRowClick = useCallback(
    (vault: CommunityVault) => {
      onRowClick?.(vault.id)
    },
    [onRowClick],
  )

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <HeaderRow>
            <HeaderCell>
              <Trans>Name(Builder)</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Strategy Provider</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>Network</Trans>
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('tvl')} $sorted={sortField === 'tvl'}>
              <Trans>TVL</Trans>
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('age')} $sorted={sortField === 'age'}>
              <Trans>Vault Age</Trans>
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('apy')} $sorted={sortField === 'apy'}>
              <Trans>All-time APY</Trans>
            </HeaderCell>
            <HeaderCell>
              <Trans>All-time PnL</Trans>
            </HeaderCell>
            <HeaderCell $sortable onClick={() => handleSort('balance')} $sorted={sortField === 'balance'}>
              <Trans>Your Balance</Trans>
            </HeaderCell>
          </HeaderRow>
        </TableHeader>

        <TableBody>
          {vaults.map((vault) => (
            <DataRow key={vault.id} onClick={() => handleRowClick(vault)}>
              <DataCell>
                <VaultNameCell>
                  <VaultName>{vault.name}</VaultName>
                  <VaultBuilder>{vault.builder}</VaultBuilder>
                </VaultNameCell>
              </DataCell>

              <DataCell>
                <StrategyProvider>{vault.strategyProvider}</StrategyProvider>
              </DataCell>

              <DataCell>
                <NetworksList>
                  {vault.networks.slice(0, 3).map((network) => (
                    <NetworkIcon key={network.id} networkId={network.id} size={20} overlapped={true} />
                  ))}
                  {vault.additionalNetworks > 0 && <AdditionalNetworks>+{vault.additionalNetworks}</AdditionalNetworks>}
                </NetworksList>
              </DataCell>

              <TVLCell>{vault.tvl}</TVLCell>

              <DataCell>{vault.vaultAge}</DataCell>

              <APYCell $hasValue={vault.allTimeApy !== '-'}>{vault.allTimeApy}</APYCell>

              <ChartPnLCell vault={vault} />

              <BalanceCell $hasBalance={vault.yourBalance !== '-'}>{vault.yourBalance}</BalanceCell>
            </DataRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
})

VaultsTable.displayName = 'VaultsTable'

export default VaultsTable
