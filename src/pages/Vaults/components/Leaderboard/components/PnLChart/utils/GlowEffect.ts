import { Plugin } from 'chart.js'
import { useRef } from 'react'

export const useGlowEffect = () => {
  const activeDatasetIndexRef = useRef<number | null>(null)

  const plugin: Plugin = {
    id: 'glowEffect',
    afterDatasetsDraw(chart) {
      const { ctx } = chart
      const activeDatasetIndex = activeDatasetIndexRef.current

      if (activeDatasetIndex === null || activeDatasetIndex === undefined) return

      const meta = chart.getDatasetMeta(activeDatasetIndex)
      const dataset = chart.data.datasets[activeDatasetIndex]

      if (!meta.data.length) return

      // 保存当前状态
      ctx.save()

      // 绘制多层发光效果
      const borderColor = dataset.borderColor as string
      const lineWidth = (dataset.borderWidth as number) || 2

      // 第一层：外层发光
      ctx.shadowColor = borderColor
      ctx.shadowBlur = 12
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.globalAlpha = 0.6
      ctx.lineWidth = lineWidth + 2
      ctx.strokeStyle = borderColor
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // 绘制外层发光，从第一个有效数据点开始
      ctx.beginPath()
      let hasStarted = false

      meta.data.forEach((point: any, index: number) => {
        const { x, y } = point.getProps(['x', 'y'])
        const originalDataValue = dataset.data[index]

        // 只绘制有实际数据的点（非null、非undefined）
        if (originalDataValue !== null && originalDataValue !== undefined) {
          if (!hasStarted) {
            ctx.moveTo(x, y)
            hasStarted = true
          } else {
            ctx.lineTo(x, y)
          }
        }
      })

      if (hasStarted) {
        ctx.stroke()
      }

      // 第二层：内层发光
      if (hasStarted) {
        ctx.shadowBlur = 6
        ctx.globalAlpha = 0.8
        ctx.lineWidth = lineWidth

        // 重新绘制内层发光路径
        ctx.beginPath()
        let innerHasStarted = false

        meta.data.forEach((point: any, index: number) => {
          const { x, y } = point.getProps(['x', 'y'])
          const originalDataValue = dataset.data[index]

          // 只绘制有实际数据的点（非null、非undefined）
          if (originalDataValue !== null && originalDataValue !== undefined) {
            if (!innerHasStarted) {
              ctx.moveTo(x, y)
              innerHasStarted = true
            } else {
              ctx.lineTo(x, y)
            }
          }
        })

        if (innerHasStarted) {
          ctx.stroke()
        }
      }

      // 恢复状态
      ctx.restore()
    },
  }

  const setActiveDatasetIndex = (index: number | null) => {
    activeDatasetIndexRef.current = index
  }

  return {
    plugin,
    setActiveDatasetIndex,
  }
}
