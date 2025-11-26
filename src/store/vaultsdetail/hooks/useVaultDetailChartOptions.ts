import { useTheme } from 'styled-components'
import { useMemo } from 'react'
import { formatChartJsData } from 'hooks/useChartJsDataFormat'
import { VaultDetailChartData } from '../vaultsdetail.d'

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
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false, // 单个vault不需要显示颜色块
          callbacks: {
            label(context: any) {
              const value = context.parsed.y
              const formattedValue =
                Math.abs(value) >= 1000000
                  ? `$${(value / 1000000).toFixed(2)}M`
                  : Math.abs(value) >= 1000
                    ? `$${(value / 1000).toFixed(2)}K`
                    : `$${value.toFixed(2)}`
              return `PnL: ${formattedValue}`
            },
            title(context: any) {
              if (context && context[0]) {
                const date = new Date(context[0].parsed.x)
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
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
      elements: {
        line: {
          tension: 0.4,
          borderWidth: 2,
        },
        point: {
          radius: 0, // 默认不显示点
          hoverRadius: 6, // hover时显示点
          backgroundColor: theme.jade10,
          borderColor: '#fff',
          borderWidth: 2,
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
