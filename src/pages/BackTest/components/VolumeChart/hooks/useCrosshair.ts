import { useEffect } from 'react'
import { Chart as ChartJS } from 'chart.js'
import { crosshairPlugin } from '../utils'

type MockDataItem = {
  time: string
  equity: number
  hold: number
  originalEquity: number
  isIntersection: boolean
}

export const useCrosshair = (
  chartRef: React.RefObject<ChartJS<'line', number[], string> | null>,
  mockData: MockDataItem[],
  isCheckedEquity: boolean,
  isCheckedHold: boolean,
  setCrosshairData: (
    data: {
      x: number
      dataIndex: number
      xLabel: string
      equityValue: number
      holdValue: number
      equityY: number
      holdY: number
    } | null,
  ) => void,
) => {
  useEffect(() => {
    if (!ChartJS.registry.plugins.get('crosshair')) {
      ChartJS.register(crosshairPlugin)
    }

    const chart = chartRef.current
    if (chart && chart.canvas) {
      const canvas = chart.canvas

      const handleCanvasMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (isNaN(x) || isNaN(y)) return

        const dataX = chart.scales.x.getValueForPixel(x)

        if (dataX !== undefined && dataX >= 0 && dataX < mockData.length) {
          const dataIndex = Math.round(dataX)
          const currentDataPoint = mockData[dataIndex]

          if (currentDataPoint?.isIntersection) {
            ;(chart as any).crosshair = { draw: false }
            setCrosshairData(null)
            chart.update('none')
            return
          }

          const xLabel = currentDataPoint?.time || ''

          let equityValue, holdValue, equityY, holdY

          if (isCheckedEquity && chart.scales.y) {
            equityValue = currentDataPoint?.originalEquity || 0
            const relativeValue = currentDataPoint?.equity || 0
            equityY = chart.scales.y.getPixelForValue(relativeValue)
          }

          if (isCheckedHold && chart.scales.y1) {
            holdValue = currentDataPoint?.hold || 0
            holdY = chart.scales.y1.getPixelForValue(holdValue)
          }

          ;(chart as any).crosshair = {
            x,
            equityY,
            holdY,
            equityValue,
            holdValue,
            draw: true,
          }

          setCrosshairData({
            x,
            dataIndex,
            xLabel,
            equityValue: equityValue || 0,
            holdValue: holdValue || 0,
            equityY: equityY || 0,
            holdY: holdY || 0,
          })

          chart.update('none')
        }
      }

      const handleCanvasMouseLeave = () => {
        ;(chart as any).crosshair = { draw: false }
        setCrosshairData(null)
        chart.update('none')
      }

      canvas.addEventListener('mousemove', handleCanvasMouseMove)
      canvas.addEventListener('mouseleave', handleCanvasMouseLeave)

      return () => {
        canvas.removeEventListener('mousemove', handleCanvasMouseMove)
        canvas.removeEventListener('mouseleave', handleCanvasMouseLeave)
        try {
          ChartJS.unregister(crosshairPlugin)
        } catch (e) {
          // 忽略卸载错误
        }
      }
    }

    return () => {
      try {
        ChartJS.unregister(crosshairPlugin)
      } catch (e) {
        // 忽略卸载错误
      }
    }
  }, [chartRef, mockData, isCheckedEquity, isCheckedHold, setCrosshairData])
}
