import { useTheme } from 'styled-components'
import { useMemo, useCallback } from 'react'
import { useGetStrategyIconName } from '../../../../../../../store/vaults/hooks/useVaultData'
import { useVaultPointDrawPlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/VaultPointStylePlugin'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import { useVerticalCrossHairPlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/VerticalCrossHairPlugin'
import { useGlowEffect } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/GlowEffect'

// 生成空图表数据的函数
export const createEmptyLeaderboardChartData = () => {
  const now = Date.now()
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  const labels = []

  // 生成最近7天的时间点（每天一个点）
  for (let i = 0; i < 7; i++) {
    const timestamp = weekAgo + i * 24 * 60 * 60 * 1000
    labels.push(timestamp)
  }

  return {
    labels,
    datasets: [],
  }
}

// 生成空图表配置选项的函数
export const createEmptyLeaderboardChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 150,
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

export const useVaultPnlChartOptions = (chartData: any[]) => {
  const theme = useTheme()
  const strategyIconNameMapping = useGetStrategyIconName()

  // 使用发光效果插件hook，需要先声明以获取getActiveDatasetIndex
  const { plugin: glowEffectPlugin, setActiveDatasetIndex, getActiveDatasetIndex } = useGlowEffect()

  // 对插件配置进行 memoization，避免不必要的重新创建
  const vaultPointDrawConfig = useMemo(
    () => ({
      chartData,
      strategyIconNameMapping,
      getActiveDatasetIndex,
    }),
    [chartData, strategyIconNameMapping, getActiveDatasetIndex],
  )

  // 使用vault点绘制插件hook
  const vaultPointDrawPlugin = useVaultPointDrawPlugin(vaultPointDrawConfig)

  // 使用初始Equity线插件hook
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

  // 使用垂直十字线插件hook
  const crossHairPlugin = useVerticalCrossHairPlugin()

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
    // 处理 rgba 格式
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/g, `${alpha})`)
    }
    // 处理 rgb 格式
    if (color.startsWith('rgb')) {
      const rgbMatch = color.match(/rgb\(([^)]+)\)/)
      if (rgbMatch) {
        const rgbValues = rgbMatch[1]
        return `rgba(${rgbValues}, ${alpha})`
      }
    }
    // 处理 hex 格式
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
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: 150, // 在右侧留出空间（展示图标和盈亏值）
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
          enabled: false, // 禁用默认 tooltip，使用自定义数值显示组件
        },
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
            const value = dataset.data[index]
            const timestamp = chart.data.labels[index]

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
          // 取消发光效果
          setActiveDatasetIndex(null)

          datasets.forEach((dataset: any) => {
            if (dataset.originalBorderColor) {
              dataset.borderColor = dataset.originalBorderColor
            }
          })
          chart.update('none') // 使用 'none' 模式避免动画
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
            // 激活的线条保持原始颜色（发光效果由插件处理）
            dataset.borderColor = dataset.originalBorderColor
          } else {
            // 其他线条设置为0.3透明度
            dataset.borderColor = adjustColorAlpha(dataset.originalBorderColor, 0.3)
          }
        })

        chart.update('none') // 使用 'none' 模式避免动画
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

        // 获取数据长度的函数
        const getDataLength = (chart: any) => {
          if (!chart.data.datasets || chart.data.datasets.length === 0) return 1
          // 使用所有数据集中的最大数据长度，以确保动画一致性
          return Math.max(...chart.data.datasets.map((dataset: any) => dataset.data?.length || 0)) || 1
        }

        // 计算每个点之间的延迟
        const delayBetweenPoints = (chart: any) => totalDuration / getDataLength(chart)

        // 获取前一个点的Y位置
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
              // 如果数据长度变化了，重新启用动画
              if (currentDataLength !== lastDataLength) {
                animationCompleted = false
                lastDataLength = currentDataLength
              }
              // 如果动画已完成，直接返回0禁用动画
              if (animationCompleted) return 0
              return delayBetweenPoints(ctx.chart)
            },
            from: NaN, // 点最初被跳过
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
              // 如果动画已完成，直接返回0禁用动画
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
          radius: 0, // 隐藏默认点，我们用插件绘制
          hoverRadius: 6,
          backgroundColor: 'transparent',
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }

    return {
      options,
      zeroLinePlugin: initialEquityLinePlugin,
      vaultPointDrawPlugin,
      crossHairPlugin,
      glowEffectPlugin,
      resetHoverState,
    }
  }, [
    vaultPointDrawPlugin,
    initialEquityLinePlugin,
    crossHairPlugin,
    glowEffectPlugin,
    setActiveDatasetIndex,
    resetHoverState,
  ])
}
