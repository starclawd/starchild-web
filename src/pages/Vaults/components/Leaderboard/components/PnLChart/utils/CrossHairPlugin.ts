/**
 * 十字线插件
 * 用于在图表hover时显示竖线crosshair和当前点位的value
 */

import { useMemo } from 'react'
import { useTheme } from 'styled-components'

/**
 * 十字线插件Hook
 */
export const useCrossHairPlugin = () => {
  const theme = useTheme()

  return useMemo(
    () => ({
      id: 'crossHairPlugin',
      // 在每次绘制后执行
      afterDraw(chart: any) {
        // 获取当前鼠标位置的活跃元素
        const activeElements = chart.tooltip?.getActiveElements?.() || []

        if (activeElements.length === 0) {
          return
        }

        const { ctx, chartArea, scales } = chart
        const { top, bottom } = chartArea

        // 获取第一个活跃元素（通常是鼠标最接近的点）
        const activeElement = activeElements[0]
        const { x: mouseX } = activeElement.element

        // 保存canvas状态
        ctx.save()

        // 绘制竖线
        ctx.strokeStyle = theme.textL1
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4]) // 虚线效果
        ctx.beginPath()
        ctx.moveTo(mouseX, top)
        ctx.lineTo(mouseX, bottom)
        ctx.stroke()
        ctx.setLineDash([]) // 重置为实线

        // 获取当前点的数值进行显示
        const datasetIndex = activeElement.datasetIndex
        const dataIndex = activeElement.index
        const dataset = chart.data.datasets[datasetIndex]
        const value = dataset.data[dataIndex]

        if (value !== undefined && value !== null) {
          // 格式化数值
          const formattedValue = `$${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`

          // 计算文字位置
          const textX = mouseX
          const textY = top + 10 // 在图表顶部上方10px

          // 测量文字宽度
          ctx.font = '12px Arial, sans-serif'
          const textWidth = ctx.measureText(formattedValue).width
          const padding = 8
          const backgroundWidth = textWidth + padding * 2
          const backgroundHeight = 24

          // 确保标签不会超出图表边界
          let finalTextX = textX - backgroundWidth / 2
          if (finalTextX < chartArea.left) {
            finalTextX = chartArea.left
          } else if (finalTextX + backgroundWidth > chartArea.right) {
            finalTextX = chartArea.right - backgroundWidth
          }

          // 绘制背景（使用更兼容的方式创建圆角矩形）
          ctx.fillStyle = theme.black600

          const x = finalTextX
          const y = textY - backgroundHeight / 2
          const width = backgroundWidth
          const height = backgroundHeight
          const radius = 4

          ctx.beginPath()
          ctx.moveTo(x + radius, y)
          ctx.lineTo(x + width - radius, y)
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
          ctx.lineTo(x + width, y + height - radius)
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
          ctx.lineTo(x + radius, y + height)
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
          ctx.lineTo(x, y + radius)
          ctx.quadraticCurveTo(x, y, x + radius, y)
          ctx.closePath()
          ctx.fill()

          // 绘制文字
          ctx.fillStyle = theme.textL1
          ctx.font = '12px Arial, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(formattedValue, finalTextX + backgroundWidth / 2, textY)
        }

        // 恢复canvas状态
        ctx.restore()
      },
    }),
    [theme],
  )
}
