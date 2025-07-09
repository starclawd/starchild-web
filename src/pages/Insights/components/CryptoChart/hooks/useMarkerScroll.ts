import { useEffect } from 'react'
import { IChartApi } from 'lightweight-charts'
import { useMarkerScrollPoint } from 'store/insights/hooks'
import { ChartDataItem } from 'store/insights/insights'

interface UseMarkerScrollProps {
  chartRef: React.RefObject<IChartApi | null>
  seriesRef: React.RefObject<any>
  chartData: ChartDataItem[]
}

export const useMarkerScroll = ({ chartRef, seriesRef, chartData }: UseMarkerScrollProps) => {
  const [markerScrollPoint, setMarkerScrollPoint] = useMarkerScrollPoint()

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current || !markerScrollPoint || chartData.length === 0) return

    try {
      const chart = chartRef.current
      const timeScale = chart.timeScale()

      let closestDataPoint = null
      let minDiff = Infinity
      let targetIndex = -1

      for (let i = 0; i < chartData.length; i++) {
        const dataPoint = chartData[i]
        const chartTime =
          typeof dataPoint.time === 'string'
            ? Math.floor(new Date(dataPoint.time).getTime() / 1000)
            : Number(dataPoint.time)

        const diff = Math.abs(chartTime - markerScrollPoint)

        if (diff < minDiff) {
          minDiff = diff
          closestDataPoint = dataPoint
          targetIndex = i
        }
      }

      if (closestDataPoint && targetIndex !== -1) {
        const visibleRange = timeScale.getVisibleLogicalRange()

        if (visibleRange) {
          const rangeWidth = visibleRange.to - visibleRange.from
          const targetFrom = Math.max(0, targetIndex - rangeWidth / 2)
          const targetTo = targetFrom + rangeWidth

          const currentFrom = visibleRange.from
          const currentTo = visibleRange.to

          const totalFrames = 20
          let currentFrame = 0
          const duration = 200
          const frameInterval = duration / totalFrames

          const animate = () => {
            if (currentFrame >= totalFrames || !chartRef.current) {
              if (chartRef.current) {
                timeScale.setVisibleLogicalRange({
                  from: targetFrom,
                  to: targetTo,
                })
              }
              setMarkerScrollPoint(null)
              return
            }

            const progress = easeInOutCubic(currentFrame / totalFrames)
            const newFrom = currentFrom + (targetFrom - currentFrom) * progress
            const newTo = currentTo + (targetTo - currentTo) * progress

            timeScale.setVisibleLogicalRange({
              from: newFrom,
              to: newTo,
            })

            currentFrame++
            setTimeout(animate, frameInterval)
          }

          animate()
        } else {
          timeScale.fitContent()
          setMarkerScrollPoint(null)
        }
      } else {
        setMarkerScrollPoint(null)
      }
    } catch (error) {
      console.error('滚动图表错误:', error)
      setMarkerScrollPoint(null)
    }
  }, [markerScrollPoint, chartData, setMarkerScrollPoint, chartRef, seriesRef])

  return {
    markerScrollPoint,
    setMarkerScrollPoint,
  }
}
