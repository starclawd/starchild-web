import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent } from 'utils/format'
import { useStrategyPerformance } from 'store/vaultsdetail/hooks/useStrategyPerformance'
import { useCurrentVaultId, useCurrentStrategyId, useChartTimeRange } from 'store/vaultsdetail/hooks'
import { toFix } from 'utils/calc'
import { t } from '@lingui/core/macro'

const ChartStats = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16px;
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

const StatValue = styled.span<{ $positive?: boolean }>`
  font-size: 16px;
  color: ${({ $positive, theme }) =>
    $positive === undefined ? theme.textL1 : $positive ? theme.jade10 : theme.ruby50};
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

const StrategyChartStats = memo(() => {
  const [currentStrategyId] = useCurrentStrategyId()
  const [chartTimeRange] = useChartTimeRange()

  const { performanceData, isLoading, error } = useStrategyPerformance(currentStrategyId || '', chartTimeRange)

  // 根据期间获取APR标签名称
  const getPeriodAprLabel = () => {
    switch (chartTimeRange) {
      case '24h':
        return t`24h APR`
      case '7d':
        return t`7d APR`
      case '30d':
        return t`30d APR`
      default:
        return t`Period APR`
    }
  }

  // 是否显示Period APR（all_time时不显示）
  const shouldShowPeriodApr = chartTimeRange !== 'all_time'

  if (isLoading || !performanceData) {
    return (
      <ChartStats>
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
  const initialEquity = performanceData.start_balance
  const pnl = performanceData.pnl
  const apr = performanceData.all_time_apr / 100
  const periodApr = performanceData.apr / 100
  const maxDrawdown = performanceData.max_drawdown
  const sharpeRatio = performanceData.sharpe_ratio

  // 判断各项指标是否为正
  const isPnlPositive = pnl > 0
  const isAprPositive = apr > 0
  const isPeriodAprPositive = periodApr > 0

  const isMaxDrawdownPositive = maxDrawdown > 0 // drawdown通常为负值，正值表示没有下跌

  return (
    <ChartStats>
      <StatItem>
        <StatLabel>
          <Trans>Initial Equity</Trans>
        </StatLabel>
        <StatValue>
          {initialEquity === null || initialEquity === undefined ? '--' : `$${formatNumber(initialEquity)}`}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Age</Trans>
        </StatLabel>
        <StatValue>{performanceData.age_days}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>PnL</Trans>
        </StatLabel>
        <StatValue $positive={isPnlPositive}>
          {pnl === null || pnl === undefined ? '--' : `$${formatKMBNumber(pnl, 2)}`}
        </StatValue>
      </StatItem>
      {shouldShowPeriodApr && (
        <StatItem>
          <StatLabel>{getPeriodAprLabel()}</StatLabel>
          <StatValue $positive={isPeriodAprPositive}>
            {periodApr === null || periodApr === undefined ? '--' : formatPercent({ value: periodApr, precision: 2 })}
          </StatValue>
        </StatItem>
      )}
      <StatItem>
        <StatLabel>
          <Trans>APR</Trans>
        </StatLabel>
        <StatValue $positive={isAprPositive}>
          {apr === null || apr === undefined ? '--' : formatPercent({ value: apr, precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Max Drawdown</Trans>
        </StatLabel>
        <StatValue $positive={isMaxDrawdownPositive}>
          {maxDrawdown === null || maxDrawdown === undefined
            ? '--'
            : formatPercent({ value: Math.abs(maxDrawdown), precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Sharpe Ratio</Trans>
        </StatLabel>
        <StatValue>
          {sharpeRatio === null || sharpeRatio === undefined ? '--' : formatNumber(toFix(sharpeRatio, 2))}
        </StatValue>
      </StatItem>
    </ChartStats>
  )
})

StrategyChartStats.displayName = 'StrategyChartStats'

export default StrategyChartStats
