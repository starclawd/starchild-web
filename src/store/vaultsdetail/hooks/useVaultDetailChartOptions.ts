import { useTheme } from 'styled-components'
import { useMemo } from 'react'
import { formatChartJsData } from '../../vaults/hooks/useChartJsDataFormat'
import { VaultDetailChartData } from '../vaultsdetail.d'

// 导出十字线相关功能
export { useVaultCrosshair, type VaultCrosshairData } from './useVaultCrosshair'

export const useVaultDetailChartOptions = (chartData: VaultDetailChartData) => {
  const theme = useTheme()

  return useMemo(() => {
    // 自定义插件：绘制y=0的横线
    const zeroLinePlugin = {
      id: 'zeroLine',
      afterDraw(chart: any) {
        const { ctx, chartArea, scales } = chart
        const { top, bottom, left, right } = chartArea

        // 获取y=0在画布上的位置
        const yZero = scales.y.getPixelForValue(0)

        // 如果y=0在可视区域内，绘制横线
        if (yZero >= top && yZero <= bottom) {
          ctx.save()
          ctx.strokeStyle = theme.lineDark12
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(left, yZero)
          ctx.lineTo(right, yZero)
          ctx.stroke()
          ctx.restore()
        }
      },
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: false, // 单个vault不需要图例
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
              const formattedValue =
                Math.abs(value) >= 1000000
                  ? `$${(value / 1000000).toFixed(2)}M`
                  : Math.abs(value) >= 1000
                    ? `$${(value / 1000).toFixed(2)}K`
                    : `$${value.toFixed(2)}`
              return `Vault PnL: ${formattedValue}`
            },
            label(context: any) {
              // 直接使用Chart.js提供的label，它就是聚合后的时间戳
              const labelValue = context.label
              if (labelValue) {
                // 如果label是时间戳，直接格式化
                const timestamp = typeof labelValue === 'number' ? labelValue : parseInt(labelValue)
                if (!isNaN(timestamp)) {
                  const date = new Date(timestamp)
                  return date.toISOString().split('T')[0] // 格式化为 YYYY-MM-DD
                }
                // 如果label已经是格式化的日期字符串，直接返回
                return labelValue
              }
              return ''
            },
          },
        },
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
            maxTicksLimit: 6, // 限制最大刻度数量为6个
            autoSkip: true, // 启用自动跳过刻度
            autoSkipPadding: 20, // 刻度之间的最小间距
            maxRotation: 0, // 禁止旋转标签
            minRotation: 0,
            callback(value: any, index: number, values: any[]) {
              if (typeof value === 'number') {
                const date = new Date(chartData.data[index].timestamp)
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
            display: true,
            color: theme.lineDark8,
            drawBorder: false,
          },
          ticks: {
            color: '#888',
            font: {
              size: 11,
            },
            maxTicksLimit: 8, // 限制最大刻度数量为8个
            callback(value: any) {
              const numValue = typeof value === 'number' ? value : parseFloat(value)
              if (Math.abs(numValue) >= 1000000) {
                return `$${(numValue / 1000000).toFixed(2)}M`
              } else if (Math.abs(numValue) >= 1000) {
                return `$${(numValue / 1000).toFixed(2)}K`
              }
              return `$${numValue.toFixed(0)}`
            },
          },
          grace: '15%',
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
          borderWidth: 2,
        },
        point: {
          radius: 0, // 默认不显示点
          hoverRadius: 0, // hover时不显示点
        },
      },
    }

    // 创建渐变色
    const createGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
      gradient.addColorStop(0, 'rgba(248, 70, 0, 0.36)')
      gradient.addColorStop(0.9982, 'rgba(248, 70, 0, 0.05)')
      return gradient
    }

    // 使用通用的Chart.js数据格式化函数
    const chartJsDataRaw = formatChartJsData(
      chartData.hasData
        ? [
            {
              data: chartData.data,
              isPositive: chartData.isPositive,
              vaultName: 'PnL',
            },
          ]
        : [],
      {
        defaultPositiveColor: theme.brand100,
        defaultNegativeColor: theme.brand100,
        datasetLabel: 'PnL',
      },
    )

    // 修改数据集以使用渐变背景
    const chartJsData = {
      ...chartJsDataRaw,
      datasets: chartJsDataRaw.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return 'rgba(248, 70, 0, 0.36)'
          return createGradient(ctx, chartArea)
        },
        fill: 'origin', // 填充到x轴
      })),
    }

    return {
      options,
      chartJsData,
      zeroLinePlugin,
    }
  }, [theme, chartData])
}
