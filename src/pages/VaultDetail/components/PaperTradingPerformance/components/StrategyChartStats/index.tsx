import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { formatNumber, formatKMBNumber, formatPercent, getStatValueColor } from 'utils/format'
import { useStrategyPerformance } from 'store/vaultsdetail/hooks/useStrategyPerformance'
import { CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail.d'
import { toFix } from 'utils/calc'
import { isMatchCurrentRouter } from 'utils'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { ANI_DURATION, SHOW_APR_AGE_DAYS } from 'constants/index'
import { useIsShowStrategyMarket } from 'store/vaultsdetailcache/hooks'
import { useVibeTradingStrategyInfo } from 'store/vaultsdetail/hooks'

const ChartStats = styled.div<{ $isShowStrategyMarket: boolean; $isVaultDetailPage?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  transition: all ${ANI_DURATION}s;
  ${({ $isVaultDetailPage, theme, $isShowStrategyMarket }) =>
    $isVaultDetailPage &&
    css`
      padding: 0 40px;
      height: 74px;
      border-top: 1px solid ${theme.black800};
      ${theme.mediaMaxWidth.width1280`
        padding: 0 20px;
      `}
      ${$isShowStrategyMarket &&
      css`
        ${theme.mediaMaxWidth.width1440`
          padding: 0 20px;
        `}
      `}
    `}
`

const StatItem = styled.div<{ $isVaultDetailPage?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
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
  strategyId: string | undefined
  chartTimeRange: CHAT_TIME_RANGE
}

const StrategyChartStats = memo<StrategyChartStatsProps>(({ strategyId, chartTimeRange }) => {
  const { performanceData } = useStrategyPerformance(strategyId, '30d')
  const { strategyInfo } = useVibeTradingStrategyInfo({ strategyId })
  const currentRouter = useCurrentRouter()
  const isVaultDetailPage = isMatchCurrentRouter(currentRouter, ROUTER.VAULT_DETAIL)
  const [isShowStrategyMarket] = useIsShowStrategyMarket()

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
      getValue: () => strategyInfo?.initial_balance || 0,
      formatValue: (v) => formatNumber(v, { showDollar: true }),
    },
    {
      key: 'age',
      label: <Trans>Age(days)</Trans>,
      getValue: () => strategyInfo?.age_days || 0,
      formatValue: (v) => String(v),
    },
    {
      key: 'pnl',
      label: <Trans>PnL</Trans>,
      getValue: () => strategyInfo?.pnl || 0,
      formatValue: (v) => formatKMBNumber(v, 2, { showDollar: true }),
      showPnlColor: true,
    },
    {
      key: 'roe',
      label: <Trans>ROE</Trans>,
      getValue: () => strategyInfo?.roe || 0,
      formatValue: (v) => formatPercent({ value: v, precision: 1 }),
      showPnlColor: true,
    },
    {
      key: 'apr',
      label: <Trans>30D APR</Trans>,
      getValue: () => performanceData?.apr || 0,
      formatValue: (v) => formatPercent({ value: v, precision: 1 }),
      showPnlColor: true,
      visible: (strategyInfo?.age_days || 0) >= SHOW_APR_AGE_DAYS && (strategyInfo?.roe || 0) > 0,
    },
    {
      key: 'allTimeApr',
      label: <Trans>All-time APR</Trans>,
      getValue: () => strategyInfo?.all_time_apr || 0,
      formatValue: (v) => formatPercent({ value: v, precision: 1 }),
      showPnlColor: true,
      visible: (strategyInfo?.age_days || 0) >= SHOW_APR_AGE_DAYS && (strategyInfo?.roe || 0) > 0,
    },
    {
      key: 'maxDrawdown',
      label: <Trans>Max Drawdown</Trans>,
      getValue: () => strategyInfo?.max_drawdown || 0,
      formatValue: (v) => formatPercent({ value: Math.abs(v), precision: 1 }),
    },
    {
      key: 'sharpeRatio',
      label: <Trans>Sharpe Ratio</Trans>,
      getValue: () => strategyInfo?.sharpe_ratio || 0,
      formatValue: (v) => formatNumber(toFix(v, 1)),
    },
  ]

  // 过滤掉不可见的项
  const visibleStats = statConfigs.filter((config) => config.visible !== false)

  return (
    <ChartStats $isShowStrategyMarket={isShowStrategyMarket} $isVaultDetailPage={isVaultDetailPage}>
      {visibleStats.map((config) => {
        const value = config.getValue()
        const displayValue = config.formatValue(value || 0)

        return (
          <StatItem $isVaultDetailPage={isVaultDetailPage} key={config.key}>
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
