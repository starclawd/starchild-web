import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import Table, { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultOrderHistoryPaginated } from 'store/vaultsdetail/hooks'
import { UnifiedOrderHistoryItem } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix, mul } from 'utils/calc'
import { useStrategyOrderHistoryPaginated } from 'store/vaultsdetail/hooks/useStrategyOrderHistory'
import NoData from 'components/NoData'
import { VaultPositionsOrdersProps } from '..'

// 表格样式组件
const StyledTable = styled(Table)`
  thead {
    background-color: transparent;
  }

  .header-container {
    height: 40px;

    th {
      font-size: 13px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.textL3};
      border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }

  .table-row {
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

// Loading状态居中容器
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`

// Symbol 显示组件
const SymbolCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const SymbolContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// 侧边栏指示器
const SideIndicator = styled.div<{ $side: 'BUY' | 'SELL' }>`
  width: 4px;
  height: 20px;
  background: ${({ theme, $side }) => ($side === 'BUY' ? theme.green100 : theme.red100)};
  border-radius: 2px;
`

const SymbolText = styled.div<{ $isLong?: boolean }>`
  font-weight: 400;
  color: ${({ theme, $isLong }) => ($isLong === undefined ? theme.textL2 : $isLong ? theme.green100 : theme.red100)};
`

// Symbol组件
interface SymbolDisplayProps {
  symbol: string
  displaySymbol?: string
  orderSide?: 'BUY' | 'SELL'
}

const SymbolDisplay = memo<SymbolDisplayProps>(({ symbol, displaySymbol, orderSide }) => {
  const isLong = orderSide === 'BUY'
  // 优先使用处理过的displaySymbol，否则手动解析
  const finalDisplaySymbol = displaySymbol || symbol.replace('PERP_', '').replace('_', '-')

  return (
    <SymbolContainer>
      <SideIndicator $side={orderSide || 'BUY'} />
      <SymbolText $isLong={isLong}>{finalDisplaySymbol}</SymbolText>
    </SymbolContainer>
  )
})

// 数量显示组件
const CommonValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.textL2};
`

const VaultOrderHistory = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  const vaultOrderHistoryPaginated = useVaultOrderHistoryPaginated(vaultId || '')
  const strategyOrderHistoryPaginated = useStrategyOrderHistoryPaginated(strategyId || '')

  // Orders 表格列定义
  // 根据activeTab选择对应的数据
  const currentData = useMemo(() => {
    if (activeTab === 'strategy') {
      return strategyOrderHistoryPaginated
    }
    return vaultOrderHistoryPaginated
  }, [activeTab, vaultOrderHistoryPaginated, strategyOrderHistoryPaginated])

  const ordersColumns: ColumnDef<UnifiedOrderHistoryItem>[] = useMemo(
    () => [
      {
        key: 'symbol',
        title: <Trans>Symbol</Trans>,
        width: '180px',
        render: (order) => (
          <SymbolCell>
            <SymbolDisplay symbol={order.symbol} displaySymbol={order.displaySymbol} orderSide={order.side} />
          </SymbolCell>
        ),
      },
      {
        key: 'quantity',
        title: <Trans>Executed Qty.</Trans>,
        width: '140px',
        render: (order) => {
          return (
            <CommonValue>
              {formatNumber(order.executed_quantity || 0)} / {formatNumber(order.quantity || 0)} {order.token || '--'}
            </CommonValue>
          )
        },
      },
      {
        key: 'price',
        title: <Trans>Executed Price</Trans>,
        width: '120px',
        render: (order) => <CommonValue>{formatNumber(order.price || 0)}</CommonValue>,
      },
      {
        key: 'value',
        title: <Trans>Value</Trans>,
        width: '140px',
        render: (order) => {
          const value = mul(order.quantity || 0, order.price || 0)
          return <CommonValue>{formatNumber(toFix(value, 2), { showDollar: true })}</CommonValue>
        },
      },
      {
        key: 'updated_at',
        title: <Trans>Time</Trans>,
        width: '180px',
        align: 'left',
        render: (order) => (
          <CommonValue>{dayjs(order.updated_at || order.executed_timestamp).format('YYYY-MM-DD HH:mm:ss')}</CommonValue>
        ),
      },
    ],
    [],
  )

  if (currentData.isLoading && currentData.orders.length === 0) {
    return (
      <LoadingWrapper>
        <Pending isNotButtonLoading />
      </LoadingWrapper>
    )
  }

  return (
    <StyledTable
      data={currentData.orders}
      columns={ordersColumns}
      emptyText={<NoData />}
      headerBodyGap={0}
      rowHeight={48}
      rowGap={0}
      showPagination={currentData.totalCount > currentData.pageSize}
      showPageSizeSelector={true}
      pageIndex={currentData.currentPage}
      totalSize={currentData.totalCount}
      pageSize={currentData.pageSize}
      onPageChange={currentData.handlePageChange}
      onPageSizeChange={currentData.handlePageSizeChange}
    />
  )
})

VaultOrderHistory.displayName = 'VaultOrderHistory'

export default VaultOrderHistory
