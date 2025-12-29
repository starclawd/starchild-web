import { useEffect, useState } from 'react'
import { useGetVaultPerformanceQuery, VaultPerformance } from 'api/vaults'
import { useCurrentVaultId } from './useVaultDetailState'
import { VaultChartTimeRange } from '../vaultsdetail.d'

export const useVaultPerformance = (chartTimeRange: VaultChartTimeRange) => {
  const currentVaultId = useCurrentVaultId()
  const [performanceData, setPerformanceData] = useState<VaultPerformance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取所有performance数据
  const {
    data: allPerformanceData,
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useGetVaultPerformanceQuery(
    { vault_id: currentVaultId || '' },
    {
      skip: !currentVaultId,
    },
  )

  // 根据时间范围筛选数据
  useEffect(() => {
    setIsLoading(isQueryLoading)
    setError(queryError ? 'Failed to fetch performance data' : null)

    if (!allPerformanceData || !chartTimeRange) {
      setPerformanceData(null)
      return
    }

    // 根据chartTimeRange找到对应的数据
    const targetData = allPerformanceData.find((item) => item.time_range === chartTimeRange)
    setPerformanceData(targetData || null)
  }, [allPerformanceData, chartTimeRange, isQueryLoading, queryError])

  return {
    performanceData,
    isLoading,
    error,
    refetch,
  }
}

// 获取指定时间范围的performance数据的hook
export const useFetchVaultPerformance = () => {
  const currentVaultId = useCurrentVaultId()

  return useGetVaultPerformanceQuery(
    { vault_id: currentVaultId || '' },
    {
      skip: !currentVaultId,
    },
  )
}
