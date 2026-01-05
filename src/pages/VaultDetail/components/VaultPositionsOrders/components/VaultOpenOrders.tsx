import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import Table, { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultOpenOrdersPaginated } from 'store/vaultsdetail/hooks'
import { VaultOpenOrder } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix, mul } from 'utils/calc'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
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
      color: ${({ theme }) => theme.black200};
      border-bottom: 1px solid ${({ theme }) => theme.black800};
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }

  .table-row {
    border-bottom: 1px solid ${({ theme }) => theme.black800};

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
  color: ${({ theme, $isLong }) => ($isLong === undefined ? theme.black100 : $isLong ? theme.green100 : theme.red100)};
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
const CommonValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.black100};
`

// 格式化时间戳为日期时间字符串
const formatTimestamp = (timestamp: number): string => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const VaultOpenOrders = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  const vaultOpenOrdersPaginated = useVaultOpenOrdersPaginated(vaultId || '')
  const strategyOpenOrdersPaginated = useStrategyOpenOrdersPaginated(strategyId || '')

  // Orders 表格列定义
  // 根据activeTab选择对应的数据
  const currentData = useMemo(() => {
    if (activeTab === 'strategy') {
      return strategyOpenOrdersPaginated
    }
    return vaultOpenOrdersPaginated
  }, [activeTab, vaultOpenOrdersPaginated, strategyOpenOrdersPaginated])

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
            <CommonValue>
              {formatNumber(order.quantity)} {baseToken}
            </CommonValue>
          )
        },
      },
      {
        key: 'price',
        title: <Trans>Price</Trans>,
        width: '120px',
        render: (order) => <CommonValue>{formatNumber(order.price)}</CommonValue>,
      },
      {
        key: 'value',
        title: <Trans>Value</Trans>,
        width: '140px',
        render: (order) => {
          const value = mul(order.quantity, order.price)
          return <CommonValue>{formatNumber(toFix(value, 2), { showDollar: true })}</CommonValue>
        },
      },
      {
        key: 'created_time',
        title: <Trans>Time</Trans>,
        width: '180px',
        align: 'left',
        render: (order) => <CommonValue>{dayjs(order.created_time).format('YYYY-MM-DD HH:mm:ss')}</CommonValue>,
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

VaultOpenOrders.displayName = 'VaultOpenOrders'

export default VaultOpenOrders
