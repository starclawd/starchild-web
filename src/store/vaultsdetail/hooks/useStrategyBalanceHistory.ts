import { useGetStrategyBalanceHistoryQuery, StrategyBalanceHistoryResponse } from 'api/strategy'
import { useMemo } from 'react'
import { VaultChartTimeRange, VaultChartType } from 'store/vaultsdetail/vaultsdetail'
import { VaultsChartData } from 'store/vaults/hooks/useVaultsChartData'

interface UseStrategyBalanceHistoryParams {
  strategyId: string
  timeRange?: VaultChartTimeRange
  type?: VaultChartType
  skip?: boolean
}

// 将 timeRange 转换为对应的 start_ts
const getStartTimestamp = (timeRange: VaultChartTimeRange): number | undefined => {
  const now = Date.now()

  switch (timeRange) {
    case '24h':
      return now - 24 * 60 * 60 * 1000
    case '7d':
      return now - 7 * 24 * 60 * 60 * 1000
    case '30d':
      return now - 30 * 24 * 60 * 60 * 1000
    case 'all_time':
    default:
      return undefined // 不设置 start_ts，获取全部历史数据
  }
}

export const useStrategyBalanceHistory = ({
  strategyId,
  timeRange = 'all_time',
  type = 'PNL',
  skip = false,
}: UseStrategyBalanceHistoryParams): VaultsChartData => {
  // 根据 timeRange 计算 start_ts
  const startTs = useMemo(() => {
    return getStartTimestamp(timeRange)
  }, [timeRange])

  // 获取策略余额历史数据
  const { data: balanceHistoryData, isLoading } = useGetStrategyBalanceHistoryQuery(
    {
      strategy_id: strategyId,
      start_ts: startTs,
      // 不设置 end_ts，默认获取到最新时间
      limit: 1000,
    },
    {
      // 每 5 分钟重新获取一次数据
      pollingInterval: 5 * 60 * 1000,
      // 如果没有 strategyId 就跳过请求
      skip: !strategyId,
    },
  )

  const processedData = useMemo(() => {
    if (!balanceHistoryData || balanceHistoryData.data.length === 0) {
      return {
        data: [],
        isLoading,
        hasData: false,
        chartType: type,
      }
    }

    // 处理数据，确保时间戳是递增的，将 available_balance 映射为 value
    const sortedData = [...balanceHistoryData.data]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item) => ({
        timestamp: item.timestamp,
        value: item.available_balance, // 使用 available_balance 作为图表的 value
      }))

    // 判断整体趋势是否为正
    const firstValue = sortedData[0]?.value || 0
    const lastValue = sortedData[sortedData.length - 1]?.value || 0
    const isPositive = lastValue >= firstValue

    return {
      data: sortedData,
      isLoading,
      isPositive,
      hasData: sortedData.length > 0,
      chartType: type,
    }
  }, [balanceHistoryData, isLoading, type])

  return processedData
}

export default useStrategyBalanceHistory
