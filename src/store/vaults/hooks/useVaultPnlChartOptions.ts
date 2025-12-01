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

                // 获取vault信息
                const vaultData = chartData[datasetIndex]
                const vaultId = vaultData?.vaultId
                const vaultType = vaultData?.type
                const creatorAvatar = vaultData?.creatorAvatar
                if (vaultType === 'community' && creatorAvatar) {
                  // Community Vault: 渲染创建者头像
                  const img = new Image()
                  img.onload = () => {
                    // 绘制圆形头像
                    ctx.save()
                    ctx.beginPath()
                    ctx.arc(18, 18, 14, 0, 2 * Math.PI)
                    ctx.clip()
                    ctx.drawImage(img, 4, 4, 28, 28)
                    ctx.restore()
                  }
                  img.src = creatorAvatar
                } else {
                  // Protocol Vault: 使用icon font渲染图标
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
