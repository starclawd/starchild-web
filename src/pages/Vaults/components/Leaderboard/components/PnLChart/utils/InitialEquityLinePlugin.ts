/**
 * 初始Equity线插件
 * 用于在图表上绘制 y=1000 的横线（初始Equity为1000）
 */

import { useMemo } from 'react'

export interface InitialEquityLinePluginConfig {
  /** 主题对象，用于获取线条颜色 */
  theme: {
    lineDark12: string
  }
  /** 初始Equity值，默认为1000 */
  initialEquity?: number
}

/**
 * 初始Equity线插件Hook
 */
export const useInitialEquityLinePlugin = (config: InitialEquityLinePluginConfig) => {
  const { theme, initialEquity = 1000 } = config

  return useMemo(
    () => ({
      id: 'initialEquityLine',
      afterDraw(chart: any) {
        const { ctx, chartArea, scales } = chart
        const { top, bottom, left, right } = chartArea

        // 获取指定equity值在画布上的位置
        const yZero = scales.y.getPixelForValue(initialEquity)

        // 如果该位置在可视区域内，绘制横线
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
    }),
    [theme.lineDark12, initialEquity],
  )
}
