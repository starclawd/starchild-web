import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Table, { ColumnDef } from 'components/Table'
import Pending from 'components/Pending'
import { useVaultPositions } from 'store/vaultsdetail/hooks'
import { VaultPosition } from 'api/vaults'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { useStrategyPositions } from 'store/vaultsdetail/hooks/useStrategyPositions'

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

interface VaultPositionsProps {
  vaultId: string
}

const VaultPositions = memo<VaultPositionsProps>(({ vaultId }) => {
  // 获取positions数据 (不分页，前端Table组件处理分页)
  const { positions, isLoading: isLoadingPositions } = useVaultPositions(vaultId)

  // Positions 表格列定义
  const positionsColumns: ColumnDef<VaultPosition>[] = useMemo(
    () => [
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
      {
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
      },
    ],
    [],
  )

  if (isLoadingPositions && positions.length === 0) {
    return <Pending />
  }

  return (
    <StyledTable
      data={positions}
      columns={positionsColumns}
      emptyText={<Trans>No positions available</Trans>}
      headerBodyGap={0}
      rowHeight={48}
      rowGap={0}
      showPagination={false}
    />
  )
})

VaultPositions.displayName = 'VaultPositions'

export default VaultPositions
