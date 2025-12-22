/**
 * 垂直十字线插件
 * 用于在图表hover时显示垂直线和交叉点标记（无横线）
 */

import { useMemo } from 'react'

/**
 * 垂直十字线插件Hook
 */
export const useVerticalCrossHairPlugin = () => {
  return useMemo(
    () => ({
      id: 'verticalCrossHairPlugin',
      // 在每次绘制后执行
      afterDraw(chart: any) {
        // 获取当前鼠标位置的活跃元素
        const activeElements = chart.tooltip?.getActiveElements?.() || []

        if (activeElements.length === 0) {
          return
        }

        const { ctx, chartArea } = chart

        // 获取第一个活跃元素（通常是鼠标最接近的点）
        const activeElement = activeElements[0]
        const { x: mouseX, y: mouseY } = activeElement.element

        // 确保坐标在图表区域内
        if (
          mouseX < chartArea.left ||
          mouseX > chartArea.right ||
          mouseY < chartArea.top ||
          mouseY > chartArea.bottom
        ) {
          return
        }

        // 保存canvas状态
        ctx.save()

        // 绘制白色虚线垂直线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])

        // 绘制垂直线
        ctx.beginPath()
        ctx.moveTo(mouseX, chartArea.top)
        ctx.lineTo(mouseX, chartArea.bottom)
        ctx.stroke()

        // 重置线条样式
        ctx.setLineDash([])

        // 在交叉点绘制白色方框+黑色中心方框
        // 先绘制白色带圆角的正方形外框
        const size = 11
        const radius = 2
        ctx.beginPath()
        ctx.roundRect(mouseX - size / 2, mouseY - size / 2, size, size, radius)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
        ctx.fill()

        // 再绘制黑色中心正方形
        const innerSize = 7
        ctx.beginPath()
        ctx.roundRect(mouseX - innerSize / 2, mouseY - innerSize / 2, innerSize, innerSize, 1)
        ctx.fillStyle = '#1A1C1E'
        ctx.fill()

        // 恢复canvas状态
        ctx.restore()
      },
    }),
    [],
  )
}
