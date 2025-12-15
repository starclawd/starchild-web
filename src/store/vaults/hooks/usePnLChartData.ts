import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { useChartJsDataFormat } from '../../../pages/Vaults/components/Leaderboard/components/PnLChart/hooks/useChartJsDataFormat'
import { useGetBalanceHistoryLeaderboardQuery } from '../../../api/strategy'

interface VaultChartData {
  vaultId: string
  strategyId: string
  strategyName: string
  data: Array<{ timestamp: number; value: number }>
  color: string
  isPositive: boolean
  type: string
  creatorAvatar?: string
}

/**
 * 获取多个Vault的PnL图表数据
 */
export const usePnLChartData = () => {
  const theme = useTheme()

  // 获取余额历史排行榜数据
  const { data: leaderboardData, isLoading } = useGetBalanceHistoryLeaderboardQuery()

  // 暂时只支持5组数据
  const CHART_COLORS = useMemo(
    () => [theme.brand100, theme.purple100, theme.blue100, theme.yellow100, theme.green100],
    [theme.brand100, theme.purple100, theme.blue100, theme.yellow100, theme.green100],
  )

  const chartData = useMemo(() => {
    if (!leaderboardData?.strategies) {
      return []
    }

    const result: VaultChartData[] = []

    leaderboardData.strategies.forEach((strategy, index) => {
      if (strategy.data && strategy.data.length > 0) {
        // 转换数据格式，将 available_balance 作为 value
        const chartPoints = strategy.data.map((point) => ({
          timestamp: point.timestamp,
          value: point.available_balance,
        }))

        // 判断是否为正收益（比较首尾数据点）
        const firstValue = chartPoints[0]?.value || 0
        const lastValue = chartPoints[chartPoints.length - 1]?.value || 0
        const isPositive = lastValue >= firstValue

        result.push({
          vaultId: strategy.vault_id,
          strategyId: strategy.strategy_id,
          strategyName: strategy.strategy_name,
          data: chartPoints,
          color: CHART_COLORS[index % CHART_COLORS.length],
          isPositive,
          type: strategy.strategy_type,
          creatorAvatar: undefined, // API中没有此信息
        })
      }
    })

    return result
  }, [leaderboardData?.strategies, CHART_COLORS])

  const hasData = chartData.length > 0

  // 缓存 options 对象，避免频繁重新创建导致重渲染
  const chartJsOptions = useMemo(
    () => ({
      defaultPositiveColor: theme.jade10,
      defaultNegativeColor: theme.ruby50,
      aggregateByDay: false,
    }),
    [theme.jade10, theme.ruby50],
  )

  // 使用通用的Chart.js数据格式化hooks
  const chartJsData = useChartJsDataFormat(chartData, chartJsOptions)

  return {
    chartData,
    chartJsData,
    isLoading,
    hasData,
    vaultCount: chartData.length,
  }
}
