import { useTheme } from 'styled-components'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useGetStrategyIconName } from '../../../../../../../store/vaults/hooks/useVaultData'
import { useVaultPointDrawPlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/VaultPointStylePlugin'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'

export const useVaultPnlChartOptions = (chartData: any[]) => {
  const theme = useTheme()
  const strategyIconNameMapping = useGetStrategyIconName()

  // 使用vault点绘制插件hook
  const vaultPointDrawPlugin = useVaultPointDrawPlugin({
    chartData,
    strategyIconNameMapping,
  })

  // 使用初始Equity线插件hook
  const initialEquityLinePlugin = useInitialEquityLinePlugin({ theme })

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
          right: 100, // 在右侧留出200px空间
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
          backgroundColor: '#2D2D2D',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF',
          borderColor: '#404040',
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: false,
          titleFont: {
            size: 12,
          },
          bodyFont: {
            size: 11,
          },
          padding: 8,
          callbacks: {
            title(context: any) {
              const value = context[0].parsed.y
              const formattedValue = `$${value.toFixed(2)}`
              return `Strategy Balance: ${formattedValue}`
            },
            label(context: any) {
              const timestamp = parseInt(context.label)
              return timestamp ? dayjs(timestamp).format('YYYY-MM-DD') : ''
            },
          },
        },
      },
      onHover: (event: any, activeElements: any[]) => {
        const chart = event.chart
        const datasets = chart.data.datasets

        // 如果没有激活元素，恢复所有线条到原始透明度
        if (activeElements.length === 0) {
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

        chart.update('none') // 使用 'none' 模式避免动画
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: '#888',
            font: {
              size: 11,
            },
            maxTicksLimit: 7, // 限制最大刻度数量为6个
            autoSkip: true, // 启用自动跳过刻度
            autoSkipPadding: 20, // 刻度之间的最小间距
            maxRotation: 0, // 禁止旋转标签
            minRotation: 0,
            callback(value: any, index: number, values: any[]): string {
              // 通过 chartData 获取第一个 vault 的时间戳数据来生成 x 轴标签
              if (chartData.length > 0 && chartData[0].data && chartData[0].data[index]) {
                const timestamp: number = chartData[0].data[index].timestamp
                const date: Date = new Date(timestamp)
                return date
                  .toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\//g, '-')
              }
              return ''
            },
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
        const getDataLength = (chart: any) => chart.data.datasets[0]?.data?.length || 1

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
          tension: 0.4,
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
    }
  }, [chartData, vaultPointDrawPlugin, initialEquityLinePlugin])
}
