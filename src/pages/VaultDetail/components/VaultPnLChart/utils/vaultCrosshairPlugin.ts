import { useTheme } from 'styled-components'

export const vaultCrosshairPlugin = {
  id: 'vaultCrosshair',
  afterDraw: (chart: any) => {
    if (chart.vaultCrosshair && chart.vaultCrosshair.draw) {
      const { ctx, chartArea } = chart
      const { x, y, value } = chart.vaultCrosshair

      // 确保坐标在图表区域内
      if (x < chartArea.left || x > chartArea.right || y < chartArea.top || y > chartArea.bottom) {
        return
      }

      ctx.save()

      // 绘制白色虚线十字线
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])

      // 绘制垂直线
      ctx.beginPath()
      ctx.moveTo(x, chartArea.top)
      ctx.lineTo(x, chartArea.bottom)
      ctx.stroke()

      // 绘制水平线
      ctx.beginPath()
      ctx.moveTo(chartArea.left, y)
      ctx.lineTo(chartArea.right, y)
      ctx.stroke()

      // 重置线条样式
      ctx.setLineDash([])

      // 在交叉点绘制白色方框+黑色中心方框
      // 先绘制白色带圆角的正方形外框
      const size = 11
      const radius = 2
      ctx.beginPath()
      ctx.roundRect(x - size / 2, y - size / 2, size, size, radius)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
      ctx.fill()

      // 再绘制黑色中心正方形
      const innerSize = 7
      ctx.beginPath()
      ctx.roundRect(x - innerSize / 2, y - innerSize / 2, innerSize, innerSize, 1)
      ctx.fillStyle = '#1A1C1E'
      ctx.fill()

      ctx.restore()
    }
  },
}
