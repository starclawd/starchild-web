import { useCallback } from 'react'
import { UTCTimestamp, createSeriesMarkers, ISeriesApi } from 'lightweight-charts'
import { ChartDataItem, TradeMarker } from 'store/insights/insights'

interface UseTradeMarkersProps {
  marksDetailData: any[]
  selectedPeriod: string
}

export const useTradeMarkers = ({ marksDetailData, selectedPeriod }: UseTradeMarkersProps) => {
  // 计算marksDetailData的时间范围
  const getMarksTimeRange = useCallback(() => {
    if (marksDetailData.length === 0) return null

    const timestamps = marksDetailData.map((item) => {
      const timestamp = Number(item.timestamp)
      // 如果是毫秒时间戳，转换为秒时间戳
      return timestamp > 10000000000 ? Math.floor(timestamp / 1000) : timestamp
    })

    const min = Math.min(...timestamps)
    const max = Math.max(...timestamps)

    // 验证时间戳是否有效
    if (!isFinite(min) || !isFinite(max) || min <= 0 || max <= 0 || min >= max) {
      return null
    }

    return { min, max }
  }, [marksDetailData])

  // 生成模拟买卖标签数据
  const generateMockTradeMarkers = useCallback((): TradeMarker[] => {
    if (marksDetailData.length === 0) return []

    const markers: TradeMarker[] = []
    marksDetailData.forEach((item) => {
      const isBuy = item.side === 'buy'

      // 确保时间戳格式一致，与getMarksTimeRange保持一致
      const timestamp = Number(item.timestamp)
      const normalizedTimestamp = timestamp > 10000000000 ? Math.floor(timestamp / 1000) : timestamp

      markers.push({
        time: normalizedTimestamp as UTCTimestamp,
        position: isBuy ? 'belowBar' : 'aboveBar',
        color: isBuy ? '#30FFB4' : '#FF6291',
        shape: isBuy ? 'arrowUp' : 'arrowDown',
        text: isBuy ? 'Buy' : 'Sell',
        size: 1,
      })
    })

    return markers
  }, [marksDetailData])

  // 重新设置交易标记的函数
  const refreshTradeMarkers = useCallback(
    (
      currentChartData: ChartDataItem[],
      seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>,
      chartRef: React.RefObject<any>,
    ) => {
      if (!seriesRef.current || !chartRef.current || marksDetailData.length === 0) return
      // 生成交易标记
      const tradeMarkers = generateMockTradeMarkers()
      const adjustedMarkers: TradeMarker[] = []

      // 获取当前周期对应的秒数
      const getPeriodSeconds = (period: string): number => {
        switch (period) {
          case '1m':
            return 60
          case '3m':
            return 3 * 60
          case '5m':
            return 5 * 60
          case '15m':
            return 15 * 60
          case '30m':
            return 30 * 60
          case '1h':
            return 60 * 60
          case '2h':
            return 2 * 60 * 60
          case '4h':
            return 4 * 60 * 60
          case '6h':
            return 6 * 60 * 60
          case '8h':
            return 8 * 60 * 60
          case '12h':
            return 12 * 60 * 60
          case '1d':
            return 24 * 60 * 60
          case '3d':
            return 3 * 24 * 60 * 60
          case '1w':
            return 7 * 24 * 60 * 60
          case '1M':
            return 30 * 24 * 60 * 60
          default:
            return 24 * 60 * 60
        }
      }

      const periodSeconds = getPeriodSeconds(selectedPeriod)

      tradeMarkers.forEach((marker) => {
        const markerTime = Number(marker.time)

        // 在currentChartData中查找匹配的K线柱子
        let matchingKline = currentChartData.find((dataPoint: ChartDataItem) => {
          const klineTime = Number(dataPoint.time)
          return klineTime === Math.floor(markerTime / periodSeconds) * periodSeconds
        })

        // 如果精确匹配失败，尝试在一个周期范围内查找最接近的
        if (!matchingKline) {
          let closestKline = null
          let minTimeDiff = Infinity

          currentChartData.forEach((dataPoint: ChartDataItem) => {
            const klineTime = Number(dataPoint.time)

            // 检查这个K线是否包含交易时间
            if (markerTime >= klineTime && markerTime < klineTime + periodSeconds) {
              matchingKline = dataPoint
              return
            }

            // 记录最接近的K线
            const timeDiff = Math.abs(klineTime - markerTime)
            if (timeDiff < minTimeDiff) {
              minTimeDiff = timeDiff
              closestKline = dataPoint
            }
          })

          // 如果还是没找到包含的K线，使用最接近的K线
          if (!matchingKline && closestKline && minTimeDiff < periodSeconds) {
            matchingKline = closestKline
          }
        }

        if (matchingKline) {
          adjustedMarkers.push({
            time: matchingKline.time as UTCTimestamp,
            position: marker.position,
            color: marker.color,
            shape: marker.shape,
            text: marker.text,
            size: marker.size,
          })
        }
      })

      // 设置标记
      if (adjustedMarkers.length > 0) {
        createSeriesMarkers(seriesRef.current, adjustedMarkers)
      }
    },
    [marksDetailData, selectedPeriod, generateMockTradeMarkers],
  )

  return {
    getMarksTimeRange,
    generateMockTradeMarkers,
    refreshTradeMarkers,
  }
}
