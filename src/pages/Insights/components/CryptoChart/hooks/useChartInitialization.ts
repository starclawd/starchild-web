import { useEffect, useRef, useCallback } from 'react'
import { createChart, IChartApi, ISeriesApi, AreaSeries, UTCTimestamp, LineStyle } from 'lightweight-charts'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { useIsMobile } from 'store/application/hooks'

interface UseChartInitializationProps {
  chartContainerRef: React.RefObject<HTMLDivElement | null>
  customTimeFormatter: (timestamp: UTCTimestamp) => string
  paramSymbol: string
  selectedPeriod: string
  triggerGetKlineData: any
}

export const useChartInitialization = ({
  chartContainerRef,
  customTimeFormatter,
  paramSymbol,
  selectedPeriod,
  triggerGetKlineData,
}: UseChartInitializationProps) => {
  const isMobile = useIsMobile()
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)

  const handleResize = useCallback(() => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      })
    }
  }, [chartContainerRef])

  useEffect(() => {
    if (!chartContainerRef.current) return

    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#07080A' },
        textColor: 'rgba(255, 255, 255, 0.54)',
        fontSize: isMobile ? 11 : 12,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.06)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.06)' },
      },
      localization: {
        locale: 'en-US',
        dateFormat: 'yyyy/MM/dd',
        timeFormatter: customTimeFormatter,
        priceFormatter: (price: number) => {
          if (price >= 1) {
            return formatNumber(toFix(price, 2))
          } else if (price >= 0.01) {
            return formatNumber(toFix(price, 4))
          } else if (price >= 0.0001) {
            return formatNumber(toFix(price, 6))
          } else {
            return formatNumber(toFix(price, 8))
          }
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.06)',
        textColor: 'rgba(255, 255, 255, 0.54)',
        entireTextOnly: true,
      },
      crosshair: {
        vertLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: LineStyle.LargeDashed,
          labelVisible: true,
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: LineStyle.LargeDashed,
          labelVisible: true,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    })

    chartRef.current = chart

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#335FFC',
      lineWidth: 1,
      topColor: 'rgba(51, 95, 252, 0.36)',
      bottomColor: 'rgba(51, 95, 252, 0.00)',
      priceLineVisible: false,
      lastValueVisible: false,
      lineType: 0,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3,
      crosshairMarkerBackgroundColor: '#000',
      crosshairMarkerBorderColor: '#335FFC',
      crosshairMarkerBorderWidth: 3,
    })

    seriesRef.current = areaSeries
    chart.timeScale().fitContent()

    const handleWindowResize = () => {
      handleResize()
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [isMobile, paramSymbol, selectedPeriod, triggerGetKlineData, customTimeFormatter, handleResize, chartContainerRef])

  return {
    chartRef,
    seriesRef,
    handleResize,
  }
}
