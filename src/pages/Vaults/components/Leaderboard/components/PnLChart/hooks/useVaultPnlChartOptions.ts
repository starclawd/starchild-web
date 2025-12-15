import { useTheme } from 'styled-components'
import { useMemo, useCallback } from 'react'
import { useGetStrategyIconName } from '../../../../../../../store/vaults/hooks/useVaultData'
import { useVaultPointDrawPlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/VaultPointStylePlugin'
import { useInitialEquityLinePlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/InitialEquityLinePlugin'
import { useCrossHairPlugin } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/CrossHairPlugin'
import { useGlowEffect } from 'pages/Vaults/components/Leaderboard/components/PnLChart/utils/GlowEffect'
import { createChartTooltipConfig } from 'utils/chartTooltipUtils'

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

  // 使用十字线插件hook
  const crossHairPlugin = useCrossHairPlugin()

  // 重置图表hover状态的函数
  const resetHoverState = useCallback(
    (chart: any) => {
      if (!chart) return

      const datasets = chart.data.datasets
      setActiveDatasetIndex(null)

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
        tooltip: createChartTooltipConfig({
          theme,
          getChartType: () => 'PNL', // Leaderboard 始终显示 PnL 数据
        }),
      },
      onHover: (event: any, activeElements: any[]) => {
        const chart = event.chart
        const datasets = chart.data.datasets

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
    theme,
    vaultPointDrawPlugin,
    initialEquityLinePlugin,
    crossHairPlugin,
    glowEffectPlugin,
    setActiveDatasetIndex,
    resetHoverState,
  ])
}
