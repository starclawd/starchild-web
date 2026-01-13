import type { Plugin } from 'chart.js'

/**
 * 中心方块插件
 * 在雷达图中心绘制一个2x2像素的方块
 */
export const centerSquarePlugin: Plugin = {
  id: 'centerSquare',
  afterDraw: (chart) => {
    const { ctx, scales } = chart
    if (!scales.r) return

    // 获取雷达图的中心点坐标（类型断言为any来访问radial scale属性）
    const radialScale = scales.r as any
    const centerX = radialScale.xCenter
    const centerY = radialScale.yCenter

    // 获取当前主题的brand100颜色
    const dataset = chart.data.datasets[0]
    const color = dataset?.borderColor || '#4F46E5'

    ctx.save()
    ctx.fillStyle = color as string

    // 绘制2x2px的方块，中心对齐
    ctx.fillRect(centerX - 1, centerY - 1, 2, 2)

    ctx.restore()
  },
}
