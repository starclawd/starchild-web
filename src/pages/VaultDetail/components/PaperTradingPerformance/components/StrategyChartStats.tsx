import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent, getStatValueColor } from 'utils/format'
import { useStrategyPerformance } from 'store/vaultsdetail/hooks/useStrategyPerformance'
import { CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail.d'
import { toFix } from 'utils/calc'
import { t } from '@lingui/core/macro'

const ChartStats = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 58px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 20px;
`

const StatLabel = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black300};
`

const StatValue = styled.span<{ value?: number | null; $showPnlColor?: boolean }>`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ value, $showPnlColor = false, theme }) => getStatValueColor(value, $showPnlColor, theme)};
`

interface StrategyChartStatsProps {
  strategyId: string
  chartTimeRange: CHAT_TIME_RANGE
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

  // 定义统计项配置
  interface StatConfig {
    key: string
    label: React.ReactNode
    getValue: () => number | null | undefined
    formatValue: (value: number) => string
    showPnlColor?: boolean
    visible?: boolean
  }

  const statConfigs: StatConfig[] = [
    {
      key: 'initialEquity',
      label: <Trans>Initial Equity</Trans>,
      getValue: () => performanceData?.initial_balance,
      formatValue: (v) => formatNumber(v, { showDollar: true }),
    },
    {
      key: 'age',
      label: <Trans>Age</Trans>,
      getValue: () => performanceData?.age_days,
      formatValue: (v) => `${v} ${v === 1 ? t`Day` : t`Days`}`,
    },
    {
      key: 'pnl',
      label: <Trans>PnL</Trans>,
      getValue: () => performanceData?.pnl,
      formatValue: (v) => formatKMBNumber(v, 2, { showDollar: true }),
      showPnlColor: true,
    },
    {
      key: 'periodApr',
      label: getPeriodAprLabel(),
      getValue: () => performanceData?.apr,
      formatValue: (v) => formatPercent({ value: v, precision: 2 }),
      showPnlColor: true,
      visible: shouldShowPeriodApr,
    },
    {
      key: 'allTimeApy',
      label: <Trans>All-time APY</Trans>,
      getValue: () => performanceData?.all_time_apr,
      formatValue: (v) => formatPercent({ value: v, precision: 2 }),
      showPnlColor: true,
    },
    {
      key: 'maxDrawdown',
      label: <Trans>Max Drawdown</Trans>,
      getValue: () => performanceData?.max_drawdown,
      formatValue: (v) => formatPercent({ value: Math.abs(v), precision: 2 }),
    },
    {
      key: 'sharpeRatio',
      label: <Trans>Sharpe Ratio</Trans>,
      getValue: () => performanceData?.sharpe_ratio,
      formatValue: (v) => formatNumber(toFix(v, 2)),
    },
  ]

  // 过滤掉不可见的项
  const visibleStats = statConfigs.filter((config) => config.visible !== false)

  return (
    <ChartStats>
      {visibleStats.map((config) => {
        const value = isLoading || !performanceData ? undefined : config.getValue()
        const displayValue = value === null || value === undefined ? '--' : config.formatValue(value)

        return (
          <StatItem key={config.key}>
            <StatLabel>{config.label}</StatLabel>
            <StatValue value={value} $showPnlColor={config.showPnlColor}>
              {displayValue}
            </StatValue>
          </StatItem>
        )
      })}
    </ChartStats>
  )
})

StrategyChartStats.displayName = 'StrategyChartStats'

export default StrategyChartStats
