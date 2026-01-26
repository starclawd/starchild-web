import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultOpenOrdersPaginated } from 'store/vaultsdetail/hooks'
import { VaultOpenOrder } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix, mul } from 'utils/calc'
import { useStrategyOpenOrdersPaginated } from 'store/vaultsdetail/hooks/useStrategyOpenOrders'
import NoData from 'components/NoData'
import { VaultPositionsOrdersProps } from '../..'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import { StyledTable, LoadingWrapper } from '../../styles'
import { useSymbolPrecision, isOldSymbolFormat } from 'store/vaults/hooks'
import SymbolDisplay from '../../../SymbolDisplay'

// 数量显示组件
const CommonValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.black100};
`

const VaultOpenOrders = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  const vaultOpenOrdersPaginated = useVaultOpenOrdersPaginated(vaultId || '')
  const strategyOpenOrdersPaginated = useStrategyOpenOrdersPaginated(strategyId || '')
  const { formatPrice } = useSymbolPrecision()

  // Orders 表格列定义
  // 根据activeTab选择对应的数据
  const currentData = useMemo(() => {
    if (activeTab === DETAIL_TYPE.STRATEGY) {
      return strategyOpenOrdersPaginated
    }
    return vaultOpenOrdersPaginated
  }, [activeTab, vaultOpenOrdersPaginated, strategyOpenOrdersPaginated])

  const ordersColumns: ColumnDef<VaultOpenOrder>[] = useMemo(
    () => [
      {
        key: 'symbol',
        title: <Trans>Symbol</Trans>,
        width: '200px',
        render: (order) => {
          // 兼容新旧格式：新格式 symbol 就是 token（如 BTC），旧格式需要解析（如 PERP_BTC_USDC）
          const token = isOldSymbolFormat(order.symbol)
            ? order.symbol.replace('PERP_', '').split('_')[0]
            : order.displaySymbol || order.symbol
          const logoUrl =
            order.logoUrl || `https://oss.orderly.network/static/symbol_logo/${token.toUpperCase()}.png`

          return (
            <SymbolDisplay
              symbol={order.symbol}
              displaySymbol={order.displaySymbol || token}
              token={order.token || token}
              logoUrl={logoUrl}
              orderSide={order.side}
              type={order.type}
              leverage={order.leverage}
            />
          )
        },
      },
      {
        key: 'quantity',
        title: <Trans>Qty.</Trans>,
        width: '140px',
        render: (order) => {
          // 兼容新旧格式：新格式 symbol 就是 token（如 BTC），旧格式需要解析（如 PERP_SOL_USDC -> SOL）
          const baseToken = isOldSymbolFormat(order.symbol)
            ? order.symbol.replace('PERP_', '').split('_')[0]
            : order.token || order.symbol
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
        render: (order) => <CommonValue>{formatNumber(formatPrice(order.price, order.symbol))}</CommonValue>,
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

VaultOpenOrders.displayName = 'VaultOpenOrders'

export default VaultOpenOrders
