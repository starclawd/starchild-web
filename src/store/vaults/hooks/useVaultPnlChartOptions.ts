import { useTheme } from 'styled-components'
import { useMemo } from 'react'
import { useGetStrategyIconName } from './useVaultData'

export const useVaultPnlChartOptions = (chartData: any[]) => {
  const theme = useTheme()
  const strategyIconNameMapping = useGetStrategyIconName()

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
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label(context: any) {
              const value = context.parsed.y
              const formattedValue =
                Math.abs(value) >= 1000000
                  ? `$${(value / 1000000).toFixed(2)}M`
                  : Math.abs(value) >= 1000
                    ? `$${(value / 1000).toFixed(2)}K`
                    : `$${value.toFixed(2)}`
              return `${context.dataset.label}: ${formattedValue}`
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
              if (Math.abs(numValue) >= 1000000) {
                return `$${(numValue / 1000000).toFixed(1)}M`
              } else if (Math.abs(numValue) >= 1000) {
                return `$${(numValue / 1000).toFixed(1)}K`
              }
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
          radius(context: any) {
            const datasetIndex = context.datasetIndex
            const dataIndex = context.dataIndex
            const dataset = context.chart.data.datasets[datasetIndex]
            const isLastPoint = dataIndex === dataset.data.length - 1
            return isLastPoint ? 40 : 0
          },
          hoverRadius(context: any) {
            const datasetIndex = context.datasetIndex
            const dataIndex = context.dataIndex
            const dataset = context.chart.data.datasets[datasetIndex]
            const isLastPoint = dataIndex === dataset.data.length - 1
            return isLastPoint ? 40 : 6
          },
          pointStyle(context: any) {
            const datasetIndex = context.datasetIndex
            const dataIndex = context.dataIndex
            const dataset = context.chart.data.datasets[datasetIndex]
            const isLastPoint = dataIndex === dataset.data.length - 1

            if (isLastPoint) {
              // 创建一个带有icon font的canvas
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              if (ctx) {
                canvas.width = 40
                canvas.height = 40

                // 绘制背景圆形
                ctx.fillStyle = '#fff'
                ctx.beginPath()
                ctx.arc(18, 18, 16, 0, 2 * Math.PI)
                ctx.fill()

                // 绘制边框
                ctx.strokeStyle = dataset.borderColor
                ctx.lineWidth = 2
                ctx.stroke()

                // 使用icon font渲染图标
                // FIXME: Community Vaults需要获取创建者的头像展示
                const vaultId = chartData[datasetIndex]?.vaultId
                const iconClassName = strategyIconNameMapping[vaultId]

                // 创建临时元素来获取icon font的字符
                const tempElement = document.createElement('i')
                tempElement.className = iconClassName
                tempElement.style.position = 'absolute'
                tempElement.style.left = '-9999px'
                tempElement.style.fontSize = '16px'
                document.body.appendChild(tempElement)

                // 获取计算样式中的content值 (icon font的unicode字符)
                const computedStyle = window.getComputedStyle(tempElement, ':before')
                const iconContent = computedStyle.getPropertyValue('content')

                // 清理临时元素
                document.body.removeChild(tempElement)

                // 绘制icon font字符
                ctx.fillStyle = dataset.borderColor
                ctx.font = '18px "icomoon"'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                // 去除引号并渲染字符
                const iconChar = iconContent.replace(/['"]/g, '')
                if (iconChar && iconChar !== 'none') {
                  ctx.fillText(iconChar, 18, 18)
                } else {
                  // 回退到简单的圆点
                  ctx.fillStyle = '#fff'
                  ctx.beginPath()
                  ctx.arc(16, 16, 4, 0, 2 * Math.PI)
                  ctx.fill()
                }
              }
              return canvas
            }
            return 'circle' as const
          },
          backgroundColor(context: any) {
            const datasetIndex = context.datasetIndex
            return chartData[datasetIndex]?.color
          },
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
    }

    return {
      options,
      zeroLinePlugin,
    }
  }, [theme, chartData, strategyIconNameMapping])
}
