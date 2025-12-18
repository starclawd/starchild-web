import { useEffect, useState } from 'react'
import { useGetStrategyPerformanceQuery, StrategyPerformance } from 'api/strategy'
import { DataModeType } from '../vaultsdetail'

export const useStrategyPerformance = (strategyId: string, period: string, dataMode?: DataModeType) => {
  const [error, setError] = useState<string | null>(null)

  // 获取策略性能数据
  const {
    data: performanceData,
    isLoading,
    error: queryError,
    refetch,
  } = useGetStrategyPerformanceQuery(
    {
      strategy_id: strategyId,
      period: period === 'all_time' ? 'all' : period,
      dataMode,
    },
    {
      skip: !strategyId || !period,
    },
  )

  // 处理错误状态
  useEffect(() => {
    setError(queryError ? 'Failed to fetch strategy performance data' : null)
  }, [queryError])

  return {
    performanceData,
    isLoading,
    error,
    refetch,
  }
}
