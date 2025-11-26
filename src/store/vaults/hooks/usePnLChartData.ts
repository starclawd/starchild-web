import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { useVaultsPnLChartData } from './useVaultsPnLChartData'
import { useLeaderboardData } from './useLeaderboardData'

interface VaultChartData {
  vaultId: string
  vaultName: string
  data: Array<{ timestamp: number; value: number }>
  color: string
  isPositive: boolean
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
    [theme.brand100, theme.yellow100, theme.purple100, theme.blue100, theme.green100],
  )

  // 只取前5名来避免太多API调用
  const top5Vaults = topVaults.slice(0, 5)

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
        })
      }
    })

    return result
  }, [top5Vaults, vaultDataArray, CHART_COLORS])

  const isLoading = vaultDataArray.some((data) => data.isLoading)
  const hasData = chartData.length > 0

  // 为Chart.js格式化数据
  const chartJsData = useMemo(() => {
    if (!hasData) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // 将时间戳规范化到天级别的函数
    const normalizeToDay = (timestamp: number): number => {
      const date = new Date(timestamp)
      date.setHours(0, 0, 0, 0) // 将时间设置为当天的00:00:00
      return date.getTime()
    }

    // 为每个vault处理数据，按天聚合
    const processedVaultData = chartData.map((vault) => {
      // 按天分组数据
      const dailyDataMap = new Map<number, number>()

      vault.data.forEach((point) => {
        const dayTimestamp = normalizeToDay(point.timestamp)
        // 如果同一天有多个数据点，取最后一个（最新的）
        dailyDataMap.set(dayTimestamp, point.value)
      })

      return {
        ...vault,
        dailyData: dailyDataMap,
      }
    })

    // 获取所有天数的时间戳集合
    const allDayTimestamps = new Set<number>()
    processedVaultData.forEach((vault) => {
      vault.dailyData.forEach((_, dayTimestamp) => {
        allDayTimestamps.add(dayTimestamp)
      })
    })

    if (allDayTimestamps.size === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // 生成连续的日期范围
    const sortedDays = Array.from(allDayTimestamps).sort((a, b) => a - b)
    const minDay = sortedDays[0]
    const maxDay = sortedDays[sortedDays.length - 1]

    const continuousDays: number[] = []
    let currentDay = minDay
    while (currentDay <= maxDay) {
      continuousDays.push(currentDay)
      currentDay += 24 * 60 * 60 * 1000 // 加一天
    }

    // 格式化时间标签
    const labels = continuousDays.map((timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    })

    // 为每个vault创建dataset
    const datasets = processedVaultData.map((vault) => {
      // 创建连续的数据数组
      const dataPoints = continuousDays.map((dayTimestamp) => {
        const value = vault.dailyData.get(dayTimestamp)
        return value !== undefined ? value : null
      })

      // 使用前向填充来处理缺失的数据点
      const filledDataPoints = [...dataPoints]
      let lastValidValue: number | null = null

      for (let i = 0; i < filledDataPoints.length; i++) {
        if (filledDataPoints[i] !== null) {
          lastValidValue = filledDataPoints[i]
        } else if (lastValidValue !== null) {
          // 只在有前面有效值的情况下进行前向填充
          filledDataPoints[i] = lastValidValue
        }
      }

      return {
        label: vault.vaultName,
        data: filledDataPoints,
        borderColor: vault.color,
        borderWidth: 2,
      }
    })

    return {
      labels,
      datasets,
    }
  }, [chartData, hasData])

  return {
    chartData,
    chartJsData,
    isLoading,
    hasData,
    vaultCount: chartData.length,
  }
}
