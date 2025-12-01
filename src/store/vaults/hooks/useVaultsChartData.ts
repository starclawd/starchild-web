import { useGetVaultPerformanceChartQuery } from 'api/vaults'
import { useMemo } from 'react'
import { VaultChartType, VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'

interface UseVaultsChartDataParams {
  vaultId: string
  timeRange?: VaultChartTimeRange
  type?: VaultChartType
  skip?: boolean
}

export interface VaultsChartData {
  data: Array<{ timestamp: number; value: number }>
  isLoading: boolean
  isPositive?: boolean
  hasData: boolean
  chartType: VaultChartType
}

export const useVaultsChartData = ({
  vaultId,
  timeRange = 'all_time',
  type = 'PNL',
  skip = false,
}: UseVaultsChartDataParams): VaultsChartData => {
  // 根据type获取对应的图表数据
  const { data: chartData, isLoading } = useGetVaultPerformanceChartQuery(
    {
      vault_id: vaultId,
      type,
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
        chartType: type,
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
      chartType: type,
    }
  }, [chartData, isLoading, type])

  return processedData
}

export default useVaultsChartData
