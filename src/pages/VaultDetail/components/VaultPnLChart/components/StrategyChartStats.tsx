import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent } from 'utils/format'
import { useStrategyPerformance } from 'store/vaultsdetail/hooks/useStrategyPerformance'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail.d'
import { toFix } from 'utils/calc'
import { t } from '@lingui/core/macro'
import { DataModeType } from 'store/vaultsdetail/vaultsdetail'

const ChartStats = styled.div<{ $columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columnCount }) => $columnCount}, 1fr);
  gap: 4px;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      grid-template-columns: repeat(2, 1fr);
    `}
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
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
    if (value === null || value === undefined) return theme.textL4
    if (!$showSignColor) return theme.textL1
    if (value === 0) return theme.textL1
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
  dataMode: DataModeType
  strategyId: string
  chartTimeRange: VaultChartTimeRange
}

const StrategyChartStats = memo<StrategyChartStatsProps>(({ dataMode, strategyId, chartTimeRange }) => {
  const { performanceData, isLoading, error } = useStrategyPerformance(strategyId, chartTimeRange, dataMode)

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
    return (
      <ChartStats $columnCount={columnCount}>
        <StatItem>
          <StatLabel>
            <Trans>Initial Equity</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>
            <Trans>Age</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>
            <Trans>PnL</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        {shouldShowPeriodApr && (
          <StatItem>
            <StatLabel>{getPeriodAprLabel()}</StatLabel>
            <StatValue>--</StatValue>
          </StatItem>
        )}
        <StatItem>
          <StatLabel>
            <Trans>All-time APY</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>
            <Trans>Max Drawdown</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
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

  return (
    <ChartStats $columnCount={columnCount}>
      <StatItem>
        <StatLabel>
          <Trans>Initial Equity</Trans>
        </StatLabel>
        <StatValue value={initialEquity}>
          {initialEquity === null || initialEquity === undefined ? '--' : `$${formatNumber(initialEquity)}`}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Age</Trans>
        </StatLabel>
        <StatValue value={ageDays}>{ageDays === null || ageDays === undefined ? '--' : ageDays}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>PnL</Trans>
        </StatLabel>
        <StatValue value={pnl} $showSignColor={true}>
          {pnl === null || pnl === undefined ? '--' : `$${formatKMBNumber(pnl, 2)}`}
        </StatValue>
      </StatItem>
      {shouldShowPeriodApr && (
        <StatItem>
          <StatLabel>{getPeriodAprLabel()}</StatLabel>
          <StatValue value={periodApr} $showSignColor={true}>
            {periodApr === null || periodApr === undefined ? '--' : formatPercent({ value: periodApr, precision: 2 })}
          </StatValue>
        </StatItem>
      )}
      <StatItem>
        <StatLabel>
          <Trans>All-time APY</Trans>
        </StatLabel>
        <StatValue value={apr} $showSignColor={true}>
          {apr === null || apr === undefined ? '--' : formatPercent({ value: apr, precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Max Drawdown</Trans>
        </StatLabel>
        <StatValue value={maxDrawdown}>
          {maxDrawdown === null || maxDrawdown === undefined
            ? '--'
            : formatPercent({ value: Math.abs(maxDrawdown), precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem>
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
