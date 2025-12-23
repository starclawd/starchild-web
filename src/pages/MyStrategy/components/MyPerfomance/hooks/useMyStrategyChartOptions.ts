import { useTheme } from 'styled-components'
import { useMemo, useCallback } from 'react'
import { useGlowEffect } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/GlowEffect'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import { useCrossHairPlugin } from 'pages/VaultDetail/components/VaultPnLChart/utils/CrossHairPlugin'
import { createChartTooltipConfig } from 'utils/chartTooltipUtils'
import { VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'
import { MyStrategyPerformanceChartData } from '../../../../../store/mystrategy/hooks/useMyStrategyPerformanceChart'

// 生成空图表数据的函数
export const createEmptyStrategyChartData = (chartTimeRange: VaultChartTimeRange) => {
  const now = Date.now()
  const labels = []

  // 根据时间范围确定开始时间和数据点数量
  const getTimeRangeConfig = (timeRange: VaultChartTimeRange) => {
    switch (timeRange) {
      case '24h':
        return {
          startTime: now - 24 * 60 * 60 * 1000,
          interval: 60 * 60 * 1000, // 1小时
          pointCount: 24,
        }
      case '7d':
        return {
          startTime: now - 7 * 24 * 60 * 60 * 1000,
          interval: 24 * 60 * 60 * 1000, // 1天
          pointCount: 7,
        }
      default:
        return {
          startTime: now - 30 * 24 * 60 * 60 * 1000,
          interval: 24 * 60 * 60 * 1000, // 1天
          pointCount: 30,
        }
    }
  }

  const config = getTimeRangeConfig(chartTimeRange)

  // 生成时间点
  for (let i = 0; i < config.pointCount; i++) {
    const timestamp = config.startTime + i * config.interval
    labels.push(timestamp)
  }

  return {
    labels,
    datasets: [],
  }
}

// 生成空图表配置选项的函数
export const createEmptyStrategyChartOptions = (theme: any) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 16,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // 空图表不显示tooltip
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        display: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        time: {
          displayFormats: {
            year: 'yyyy',
            month: 'yyyy-MM',
            day: 'yyyy-MM-dd',
            hour: 'yyyy-MM-dd HH:mm',
          },
          tooltipFormat: 'yyyy-MM-dd',
        },
        ticks: {
          color: '#888',
          font: {
            size: 11,
          },
          maxTicksLimit: 6,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        display: true,
        min: 800,
        max: 2000,
        grid: {
          display: false,
          drawBorder: true,
        },
        ticks: {
          color: '#888',
          font: {
            size: 11,
          },
          callback(value: any) {
            const numValue = typeof value === 'number' ? value : parseFloat(value)
            return `$${numValue.toFixed(0)}`
          },
        },
      },
    },
    animation: {
      duration: 0, // 空图表不需要动画
    },
    elements: {
      line: {
        tension: 0,
      },
      point: {
        radius: 0,
        hoverRadius: 6,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
      },
    },
  }
}

// 获取策略颜色的函数 - 与 Leaderboard 保持一致
const getStrategyColors = (theme: any) => [
  theme.brand100,
  theme.purple100,
  theme.blue100,
  theme.yellow100,
  theme.green100,
]

export const useMyStrategyChartOptions = (
  chartData: MyStrategyPerformanceChartData,
  selectedStrategyId: string | null,
) => {
  const theme = useTheme()

  // 使用发光效果插件hook
  const { plugin: glowEffectPlugin, setActiveDatasetIndex, getActiveDatasetIndex } = useGlowEffect()

  // 使用初始Equity线插件hook
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

  // 使用十字线插件hook
  const crossHairPlugin = useCrossHairPlugin()

  // 获取当前激活策略名称的函数
  const getStrategyName = useCallback(() => {
    const activeIndex = getActiveDatasetIndex()
    return activeIndex !== null && activeIndex !== undefined && chartData.data
      ? chartData.data[activeIndex]?.strategyName
      : undefined
  }, [chartData.data, getActiveDatasetIndex])

  // 重置图表hover状态的函数
  const resetHoverState = useCallback(
    (chart: any) => {
      if (!chart) return

      const datasets = chart.data.datasets
      setActiveDatasetIndex(null)

      // 重置数值显示
      if (chart.updateValueDisplay) {
        chart.updateValueDisplay(null)
      }

      datasets.forEach((dataset: any) => {
        if (dataset.originalBorderColor) {
          dataset.borderColor = dataset.originalBorderColor
        }
      })
      chart.update('none')
    },
    [setActiveDatasetIndex],
  )

  // 辅助函数：调整颜色透明度
  const adjustColorAlpha = (color: string, alpha: number): string => {
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/g, `${alpha})`)
    }
    if (color.startsWith('rgb')) {
      const rgbMatch = color.match(/rgb\(([^)]+)\)/)
      if (rgbMatch) {
        const rgbValues = rgbMatch[1]
        return `rgba(${rgbValues}, ${alpha})`
      }
    }
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    return color
  }

  return useMemo(() => {
    // 处理图表数据
    let filteredData = chartData.data

    // 如果选择了特定策略，只显示该策略的数据
    if (selectedStrategyId && selectedStrategyId !== 'all') {
      filteredData = chartData.data.filter((strategy) => strategy.strategyId === selectedStrategyId)
    }

    // 获取策略颜色数组
    const strategyColors = getStrategyColors(theme)

    // 转换为Chart.js格式
    const datasets = filteredData.map((strategy, index) => {
      const color = strategyColors[index % strategyColors.length]

      return {
        label: strategy.strategyName,
        data: strategy.data.map((point) => ({
          x: point.timestamp,
          y: point.value,
        })),
        borderColor: color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        tension: 0,
        fill: false,
      }
    })

    const chartJsData = {
      datasets,
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 16,
        },
      },
      interaction: {
        mode: 'nearest' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: createChartTooltipConfig({
          theme,
          getChartType: () => 'EQUITY',
          showStrategyName: true,
          getStrategyName,
        }),
      },
      onHover: (event: any, activeElements: any[]) => {
        const chart = event.chart
        const datasets = chart.data.datasets

        // 更新数值显示
        if (chart.updateValueDisplay && activeElements.length > 0) {
          const element = activeElements[0]
          const datasetIndex = element.datasetIndex
          const index = element.index
          const dataset = chart.data.datasets[datasetIndex]

          if (dataset && dataset.data[index] !== undefined) {
            const value = dataset.data[index].y
            const timestamp = dataset.data[index].x

            // 格式化时间显示
            const date = new Date(timestamp)
            const timeString = date.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })

            chart.updateValueDisplay({
              value: Number(value),
              time: timeString,
              x: element.element ? element.element.x : 0,
              visible: true,
            })
          }
        } else if (chart.updateValueDisplay) {
          chart.updateValueDisplay(null)
        }

        // 如果没有激活元素，恢复所有线条到原始状态
        if (activeElements.length === 0) {
          setActiveDatasetIndex(null)

          datasets.forEach((dataset: any) => {
            if (dataset.originalBorderColor) {
              dataset.borderColor = dataset.originalBorderColor
            }
          })
          chart.update('none')
          return
        }

        // 获取当前激活的数据集索引
        const activeDatasetIndex = activeElements[0].datasetIndex

        // 设置发光效果
        setActiveDatasetIndex(activeDatasetIndex)

        // 更新所有数据集的透明度
        datasets.forEach((dataset: any, index: number) => {
          // 保存原始颜色（如果还没有保存）
          if (!dataset.originalBorderColor) {
            dataset.originalBorderColor = dataset.borderColor
          }

          if (index === activeDatasetIndex) {
            // 激活的线条保持原始颜色
            dataset.borderColor = dataset.originalBorderColor
          } else {
            // 其他线条设置为0.3透明度
            dataset.borderColor = adjustColorAlpha(dataset.originalBorderColor, 0.3)
          }
        })

        chart.update('none')
      },
      scales: {
        x: {
          type: 'time' as const,
          display: true,
          grid: {
            display: false,
            drawBorder: false,
          },
          time: {
            displayFormats: {
              year: 'yyyy',
              month: 'yyyy-MM',
              day: 'yyyy-MM-dd',
              hour: 'yyyy-MM-dd HH:mm',
            },
            tooltipFormat: 'yyyy-MM-dd',
          },
          ticks: {
            color: '#888',
            font: {
              size: 11,
            },
            maxTicksLimit: 6,
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          display: true,
          grid: {
            display: false,
            drawBorder: true,
          },
          ticks: {
            color: '#888',
            font: {
              size: 11,
            },
            callback(value: any) {
              const numValue = typeof value === 'number' ? value : parseFloat(value)
              return `$${numValue.toFixed(0)}`
            },
          },
          grace: '25%',
        },
      },
      animation: (() => {
        const totalDuration = 2000
        let animationCompleted = false
        let lastDataLength = 0

        const getDataLength = (chart: any) => {
          if (!chart.data.datasets || chart.data.datasets.length === 0) return 1
          // 使用所有数据集中的最大数据长度，以确保动画一致性
          return Math.max(...chart.data.datasets.map((dataset: any) => dataset.data?.length || 0)) || 1
        }
        const delayBetweenPoints = (chart: any) => totalDuration / getDataLength(chart)

        const previousY = (ctx: any) => {
          if (ctx.index === 0) {
            return ctx.chart.scales.y.getPixelForValue(100)
          }
          return ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y
        }

        return {
          onComplete() {
            animationCompleted = true
          },
          x: {
            type: 'number',
            easing: 'linear',
            duration: (ctx: any) => {
              const currentDataLength = getDataLength(ctx.chart)
              if (currentDataLength !== lastDataLength) {
                animationCompleted = false
                lastDataLength = currentDataLength
              }
              if (animationCompleted) return 0
              return delayBetweenPoints(ctx.chart)
            },
            from: NaN,
            delay(ctx: any) {
              const currentDataLength = getDataLength(ctx.chart)
              if (currentDataLength !== lastDataLength) {
                animationCompleted = false
                lastDataLength = currentDataLength
              }
              if (animationCompleted || ctx.type !== 'data' || ctx.xStarted) {
                return 0
              }
              ctx.xStarted = true
              return ctx.index * delayBetweenPoints(ctx.chart)
            },
          },
          y: {
            type: 'number',
            easing: 'linear',
            duration: (ctx: any) => {
              const currentDataLength = getDataLength(ctx.chart)
              if (currentDataLength !== lastDataLength) {
                animationCompleted = false
                lastDataLength = currentDataLength
              }
              if (animationCompleted) return 0
              return delayBetweenPoints(ctx.chart)
            },
            from: previousY,
            delay(ctx: any) {
              const currentDataLength = getDataLength(ctx.chart)
              if (currentDataLength !== lastDataLength) {
                animationCompleted = false
                lastDataLength = currentDataLength
              }
              if (animationCompleted || ctx.type !== 'data' || ctx.yStarted) {
                return 0
              }
              ctx.yStarted = true
              return ctx.index * delayBetweenPoints(ctx.chart)
            },
          },
        }
      })(),
      elements: {
        line: {
          tension: 0,
        },
        point: {
          radius: 0,
          hoverRadius: 6,
          backgroundColor: 'transparent',
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }

    return {
      options,
      chartJsData,
      initialEquityLinePlugin,
      crossHairPlugin,
      glowEffectPlugin,
      resetHoverState,
    }
  }, [
    theme,
    chartData.data, // 使用具体的数据属性而不是整个对象
    selectedStrategyId,
    initialEquityLinePlugin,
    crossHairPlugin,
    glowEffectPlugin,
    setActiveDatasetIndex,
    getStrategyName,
    resetHoverState,
  ])
}
