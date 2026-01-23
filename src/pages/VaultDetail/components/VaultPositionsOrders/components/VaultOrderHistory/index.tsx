import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultOrderHistoryPaginated } from 'store/vaultsdetail/hooks'
import { UnifiedOrderHistoryItem } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix, mul } from 'utils/calc'
import { useStrategyOrderHistoryPaginated } from 'store/vaultsdetail/hooks/useStrategyOrderHistory'
import NoData from 'components/NoData'
import { VaultPositionsOrdersProps } from '../..'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import { StyledTable, LoadingWrapper } from '../../styles'
import { useSymbolPrecision } from 'store/vaults/hooks'
import LazyImage from 'components/LazyImage'

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
  .symbol-logo {
    margin-right: 4px;
  }
`

// 侧边栏指示器
const SideIndicator = styled.div<{ $side: 'BUY' | 'SELL' }>`
  width: 4px;
  height: 24px;
  background: ${({ theme, $side }) => ($side === 'BUY' ? theme.green100 : theme.red100)};
`

const SymbolText = styled.div<{ $isLong?: boolean }>`
  font-weight: 400;
  color: ${({ theme, $isLong }) => ($isLong === undefined ? theme.black100 : $isLong ? theme.green100 : theme.red100)};
`

// Symbol组件
interface SymbolDisplayProps {
  displaySymbol: string
  token: string
  logoUrl: string
  orderSide?: 'BUY' | 'SELL'
}

const SymbolDisplay = memo<SymbolDisplayProps>(({ displaySymbol, token, logoUrl, orderSide }) => {
  const isLong = orderSide === 'BUY'

  return (
    <SymbolContainer>
      <LazyImage className='symbol-logo' src={logoUrl} alt={token} width={24} height={24} />
      {orderSide && <SideIndicator $side={orderSide} />}
      <SymbolText $isLong={isLong}>{displaySymbol}</SymbolText>
    </SymbolContainer>
  )
})

// 数量显示组件
const CommonValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.black100};
`

const VaultOrderHistory = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  const vaultOrderHistoryPaginated = useVaultOrderHistoryPaginated(vaultId || '')
  const strategyOrderHistoryPaginated = useStrategyOrderHistoryPaginated(strategyId || '')
  const { formatPrice } = useSymbolPrecision()

  // Orders 表格列定义
  // 根据activeTab选择对应的数据
  const currentData = useMemo(() => {
    if (activeTab === DETAIL_TYPE.STRATEGY) {
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
            <SymbolDisplay
              displaySymbol={order.displaySymbol || order.symbol.replace('PERP_', '').replace('_', '-')}
              token={order.token || order.symbol.replace('PERP_', '').split('_')[0]}
              logoUrl={
                order.logoUrl ||
                `https://oss.orderly.network/static/symbol_logo/${order.symbol.replace('PERP_', '').split('_')[0].toUpperCase()}.png`
              }
              orderSide={order.side}
            />
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
        render: (order) => <CommonValue>{formatNumber(formatPrice(order.price || 0, order.symbol))}</CommonValue>,
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
    [formatPrice],
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
