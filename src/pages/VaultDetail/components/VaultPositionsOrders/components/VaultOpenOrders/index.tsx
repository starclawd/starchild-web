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
import { useSymbolPrecision } from 'store/vaults/hooks'

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

const SymbolLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 4px;
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
      <SymbolLogo
        src={logoUrl}
        alt={token}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
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
        width: '180px',
        render: (order) => (
          <SymbolCell>
            <SymbolDisplay
              displaySymbol={(order as any).displaySymbol || order.symbol.replace('PERP_', '').replace('_', '-')}
              token={(order as any).token || order.symbol.replace('PERP_', '').split('_')[0]}
              logoUrl={
                (order as any).logoUrl ||
                `https://oss.orderly.network/static/symbol_logo/${order.symbol.replace('PERP_', '').split('_')[0].toUpperCase()}.png`
              }
              orderSide={order.side}
            />
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
