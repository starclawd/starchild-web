import { useGetVaultPerformanceChartQuery } from 'api/vaults'
import { useMemo } from 'react'

interface UseVaultsPnLChartDataParams {
  vaultId: string
  timeRange?: '24h' | '7d' | '30d' | 'all_time'
  skip?: boolean
}

export interface VaultsPnLChartData {
  data: Array<{ timestamp: number; value: number }>
  isLoading: boolean
  isPositive?: boolean
  hasData: boolean
}

export const useVaultsPnLChartData = ({ vaultId, timeRange = 'all_time', skip = false }: UseVaultsPnLChartDataParams): VaultsPnLChartData => {
  // 获取 PnL 数据，使用 7d 时间范围来显示趋势
  const { data: chartData, isLoading } = useGetVaultPerformanceChartQuery(
    {
      vault_id: vaultId,
      type: 'PNL',
      time_range: timeRange,
    },
    {
      // 每 5 分钟重新获取一次数据
      pollingInterval: 5 * 60 * 1000,
      // 如果没有 vaultId 就跳过请求
      skip: skip || !vaultId,
    },
  )

  const processedData = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        data: [],
        isLoading,
        hasData: false,
      }
    }

    // 处理数据，确保时间戳是递增的
    const sortedData = [...chartData]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item) => ({
        timestamp: item.timestamp,
        value: item.value,
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
    }
  }, [chartData, isLoading])

  return processedData
}

export default useVaultsPnLChartData
