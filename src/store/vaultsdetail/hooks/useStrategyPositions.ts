import { useGetStrategyPositionsQuery, StrategyPosition } from 'api/strategy'

// Strategy Position hook - 获取策略持仓数据
export function useStrategyPositions(strategyId: string) {
  const {
    data: positions = [],
    isLoading,
    error,
    refetch,
  } = useGetStrategyPositionsQuery(
    { strategy_id: strategyId },
    {
      skip: !strategyId, // 当strategyId为空时跳过查询
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000, // 每1分钟轮询一次
    },
  )

  return {
    positions,
    isLoading,
    error,
    refetch,
    totalCount: positions.length,
  }
}
