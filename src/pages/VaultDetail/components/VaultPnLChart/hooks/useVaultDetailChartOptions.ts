import { useTheme } from 'styled-components'
import { useMemo } from 'react'
import { VaultDetailChartData } from 'store/vaultsdetail/vaultsdetail'
import { formatChartJsData } from 'pages/Vaults/components/Leaderboard/components/PnLChart/hooks/useChartJsDataFormat'
import { vaultCrosshairPlugin } from '../utils/vaultCrosshairPlugin'
import { createChartTooltipConfig } from 'utils/chartTooltipUtils'
import { formatNumber } from 'utils/format'

export const useVaultDetailChartOptions = (chartData: VaultDetailChartData) => {
  const theme = useTheme()

  return useMemo(() => {
    // 判断PnL涨跌：比较最后一个数据和第一个数据
    const isPnlRising = () => {
      if (chartData.chartType !== 'PNL' || !chartData.hasData || chartData.data.length < 2) {
        return true // 默认为涨
      }
      const firstValue = chartData.data[0].value
      const lastValue = chartData.data[chartData.data.length - 1].value
      return lastValue >= firstValue
    }

    // 获取图表颜色配置
    const getChartColors = () => {
      switch (chartData.chartType) {
        case 'TVL':
        case 'EQUITY':
          return {
            borderColor: theme.brand100,
            gradientStart: 'rgba(248, 70, 0, 0.36)',
            gradientEnd: 'rgba(248, 70, 0, 0)',
          }
        case 'PNL':
          if (isPnlRising()) {
            // PnL 涨的颜色
            return {
              borderColor: theme.green100,
              gradientStart: 'rgba(0, 222, 115, 0.36)',
              gradientEnd: 'rgba(0, 222, 115, 0)',
            }
          } else {
            // PnL 跌的颜色
            return {
              borderColor: theme.red100,
              gradientStart: 'rgba(255, 55, 91, 0.36)',
              gradientEnd: 'rgba(255, 55, 91, 0)',
            }
          }
        default:
          // 默认使用 brand100 颜色（用于 Index 等其他类型）
          return {
            borderColor: theme.brand100,
            gradientStart: 'rgba(248, 70, 0, 0.36)',
            gradientEnd: 'rgba(248, 70, 0, 0)',
          }
      }
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 30, // 防抖 resize 事件，避免频繁重绘
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      // resize 时禁用动画，避免卡顿
      transitions: {
        resize: {
          animation: {
            duration: 0,
          },
        },
      },
      plugins: {
        legend: {
          display: false, // 单个vault不需要图例
        },
        tooltip: createChartTooltipConfig({
          theme,
          getChartType: () => chartData.chartType,
        }),
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
            display: true,
            color: theme.lineDark8,
            drawBorder: false,
          },
          ticks: {
            color: '#888',
            font: {
              size: 11,
            },
            maxTicksLimit: 6,
            callback(value: any) {
              const numValue = typeof value === 'number' ? value : parseFloat(value)
              return `$${formatNumber(numValue)}`
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
          tension: 0,
          borderWidth: 2,
        },
        point: {
          radius: 0, // 默认不显示点
          hoverRadius: 0, // hover时不显示点
        },
      },
    }

    // 创建渐变色
    const createGradient = (
      ctx: CanvasRenderingContext2D,
      chartArea: any,
      gradientStart: string,
      gradientEnd: string,
    ) => {
      const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
      gradient.addColorStop(0, gradientStart)
      gradient.addColorStop(0.9982, gradientEnd)
      return gradient
    }

    // 获取图表颜色配置
    const colors = getChartColors()

    // 使用通用的Chart.js数据格式化函数
    const chartJsDataRaw = formatChartJsData(
      chartData.hasData
        ? [
            {
              data: chartData.data,
              isPositive: chartData.isPositive,
              vaultName: chartData.chartType,
            },
          ]
        : [],
      {
        defaultPositiveColor: colors.borderColor,
        defaultNegativeColor: colors.borderColor,
        datasetLabel: chartData.chartType,
        aggregateByDay: false,
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
          if (!chartArea) return colors.gradientStart
          return createGradient(ctx, chartArea, colors.gradientStart, colors.gradientEnd)
        },
        borderColor: colors.borderColor,
        fill: 'origin', // 填充到x轴
      })),
    }

    return {
      options,
      chartJsData,
      vaultCrosshairPlugin,
    }
  }, [theme, chartData])
}
