import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultPositions } from 'store/vaultsdetail/hooks'
import { VaultPosition } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import NoData from 'components/NoData'
import { useSort, useSortableHeader } from 'components/Table'
import { VaultPositionsOrdersProps } from '../..'
import { DETAIL_TYPE } from 'store/vaultsdetail/vaultsdetail'
import { StyledTable, LoadingWrapper } from '../../styles'
import { useSymbolPrecision } from 'store/vaults/hooks'
import { SortDirection } from 'components/Table/types'
import SymbolDisplay from '../../../SymbolDisplay'

// 数量显示组件
const QuantityValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.black100};
`

// 价格显示组件
const PriceValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.black100};
`

// PnL 显示组件
const PnLValue = styled.div<{ $isProfit?: boolean }>`
  font-weight: 400;
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.black100 : $isProfit ? theme.green100 : theme.red100};
`

// 百分比显示组件
const PercentageValue = styled.div<{ $isProfit?: boolean }>`
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.black100 : $isProfit ? theme.green100 : theme.red100};
`

// PnL和ROE容器组件
const PnLContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

// Liq. price显示组件
const LiqPriceValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.yellow200};
`

// Initial margin显示组件
const InitialMarginValue = styled.div`
  font-weight: 400;
  color: ${({ theme }) => theme.black100};
`

const VaultPositions = memo<VaultPositionsOrdersProps>(({ activeTab, vaultId, strategyId }) => {
  // 获取positions数据
  const { positions: vaultPositions, isLoading: isLoadingPositions } = useVaultPositions(vaultId || '')
  const { positions: strategyPositions, isLoading: isLoadingStrategyPositions } = useStrategyPositions(strategyId || '')
  const { formatPrice } = useSymbolPrecision()

  const rawPositions = useMemo(() => {
    return activeTab === DETAIL_TYPE.VAULT ? vaultPositions : strategyPositions
  }, [activeTab, vaultPositions, strategyPositions])

  // 使用排序状态管理hook
  const { sortState, handleSort } = useSort()

  // 使用可排序表头hook
  const createSortableHeader = useSortableHeader(sortState, handleSort)

  // 前端排序逻辑（业务相关）
  const sortPositions = useCallback(
    (positions: VaultPosition[], field: string | null, direction: SortDirection): VaultPosition[] => {
      if (!field || direction === SortDirection.NONE) {
        return positions
      }

      const sorted = [...positions].sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (field) {
          case 'symbol':
            aValue = a.displaySymbol?.toLowerCase() || ''
            bValue = b.displaySymbol?.toLowerCase() || ''
            break
          case 'value':
            aValue = Number(a.value) || 0
            bValue = Number(b.value) || 0
            break
          case 'pnl_roe':
            // pnl_roe按照pnl排序
            aValue = Number(a.pnl) || 0
            bValue = Number(b.pnl) || 0
            break
          case 'initial_margin':
            aValue = Number(a.initial_margin) || 0
            bValue = Number(b.initial_margin) || 0
            break
          default:
            return 0
        }

        if (typeof aValue === 'string') {
          return direction === SortDirection.ASC ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        } else {
          return direction === SortDirection.ASC ? aValue - bValue : bValue - aValue
        }
      })

      return sorted
    },
    [],
  )

  // 应用排序的positions数据
  const positions = useMemo(() => {
    return sortPositions(rawPositions, sortState.field, sortState.direction)
  }, [rawPositions, sortState.field, sortState.direction, sortPositions])

  // Positions 表格列定义
  const positionsColumns: ColumnDef<VaultPosition>[] = useMemo(() => {
    const baseColumns: ColumnDef<VaultPosition>[] = [
      {
        key: 'symbol',
        title: createSortableHeader(<Trans>Symbol</Trans>, 'symbol'),
        width: '200px',
        render: (position) => (
          <SymbolDisplay
            symbol={position.symbol}
            displaySymbol={position.displaySymbol}
            token={position.token}
            logoUrl={position.logoUrl}
            positionSide={position.position_side}
            type={position.type}
            leverage={position.leverage}
          />
        ),
      },
      {
        key: 'quantity',
        title: <Trans>Qty.</Trans>,
        width: '150px',
        render: (position) => (
          <QuantityValue>
            {formatNumber(Math.abs(position.position_qty))} {position.token}
          </QuantityValue>
        ),
      },
      {
        key: 'value',
        title: createSortableHeader(<Trans>Value</Trans>, 'value'),
        width: '150px',
        render: (position) => <PriceValue>{formatNumber(toFix(position.value, 2), { showDollar: true })}</PriceValue>,
      },
      {
        key: 'entry_price',
        title: <Trans>Entry price</Trans>,
        width: '120px',
        render: (position) => (
          <PriceValue>{formatNumber(formatPrice(position.average_open_price, position.symbol))}</PriceValue>
        ),
      },
      {
        key: 'mark_price',
        title: <Trans>Mark price</Trans>,
        width: '120px',
        render: (position) => (
          <PriceValue>{formatNumber(formatPrice(position.mark_price, position.symbol))}</PriceValue>
        ),
      },
    ]

    // PnL (ROE%) 列定义
    const pnlColumn: ColumnDef<VaultPosition> = {
      key: 'pnl_roe',
      title: createSortableHeader(<Trans>PnL (ROE%)</Trans>, 'pnl_roe'),
      width: '150px',
      align: 'left',
      render: (position) => {
        const pnlValue = position.pnl
        const roePercentage = position.roe
        return (
          <PnLContainer>
            <PnLValue $isProfit={pnlValue >= 0}>{formatNumber(toFix(pnlValue, 2), { showDollar: true })}</PnLValue>
            <PercentageValue $isProfit={roePercentage >= 0}>({toFix(roePercentage, 2)}%)</PercentageValue>
          </PnLContainer>
        )
      },
    }

    if (activeTab === DETAIL_TYPE.STRATEGY) {
      // 策略模式：在 PnL (ROE%) 前面添加 Liq. price，后面添加 Initial margin
      return [
        ...baseColumns,
        {
          key: 'liq_price',
          title: <Trans>Liq. price</Trans>,
          width: '150px',
          render: (position) => (
            <LiqPriceValue>
              {position.est_liq_price ? formatNumber(formatPrice(position.est_liq_price, position.symbol)) : '--'}
            </LiqPriceValue>
          ),
        },
        pnlColumn,
        {
          key: 'initial_margin',
          title: createSortableHeader(<Trans>Margin</Trans>, 'initial_margin'),
          width: '120px',
          align: 'left',
          render: (position) => (
            <InitialMarginValue>
              {position.initial_margin ? formatNumber(toFix(position.initial_margin, 2), { showDollar: true }) : '--'}
            </InitialMarginValue>
          ),
        },
      ]
    } else {
      // 金库模式：只显示 PnL (ROE%)
      return [...baseColumns, pnlColumn]
    }
  }, [activeTab, createSortableHeader, formatPrice])

  if ((isLoadingPositions || isLoadingStrategyPositions) && positions.length === 0) {
    return (
      <LoadingWrapper>
        <Pending isNotButtonLoading />
      </LoadingWrapper>
    )
  }

  return (
    <StyledTable
      data={positions}
      columns={positionsColumns}
      emptyText={<NoData />}
      headerBodyGap={0}
      rowHeight={48}
      rowGap={0}
      showPagination={false}
    />
  )
})

VaultPositions.displayName = 'VaultPositions'

export default VaultPositions
