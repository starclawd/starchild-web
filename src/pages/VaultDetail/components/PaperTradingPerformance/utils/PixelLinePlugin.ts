/**
 * 像素方块线条插件
 * 将传统的线图改为由4x4像素方块连接的效果
 */

import { useMemo } from 'react'

export interface PixelLinePluginConfig {
  theme: any
  showGrid?: boolean // 是否显示4x4网格
}

/**
 * 将坐标对齐到4x4网格
 */
const alignToGrid = (coord: number): number => {
  const gridSize = 4
  return Math.floor(coord / gridSize) * gridSize
}

/**
 * 获取网格坐标的唯一键
 */
const getGridKey = (gridX: number, gridY: number): string => {
  return `${gridX},${gridY}`
}

/**
 * 绘制4x4网格线
 */
const drawGrid = (ctx: CanvasRenderingContext2D, chartArea: any, theme: any) => {
  const gridSize = 4
  const { left, right, top, bottom } = chartArea

  ctx.save()
  ctx.strokeStyle = theme.textL3 || '#333' // 使用较暗的颜色绘制网格
  ctx.lineWidth = 0.5
  ctx.globalAlpha = 0.3

  // 绘制垂直网格线
  for (let x = Math.floor(left / gridSize) * gridSize; x <= right; x += gridSize) {
    if (x >= left) {
      ctx.beginPath()
      ctx.moveTo(x, top)
      ctx.lineTo(x, bottom)
      ctx.stroke()
    }
  }

  // 绘制水平网格线
  for (let y = Math.floor(top / gridSize) * gridSize; y <= bottom; y += gridSize) {
    if (y >= top) {
      ctx.beginPath()
      ctx.moveTo(left, y)
      ctx.lineTo(right, y)
      ctx.stroke()
    }
  }

  ctx.restore()
}

/**
 * 绘制4x4像素方块 - 直接在网格位置绘制
 */
const drawPixelSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  const size = 4
  ctx.fillStyle = color
  // x, y 已经是网格中心点，需要转换为网格左上角
  ctx.fillRect(x - 2, y - 2, size, size)
}

/**
 * 计算两点间的网格路径 - 使用步进算法（只有水平和垂直移动）
 */
const getPixelPath = (x1: number, y1: number, x2: number, y2: number): Array<{ x: number; y: number }> => {
  const gridPositions = new Set<string>()
  const points: Array<{ x: number; y: number }> = []

  // 将起点和终点对齐到网格
  const startGridX = alignToGrid(x1)
  const startGridY = alignToGrid(y1)
  const endGridX = alignToGrid(x2)
  const endGridY = alignToGrid(y2)

  // 添加网格点的辅助函数
  const addPoint = (x: number, y: number) => {
    const key = getGridKey(x, y)
    if (!gridPositions.has(key)) {
      gridPositions.add(key)
      points.push({ x: x + 2, y: y + 2 })
    }
  }

  // 添加起点
  addPoint(startGridX, startGridY)

  // 如果起点和终点在同一个网格，只返回起点
  if (startGridX === endGridX && startGridY === endGridY) {
    return points
  }

  let currentX = startGridX
  let currentY = startGridY

  const deltaX = endGridX - startGridX
  const deltaY = endGridY - startGridY

  const stepX = deltaX > 0 ? 4 : deltaX < 0 ? -4 : 0
  const stepY = deltaY > 0 ? 4 : deltaY < 0 ? -4 : 0

  // 步进算法：先完成水平移动，再完成垂直移动
  // 这会产生明显的阶梯效果，适合像素艺术风格

  // 第一阶段：水平移动（只有当需要水平移动时才执行）
  if (deltaX !== 0 && stepX !== 0) {
    const maxStepsX = Math.abs(deltaX / 4) // 最大步数限制
    let stepsX = 0
    while (currentX !== endGridX && stepsX < maxStepsX) {
      currentX += stepX
      addPoint(currentX, currentY)
      stepsX++
    }
  }

  // 第二阶段：垂直移动（只有当需要垂直移动时才执行）
  if (deltaY !== 0 && stepY !== 0) {
    const maxStepsY = Math.abs(deltaY / 4) // 最大步数限制
    let stepsY = 0
    while (currentY !== endGridY && stepsY < maxStepsY) {
      currentY += stepY
      addPoint(currentX, currentY)
      stepsY++
    }
  }

  return points
}

/**
 * 像素方块线条插件Hook
 */
export const usePixelLinePlugin = (config: PixelLinePluginConfig) => {
  return useMemo(
    () => ({
      id: 'pixelLinePlugin',
      beforeDatasetsDraw(chart: any) {
        // 在绘制数据之前先绘制网格
        if (config.showGrid) {
          const { ctx, chartArea } = chart
          drawGrid(ctx, chartArea, config.theme)
        }
      },
      afterDatasetsDraw(chart: any) {
        const { ctx, data } = chart

        // 遍历每个数据集
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex)

          if (meta.hidden || !dataset.data || dataset.data.length === 0) {
            return
          }

          // 保存画布状态
          ctx.save()

          // 获取数据点
          const points = meta.data
          const borderColor = dataset.borderColor || config.theme.brand100

          // 如果只有一个点，只绘制该点
          if (points.length === 1) {
            const { x, y } = points[0].getProps(['x', 'y'])
            drawPixelSquare(ctx, x, y, borderColor)
            ctx.restore()
            return
          }

          // 遍历相邻的数据点，绘制像素方块连接
          for (let i = 0; i < points.length - 1; i++) {
            const currentPoint = points[i]
            const nextPoint = points[i + 1]

            // 获取当前点和下一个点的坐标
            const { x: x1, y: y1 } = currentPoint.getProps(['x', 'y'])
            const { x: x2, y: y2 } = nextPoint.getProps(['x', 'y'])

            // 检查数据是否有效（非null、非undefined）
            const currentValue = dataset.data[i]
            const nextValue = dataset.data[i + 1]

            if (currentValue == null || nextValue == null) {
              continue
            }

            // 获取像素路径并绘制方块
            const pixelPath = getPixelPath(x1, y1, x2, y2)
            pixelPath.forEach((point) => {
              drawPixelSquare(ctx, point.x, point.y, borderColor)
            })
          }

          // 恢复画布状态
          ctx.restore()
        })
      },
    }),
    [config],
  )
}
