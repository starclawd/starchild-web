import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent } from 'utils/format'
import { useStrategyPerformance } from 'store/vaultsdetail/hooks/useStrategyPerformance'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail.d'
import { toFix } from 'utils/calc'
import { t } from '@lingui/core/macro'

const ChartStats = styled.div<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columnCount }) => $columnCount}, 1fr);
  width: 100%;
  border: 1px solid ${({ theme }) => theme.black600};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: repeat(2, 1fr);
    `}
`

const StatItem = styled.div<{ $columnCount: number; $index: number }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border-right: 1px solid ${({ theme }) => theme.black600};
  border-bottom: 1px solid ${({ theme }) => theme.black600};

  /* 桌面端：移除最后一列的右边框 */
  ${({ $columnCount, $index }) =>
    ($index + 1) % $columnCount === 0 &&
    css`
      border-right: none;
    `}

  /* 桌面端：移除最后一行的下边框 */
  ${({ $columnCount, $index }) => {
    const totalItems = $columnCount === 6 ? 6 : 7 // 根据是否显示Period APR
    const isLastRow = $index >= totalItems - $columnCount
    return (
      isLastRow &&
      css`
        border-bottom: none;
      `
    )
  }}


  ${({ theme, $index }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      padding: ${vm(8)} ${vm(12)};

      /* 移动端：移除偶数位置（每行第2个）的右边框 */
      ${($index + 1) % 2 === 0 &&
      css`
        border-right: none;
      `}

      /* 移动端：移除最后一行的下边框 */
      &:nth-last-child(-n + 2) {
        border-bottom: none;
      }
    `}
`

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.black200};
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
  `}
`

const StatValue = styled.span<{ value?: number | null; $showSignColor?: boolean }>`
  font-size: 16px;
  color: ${({ value, $showSignColor = false, theme }) => {
    if (value === null || value === undefined) return theme.black300
    if (!$showSignColor) return theme.black0
    if (value === 0) return theme.black0
    return value > 0 ? theme.jade10 : theme.ruby50
  }};
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

interface StrategyChartStatsProps {
  strategyId: string
  chartTimeRange: VaultChartTimeRange
}

const StrategyChartStats = memo<StrategyChartStatsProps>(({ strategyId, chartTimeRange }) => {
  const { performanceData, isLoading, error } = useStrategyPerformance(strategyId, chartTimeRange)

  // 根据期间获取APR标签名称
  const getPeriodAprLabel = () => {
    switch (chartTimeRange) {
      case '24h':
        return t`24H APY`
      case '7d':
        return t`7D APY`
      case '30d':
        return t`30D APY`
      default:
        return t`Period APY`
    }
  }

  // 是否显示Period APR（all_time时不显示）
  const shouldShowPeriodApr = chartTimeRange !== 'all_time'

  // 根据是否显示Period APR决定列数
  const columnCount = shouldShowPeriodApr ? 7 : 6

  if (isLoading || !performanceData) {
    let itemIndex = 0
    return (
      <ChartStats $columnCount={columnCount}>
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>
            <Trans>Initial Equity</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>
            <Trans>Age</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>
            <Trans>PnL</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        {shouldShowPeriodApr && (
          <StatItem $columnCount={columnCount} $index={itemIndex++}>
            <StatLabel>{getPeriodAprLabel()}</StatLabel>
            <StatValue>--</StatValue>
          </StatItem>
        )}
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>
            <Trans>All-time APY</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>
            <Trans>Max Drawdown</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>
            <Trans>Sharpe Ratio</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
      </ChartStats>
    )
  }

  // 计算显示数据
  const initialEquity = performanceData.initial_balance
  const pnl = performanceData.pnl
  const apr = performanceData.all_time_apr
  const periodApr = performanceData.apr
  const maxDrawdown = performanceData.max_drawdown
  const sharpeRatio = performanceData.sharpe_ratio
  const ageDays = performanceData.age_days

  let itemIndex = 0
  return (
    <ChartStats $columnCount={columnCount}>
      <StatItem $columnCount={columnCount} $index={itemIndex++}>
        <StatLabel>
          <Trans>Initial Equity</Trans>
        </StatLabel>
        <StatValue value={initialEquity}>
          {initialEquity === null || initialEquity === undefined
            ? '--'
            : formatNumber(initialEquity, { showDollar: true })}
        </StatValue>
      </StatItem>
      <StatItem $columnCount={columnCount} $index={itemIndex++}>
        <StatLabel>
          <Trans>Age</Trans>
        </StatLabel>
        <StatValue value={ageDays}>{ageDays === null || ageDays === undefined ? '--' : ageDays}</StatValue>
      </StatItem>
      <StatItem $columnCount={columnCount} $index={itemIndex++}>
        <StatLabel>
          <Trans>PnL</Trans>
        </StatLabel>
        <StatValue value={pnl} $showSignColor={true}>
          {pnl === null || pnl === undefined ? '--' : formatKMBNumber(pnl, 2, { showDollar: true })}
        </StatValue>
      </StatItem>
      {shouldShowPeriodApr && (
        <StatItem $columnCount={columnCount} $index={itemIndex++}>
          <StatLabel>{getPeriodAprLabel()}</StatLabel>
          <StatValue value={periodApr} $showSignColor={true}>
            {periodApr === null || periodApr === undefined ? '--' : formatPercent({ value: periodApr, precision: 2 })}
          </StatValue>
        </StatItem>
      )}
      <StatItem $columnCount={columnCount} $index={itemIndex++}>
        <StatLabel>
          <Trans>All-time APY</Trans>
        </StatLabel>
        <StatValue value={apr} $showSignColor={true}>
          {apr === null || apr === undefined ? '--' : formatPercent({ value: apr, precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem $columnCount={columnCount} $index={itemIndex++}>
        <StatLabel>
          <Trans>Max Drawdown</Trans>
        </StatLabel>
        <StatValue value={maxDrawdown}>
          {maxDrawdown === null || maxDrawdown === undefined
            ? '--'
            : formatPercent({ value: Math.abs(maxDrawdown), precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem $columnCount={columnCount} $index={itemIndex++}>
        <StatLabel>
          <Trans>Sharpe Ratio</Trans>
        </StatLabel>
        <StatValue value={sharpeRatio}>
          {sharpeRatio === null || sharpeRatio === undefined ? '--' : formatNumber(toFix(sharpeRatio, 2))}
        </StatValue>
      </StatItem>
    </ChartStats>
  )
})

StrategyChartStats.displayName = 'StrategyChartStats'

export default StrategyChartStats
