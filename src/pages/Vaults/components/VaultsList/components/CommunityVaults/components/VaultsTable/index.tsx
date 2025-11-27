import { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { CommunityVault } from 'store/vaults/vaults'
import NetworkIcon from 'components/NetworkIcon'
import Table, { ColumnDef } from 'components/Table'

interface VaultsTableProps {
  vaults: CommunityVault[]
  onRowClick?: (vaultId: string) => void
}

const StyledTable = styled(Table)`
  .header-container {
    display: flex;
    align-items: center;
    height: 40px;
    background: ${({ theme }) => theme.black700};
    border-radius: 4px;

    th {
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }

  .table-row {
    cursor: pointer;
    height: 70px;
    border-bottom: 1px solid ${({ theme }) => theme.lineDark8};

    td {
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }
` as typeof Table

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
  gap: 4px;
`

const AdditionalNetworks = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL2};
  padding: 2px 6px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 4px;
`

const TVLValue = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
`

const APYValue = styled.div<{ $hasValue: boolean }>`
  color: ${({ theme, $hasValue }) => ($hasValue ? theme.textL1 : theme.textL2)};
`

const PnLValue = styled.div<{ $isProfit?: boolean }>`
  font-weight: 500;
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.textL2 : $isProfit ? theme.green100 : theme.ruby50};
`

const BalanceValue = styled.div<{ $hasBalance: boolean }>`
  color: ${({ theme, $hasBalance }) => ($hasBalance ? theme.textL1 : theme.textL2)};
  font-weight: ${({ $hasBalance }) => ($hasBalance ? '500' : 'normal')};
`

const VaultsTable = memo<VaultsTableProps>(({ vaults, onRowClick }) => {
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const columns: ColumnDef<CommunityVault>[] = useMemo(
    () => [
      {
        key: 'name',
        title: <Trans>Name(Builder)</Trans>,
        render: (vault) => (
          <VaultNameCell>
            <VaultName>{vault.name}</VaultName>
            <VaultBuilder>{vault.builder}</VaultBuilder>
          </VaultNameCell>
        ),
      },
      {
        key: 'strategyProvider',
        title: <Trans>Strategy Provider</Trans>,
        render: (vault) => <StrategyProvider>{vault.strategyProvider}</StrategyProvider>,
      },
      {
        key: 'networks',
        title: <Trans>Network</Trans>,
        render: (vault) => (
          <NetworksList>
            {vault.networks.slice(0, 3).map((network) => (
              <NetworkIcon key={network.id} networkId={network.id} size={20} overlapped={true} />
            ))}
            {vault.additionalNetworks > 0 && <AdditionalNetworks>+{vault.additionalNetworks}</AdditionalNetworks>}
          </NetworksList>
        ),
      },
      {
        key: 'tvl',
        title: <Trans>TVL</Trans>,
        render: (vault) => <TVLValue>{vault.tvl}</TVLValue>,
      },
      {
        key: 'vaultAge',
        title: <Trans>Vault Age</Trans>,
        render: (vault) => <div>{vault.vaultAge}</div>,
      },
      {
        key: 'allTimeApy',
        title: <Trans>All-time APY</Trans>,
        render: (vault) => <APYValue $hasValue={vault.allTimeApy !== '-'}>{vault.allTimeApy}</APYValue>,
      },
      {
        key: 'allTimePnL',
        title: <Trans>All-time PnL</Trans>,
        render: (vault) => (
          <PnLValue $isProfit={vault.allTimePnL !== null ? vault.allTimePnL > 0 : undefined}>
            {vault.allTimePnL !== null ? `$${vault.allTimePnL.toFixed(2)}` : '-'}
          </PnLValue>
        ),
      },
      {
        key: 'yourBalance',
        title: <Trans>Your Balance</Trans>,
        render: (vault) => <BalanceValue $hasBalance={vault.yourBalance !== '-'}>{vault.yourBalance}</BalanceValue>,
      },
    ],
    [],
  )

  // 计算当前页显示的数据
  const paginatedVaults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return vaults.slice(startIndex, endIndex)
  }, [vaults, currentPage, pageSize])

  // 处理翻页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理每页条数变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // 重置到第一页
  }

  // 处理行点击事件
  const handleRowClick = (vault: CommunityVault) => {
    onRowClick?.(vault.id)
  }

  return (
    <StyledTable
      showPagination
      data={paginatedVaults}
      columns={columns}
      onRowClick={handleRowClick}
      headerBodyGap={0}
      rowHeight={70}
      rowGap={0}
      pageIndex={currentPage}
      pageSize={pageSize}
      totalSize={vaults.length}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  )
})

VaultsTable.displayName = 'VaultsTable'

export default VaultsTable
