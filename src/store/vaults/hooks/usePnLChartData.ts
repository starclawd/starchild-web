import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { useChartJsDataFormat } from './useChartJsDataFormat'
import { useVaultsPnLChartData } from './useVaultsPnLChartData'
import { useLeaderboardData } from './useLeaderboardData'

interface VaultChartData {
  vaultId: string
  vaultName: string
  data: Array<{ timestamp: number; value: number }>
  color: string
  isPositive: boolean
  type: 'protocol' | 'community'
  creatorAvatar?: string
}

/**
 * 获取多个Vault的PnL图表数据
 */
export const usePnLChartData = () => {
  const { topVaults } = useLeaderboardData()
  const theme = useTheme()

  // FIXME: 暂时只支持5组数据
  const CHART_COLORS = useMemo(
    () => [theme.brand100, theme.purple100, theme.blue100, theme.yellow100, theme.green100],
    [theme.brand100, theme.purple100, theme.blue100, theme.yellow100, theme.green100],
  )

  // 只取前5名来避免太多API调用，使用useMemo避免频繁创建新数组
  const top5Vaults = useMemo(() => topVaults.slice(0, 5), [topVaults])

  // 为每个vault获取PnL数据，只有当vaultId存在时才调用API
  const vault1Data = useVaultsPnLChartData({
    vaultId: top5Vaults[0]?.id || '',
    timeRange: 'all_time',
    skip: !top5Vaults[0]?.id,
  })
  const vault2Data = useVaultsPnLChartData({
    vaultId: top5Vaults[1]?.id || '',
    timeRange: 'all_time',
    skip: !top5Vaults[1]?.id,
  })
  const vault3Data = useVaultsPnLChartData({
    vaultId: top5Vaults[2]?.id || '',
    timeRange: 'all_time',
    skip: !top5Vaults[2]?.id,
  })
  const vault4Data = useVaultsPnLChartData({
    vaultId: top5Vaults[3]?.id || '',
    timeRange: 'all_time',
    skip: !top5Vaults[3]?.id,
  })
  const vault5Data = useVaultsPnLChartData({
    vaultId: top5Vaults[4]?.id || '',
    timeRange: 'all_time',
    skip: !top5Vaults[4]?.id,
  })

  const vaultDataArray = useMemo(
    () => [vault1Data, vault2Data, vault3Data, vault4Data, vault5Data],
    [vault1Data, vault2Data, vault3Data, vault4Data, vault5Data],
  )

  const chartData = useMemo(() => {
    const result: VaultChartData[] = []

    top5Vaults.forEach((vault, index) => {
      const data = vaultDataArray[index]
      if (data && data.hasData) {
        result.push({
          vaultId: vault.id,
          vaultName: vault.name,
          data: data.data,
          color: CHART_COLORS[index % CHART_COLORS.length],
          isPositive: data.isPositive || false,
          type: vault.type,
          creatorAvatar: vault.creatorAvatar,
        })
      }
    })

    return result
  }, [top5Vaults, vaultDataArray, CHART_COLORS])

  const isLoading = vaultDataArray.some((data) => data.isLoading)
  const hasData = chartData.length > 0

  // 缓存 options 对象，避免频繁重新创建导致重渲染
  const chartJsOptions = useMemo(
    () => ({
      defaultPositiveColor: theme.jade10,
      defaultNegativeColor: theme.ruby50,
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
