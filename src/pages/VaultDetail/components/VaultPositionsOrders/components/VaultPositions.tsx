import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Table, { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useActiveTab, useCurrentStrategyId, useCurrentVaultId, useVaultPositions } from 'store/vaultsdetail/hooks'
import { VaultPosition } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'
import { VaultDetailTabType } from 'store/vaultsdetail/vaultsdetail'
import NoData from 'components/NoData'

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

const SymbolLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 4px;
`

const PositionSideBar = styled.div<{ $isLong: boolean }>`
  width: 4px;
  height: 24px;
  background: ${({ theme, $isLong }) => ($isLong ? theme.green100 : theme.red100)};
`

const SymbolText = styled.div<{ $isLong?: boolean }>`
  font-weight: 400;
  color: ${({ theme, $isLong }) => ($isLong === undefined ? theme.textL2 : $isLong ? theme.green100 : theme.red100)};
`

// Symbol组件
interface SymbolDisplayProps {
  displaySymbol: string
  token: string
  logoUrl: string
  positionSide?: 'long' | 'short'
}

const SymbolDisplay = memo<SymbolDisplayProps>(({ displaySymbol, token, logoUrl, positionSide }) => {
  const isLong = positionSide === 'long'

  return (
    <SymbolContainer>
      <SymbolLogo
        src={logoUrl}
        alt={token}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      {positionSide && <PositionSideBar $isLong={isLong} />}
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

// PnL 显示组件
const PnLValue = styled.div<{ $isProfit?: boolean }>`
  font-weight: 400;
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.textL2 : $isProfit ? theme.green100 : theme.red100};
`

// 百分比显示组件
const PercentageValue = styled.div<{ $isProfit?: boolean }>`
  color: ${({ theme, $isProfit }) =>
    $isProfit === undefined ? theme.textL2 : $isProfit ? theme.green100 : theme.red100};
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
  color: ${({ theme }) => theme.textL2};
`

const VaultPositions = memo(() => {
  // 获取positions数据
  const [activeTab] = useActiveTab()
  const [vaultId] = useCurrentVaultId()
  const [strategyId] = useCurrentStrategyId()
  const { positions: vaultPositions, isLoading: isLoadingPositions } = useVaultPositions(vaultId || '')
  const { positions: strategyPositions, isLoading: isLoadingStrategyPositions } = useStrategyPositions(strategyId || '')

  const positions = useMemo(() => {
    return activeTab === 'vaults' ? vaultPositions : strategyPositions
  }, [activeTab, vaultPositions, strategyPositions])

  // Positions 表格列定义
  const positionsColumns: ColumnDef<VaultPosition>[] = useMemo(() => {
    const baseColumns: ColumnDef<VaultPosition>[] = [
      {
        key: 'symbol',
        title: <Trans>Symbol</Trans>,
        width: '180px',
        render: (position) => (
          <SymbolCell>
            <SymbolDisplay
              displaySymbol={position.displaySymbol}
              token={position.token}
              logoUrl={position.logoUrl}
              positionSide={position.position_side}
            />
          </SymbolCell>
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
        title: <Trans>Value</Trans>,
        width: '150px',
        render: (position) => <PriceValue>${formatNumber(toFix(position.value, 2))}</PriceValue>,
      },
      {
        key: 'entry_price',
        title: <Trans>Entry price</Trans>,
        width: '120px',
        render: (position) => <PriceValue>{formatNumber(position.average_open_price)}</PriceValue>,
      },
      {
        key: 'mark_price',
        title: <Trans>Mark price</Trans>,
        width: '120px',
        render: (position) => <PriceValue>{formatNumber(position.mark_price)}</PriceValue>,
      },
    ]

    // PnL (ROE%) 列定义
    const pnlColumn: ColumnDef<VaultPosition> = {
      key: 'pnl_roe',
      title: <Trans>PnL (ROE%)</Trans>,
      width: '150px',
      align: 'left',
      render: (position) => {
        const pnlValue = position.pnl
        const roePercentage = position.roe
        return (
          <PnLContainer>
            <PnLValue $isProfit={pnlValue >= 0}>
              {pnlValue >= 0 ? '' : '-'}${formatNumber(toFix(Math.abs(pnlValue), 2))}
            </PnLValue>
            <PercentageValue $isProfit={roePercentage >= 0}>({toFix(roePercentage, 2)}%)</PercentageValue>
          </PnLContainer>
        )
      },
    }

    if (activeTab === 'strategy') {
      // 策略模式：在 PnL (ROE%) 前面添加 Liq. price，后面添加 Initial margin
      return [
        ...baseColumns,
        {
          key: 'liq_price',
          title: <Trans>Liq. price</Trans>,
          width: '120px',
          render: (position) => (
            <LiqPriceValue>{position.est_liq_price ? formatNumber(position.est_liq_price) : '--'}</LiqPriceValue>
          ),
        },
        pnlColumn,
        {
          key: 'initial_margin',
          title: <Trans>Margin</Trans>,
          width: '150px',
          align: 'left',
          render: (position) => (
            <InitialMarginValue>
              {position.initial_margin ? `$${formatNumber(toFix(position.initial_margin, 2))}` : '--'}
            </InitialMarginValue>
          ),
        },
      ]
    } else {
      // 金库模式：只显示 PnL (ROE%)
      return [...baseColumns, pnlColumn]
    }
  }, [activeTab])

  if ((isLoadingPositions || isLoadingStrategyPositions) && positions.length === 0) {
    return (
      <LoadingWrapper>
        <Pending />
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
