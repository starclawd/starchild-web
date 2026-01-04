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
  // 是否按天聚合数据并填充连续日期
  aggregateByDay?: boolean
}

export interface FormattedChartData {
  labels: number[]
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
  const { defaultPositiveColor, defaultNegativeColor, datasetLabel = 'PnL', aggregateByDay = true } = options

  if (chartDataArray.length === 0 || chartDataArray.every((chart) => chart.data.length === 0)) {
    return {
      labels: [],
      datasets: [],
    }
  }

  if (aggregateByDay) {
    // 按天聚合数据并填充连续日期的处理逻辑
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

    // 保持时间戳格式，让Chart.js在x轴配置中自行处理格式化
    const labels = continuousDays

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
      }
    })

    return {
      labels,
      datasets,
    }
  } else {
    // 使用原始时间精度的处理逻辑
    // 收集所有时间戳
    const allTimestamps = new Set<number>()
    chartDataArray.forEach((vault) => {
      vault.data.forEach((point) => {
        allTimestamps.add(point.timestamp)
      })
    })

    if (allTimestamps.size === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    // 按时间排序
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b)

    // 为每个vault创建dataset
    const datasets = chartDataArray.map((vaultData) => {
      const dataMap = new Map<number, number>()
      vaultData.data.forEach((point) => {
        dataMap.set(point.timestamp, point.value)
      })

      // 根据排序的时间戳创建数据数组
      const dataPoints = sortedTimestamps.map((timestamp) => {
        const value = dataMap.get(timestamp)
        return value !== undefined ? value : null
      })

      const color = vaultData.color || (vaultData.isPositive ? defaultPositiveColor : defaultNegativeColor)

      return {
        label: vaultData.vaultName || datasetLabel,
        data: dataPoints,
        borderColor: color,
        tension: 0,
      }
    })

    return {
      labels: sortedTimestamps,
      datasets,
    }
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
