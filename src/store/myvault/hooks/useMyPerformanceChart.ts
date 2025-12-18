import { useGetMyPerformanceChartQuery } from 'api/vaults'
import { useMemo } from 'react'
import { VaultChartType, VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'

interface UseMyPerformanceChartParams {
  vaultId: string
  walletAddress: string
  timeRange?: VaultChartTimeRange
  type?: VaultChartType
  skip?: boolean
}

export interface MyPerformanceChartData {
  data: Array<{ timestamp: number; value: number }>
  isLoading: boolean
  isPositive?: boolean
  hasData: boolean
  chartType: VaultChartType
}

export const useMyPerformanceChart = ({
  vaultId,
  walletAddress,
  timeRange = 'all_time',
  type = 'PNL',
  skip = false,
}: UseMyPerformanceChartParams): MyPerformanceChartData => {
  // 根据type获取对应的个人表现图表数据
  const { data: chartData, isLoading } = useGetMyPerformanceChartQuery(
    {
      vault_id: vaultId,
      wallet_address: walletAddress,
      type,
      time_range: timeRange,
    },
    {
      // 每 5 分钟重新获取一次数据
      pollingInterval: 5 * 60 * 1000,
      // 如果没有必要参数就跳过请求
      skip: skip || !vaultId || !walletAddress,
    },
  )

  const processedData = useMemo(() => {
    // 当skip为true时（如钱包断开连接），主动返回空数据而不是缓存数据
    if (skip || !vaultId || !walletAddress || !chartData || chartData.length === 0) {
      return {
        data: [],
        isLoading: skip ? false : isLoading, // skip时不显示加载状态
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
  }, [chartData, isLoading, type, skip, vaultId, walletAddress])

  return processedData
}

export default useMyPerformanceChart
