import { useEffect, useState } from 'react'
import { useGetStrategyPerformanceQuery } from 'api/strategy'

export const useStrategyPerformance = (strategyId: string | undefined, period: string) => {
  const [error, setError] = useState<string | null>(null)

  // 获取策略性能数据
  const {
    data: performanceData,
    isLoading,
    error: queryError,
    refetch,
  } = useGetStrategyPerformanceQuery(
    {
      strategy_id: strategyId || '',
      period: period === 'all_time' ? 'all' : period,
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
