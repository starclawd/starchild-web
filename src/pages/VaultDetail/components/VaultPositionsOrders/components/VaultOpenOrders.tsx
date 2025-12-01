import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Table, { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultOpenOrdersPaginated } from 'store/vaultsdetail/hooks'
import { VaultOpenOrder } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix, mul } from 'utils/calc'

// 表格样式组件
const StyledTable = styled(Table)`
  .header-container {
    display: flex;
    align-items: center;
    height: 40px;

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
  orderSide?: 'BUY' | 'SELL'
}

const SymbolDisplay = memo<SymbolDisplayProps>(({ symbol, orderSide }) => {
  const isLong = orderSide === 'BUY'
  // 从symbol中解析出显示文本，如 "PERP_WOO_USDC" → "WOO-USDC"
  const displaySymbol = symbol.replace('PERP_', '').replace('_', '-')

  return (
    <SymbolContainer>
      <SideIndicator $side={orderSide || 'BUY'} />
      <SymbolText $isLong={isLong}>{displaySymbol}</SymbolText>
    </SymbolContainer>
  )
})

// 数量显示组件
const QuantityValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.textL2};
`

// 价格显示组件
const PriceValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.textL2};
`

// 格式化时间戳为日期时间字符串
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

interface VaultOpenOrdersProps {
  vaultId: string
}

const VaultOpenOrders = memo<VaultOpenOrdersProps>(({ vaultId }) => {
  // 使用重构后的分页hook
  const {
    orders,
    isLoading: isLoadingOrders,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
  } = useVaultOpenOrdersPaginated(vaultId)

  // Orders 表格列定义
  const ordersColumns: ColumnDef<VaultOpenOrder>[] = useMemo(
    () => [
      {
        key: 'symbol',
        title: <Trans>Symbol</Trans>,
        width: '180px',
        render: (order) => (
          <SymbolCell>
            <SymbolDisplay symbol={order.symbol} orderSide={order.side} />
          </SymbolCell>
        ),
      },
      {
        key: 'quantity',
        title: <Trans>Qty.</Trans>,
        width: '140px',
        render: (order) => {
          // 从symbol中提取base token，如 "PERP_SOL_USDC" -> "SOL"
          const baseToken = order.symbol.replace('PERP_', '').split('_')[0]
          return (
            <QuantityValue>
              {formatNumber(order.quantity)} {baseToken}
            </QuantityValue>
          )
        },
      },
      {
        key: 'price',
        title: <Trans>Price</Trans>,
        width: '120px',
        render: (order) => <PriceValue>{formatNumber(order.price)}</PriceValue>,
      },
      {
        key: 'value',
        title: <Trans>Value</Trans>,
        width: '140px',
        render: (order) => {
          const value = mul(order.quantity, order.price)
          return <PriceValue>${formatNumber(toFix(value, 2))}</PriceValue>
        },
      },
      {
        key: 'created_time',
        title: <Trans>Time</Trans>,
        width: '180px',
        align: 'left',
        render: (order) => <QuantityValue>{formatTimestamp(order.created_time)}</QuantityValue>,
      },
    ],
    [],
  )

  if (isLoadingOrders && orders.length === 0) {
    return <Pending />
  }

  return (
    <StyledTable
      data={orders}
      columns={ordersColumns}
      emptyText={<Trans>No orders available</Trans>}
      headerBodyGap={0}
      rowHeight={48}
      rowGap={0}
      showPagination={totalCount > pageSize}
      showPageSizeSelector={true}
      pageIndex={currentPage}
      totalSize={totalCount}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  )
})

VaultOpenOrders.displayName = 'VaultOpenOrders'

export default VaultOpenOrders
