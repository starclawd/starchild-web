import { useMemo } from 'react'

export interface ChartDataPoint {
  timestamp: number
  value: number
}

export interface VaultChartData {
  vaultId?: string
  vaultName?: string
  data: ChartDataPoint[]
  color?: string
  isPositive?: boolean
}

export interface ChartJsDataFormatOptions {
  // 默认颜色
  defaultPositiveColor: string
  defaultNegativeColor: string
  // 数据集标签
  datasetLabel?: string
}

export interface FormattedChartData {
  labels: any[]
  datasets: any[]
}

/**
 * 通用的 Chart.js 数据格式化函数
 * 支持单个或多个 vault 数据的格式化
 */
export const formatChartJsData = (
  chartDataArray: VaultChartData[],
  options: ChartJsDataFormatOptions,
): FormattedChartData => {
  const { defaultPositiveColor, defaultNegativeColor, datasetLabel = 'PnL' } = options

  if (chartDataArray.length === 0 || chartDataArray.every((chart) => chart.data.length === 0)) {
    return {
      labels: [],
      datasets: [],
    }
  }

  // 统一处理：按天聚合数据并填充连续日期
  const normalizeToDay = (timestamp: number): number => {
    const date = new Date(timestamp)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
  }

  // 处理每个 vault 的数据，按天聚合
  const processedVaultData = chartDataArray.map((vaultData) => {
    const dailyDataMap = new Map<number, number>()

    vaultData.data.forEach((point) => {
      const dayTimestamp = normalizeToDay(point.timestamp)
      // 如果同一天有多个数据点，取最后一个（最新的）
      dailyDataMap.set(dayTimestamp, point.value)
    })

    return {
      ...vaultData,
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
        filledDataPoints[i] = lastValidValue
      }
    }

    const color = vault.color || (vault.isPositive ? defaultPositiveColor : defaultNegativeColor)

    return {
      label: vault.vaultName || datasetLabel,
      data: filledDataPoints,
      borderColor: color,
      borderWidth: 2,
      tension: 0.4,
    }
  })

  return {
    labels,
    datasets,
  }
}

/**
 * Chart.js 数据格式化 hooks
 * 在 React 组件中使用，提供 memoization 优化
 */
export const useChartJsDataFormat = (
  chartDataArray: VaultChartData[],
  options: ChartJsDataFormatOptions,
): FormattedChartData => {
  return useMemo(() => {
    return formatChartJsData(chartDataArray, options)
  }, [chartDataArray, options])
}
