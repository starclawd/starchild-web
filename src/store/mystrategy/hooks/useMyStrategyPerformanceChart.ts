import { useGetUserBalanceHistoryQuery } from 'api/strategy'
import { useMemo, useRef } from 'react'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'

interface UseMyStrategyPerformanceChartParams {
  timeRange?: VaultChartTimeRange
  skip?: boolean
}

export interface MyStrategyPerformanceChartData {
  data: Array<{
    strategyId: string
    strategyName: string
    data: Array<{ timestamp: number; value: number }>
  }>
  allStrategies: Array<{
    strategyId: string
    strategyName: string
  }>
  isLoading: boolean
  hasData: boolean
  chartType: 'EQUITY'
}

// 根据时间范围计算开始时间戳
// 为了避免频繁重新计算，使用相对稳定的时间基准
const getStartTimestamp = (timeRange: VaultChartTimeRange): number | undefined => {
  // 使用当前小时的开始作为基准，减少变化频率
  const now = new Date()
  now.setMinutes(0, 0, 0) // 设置为当前小时的开始
  const baseTime = now.getTime()

  switch (timeRange) {
    case '24h':
      return baseTime - 24 * 60 * 60 * 1000
    case '7d':
      return baseTime - 7 * 24 * 60 * 60 * 1000
    case '30d':
      return baseTime - 30 * 24 * 60 * 60 * 1000
    case 'all_time':
      return undefined
    default:
      return undefined
  }
}

export const useMyStrategyPerformanceChart = ({
  timeRange = '30d',
  skip = false,
}: UseMyStrategyPerformanceChartParams): MyStrategyPerformanceChartData => {
  // 缓存 startTs，避免每次渲染都重新计算导致疯狂调用
  const startTs = useMemo(() => getStartTimestamp(timeRange), [timeRange])

  // 获取用户余额历史数据
  const {
    data: chartData,
    isLoading,
    error,
  } = useGetUserBalanceHistoryQuery(
    {
      history_limit: 1000,
      start_ts: startTs,
    },
    {
      skip,
      refetchOnMountOrArgChange: true,
      pollingInterval: 5 * 60 * 1000, // 5分钟轮询一次
    },
  )

  const processedData = useMemo(() => {
    // 当skip为true时，返回空数据
    if (skip) {
      return {
        data: [],
        allStrategies: [],
        isLoading: false,
        hasData: false,
        chartType: 'EQUITY' as const,
      }
    }

    // 如果有错误，停止loading状态
    if (error) {
      return {
        data: [],
        allStrategies: [],
        isLoading: false,
        hasData: false,
        chartType: 'EQUITY' as const,
      }
    }

    // 如果没有数据或数据为空，但不在加载中，返回空状态
    if (!chartData || !chartData.strategies?.length) {
      return {
        data: [],
        allStrategies: [],
        isLoading,
        hasData: false,
        chartType: 'EQUITY' as const,
      }
    }

    // 处理所有策略数据
    const allStrategies = chartData.strategies.map((strategy) => ({
      strategyId: strategy.strategyId,
      strategyName: strategy.strategyName,
    }))

    // 处理图表数据
    const data = chartData.strategies.map((strategy) => {
      // 将每个策略的数据转换为图表所需格式
      const sortedData = [...strategy.data]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((item) => ({
          timestamp: item.timestamp,
          value: item.availableBalance, // 使用 availableBalance 作为图表值
        }))

      return {
        strategyId: strategy.strategyId,
        strategyName: strategy.strategyName,
        data: sortedData,
      }
    })

    return {
      data,
      allStrategies,
      isLoading,
      hasData: data.some((strategy) => strategy.data.length > 0),
      chartType: 'EQUITY' as const,
    }
  }, [chartData, isLoading, error, skip])

  return processedData
}

export default useMyStrategyPerformanceChart
