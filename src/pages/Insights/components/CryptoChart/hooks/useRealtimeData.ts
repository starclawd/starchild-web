import { useEffect } from 'react'
import { UTCTimestamp } from 'lightweight-charts'
import { useKlineSubscription } from 'store/insights/hooks'
import { ChartDataItem, KlineSubInnerDataType } from 'store/insights/insights'

interface UseRealtimeDataProps {
  paramSymbol: string
  selectedPeriod: string
  historicalDataLoaded: boolean
  isBinanceSupport: boolean
  wsTimeZone: string
  klinesubData: KlineSubInnerDataType | null
  chartData: ChartDataItem[]
  seriesRef: React.RefObject<any>
  isOpen: boolean
}

export const useRealtimeData = ({
  paramSymbol,
  selectedPeriod,
  historicalDataLoaded,
  isBinanceSupport,
  wsTimeZone,
  klinesubData,
  chartData,
  seriesRef,
  isOpen,
}: UseRealtimeDataProps) => {
  const { subscribe, unsubscribe } = useKlineSubscription()

  useEffect(() => {
    if (isOpen && paramSymbol && selectedPeriod && historicalDataLoaded && isBinanceSupport) {
      subscribe({
        symbol: paramSymbol.toLowerCase(),
        interval: selectedPeriod,
        timeZone: wsTimeZone,
      })
    }
    return () => {
      if (isBinanceSupport) {
        unsubscribe({
          symbol: paramSymbol.toLowerCase(),
          interval: selectedPeriod,
          timeZone: wsTimeZone,
        })
      }
    }
  }, [isOpen, paramSymbol, selectedPeriod, historicalDataLoaded, subscribe, unsubscribe, wsTimeZone, isBinanceSupport])

  useEffect(() => {
    if (!klinesubData || !seriesRef.current || !historicalDataLoaded || !isBinanceSupport) return

    try {
      const time = Math.floor(new Date(klinesubData?.k?.t).getTime() / 1000) as UTCTimestamp
      const latestData: ChartDataItem = {
        time,
        value: Number(klinesubData.k.c),
        open: Number(klinesubData.k.o),
        high: Number(klinesubData.k.h),
        low: Number(klinesubData.k.l),
        close: Number(klinesubData.k.c),
        volume: Number(klinesubData.k.v),
      }

      if (chartData.length > 0) {
        seriesRef.current.update(latestData)
      }
    } catch (error) {
      console.log('subError', error)
    }
  }, [klinesubData, selectedPeriod, historicalDataLoaded, chartData.length, isBinanceSupport, seriesRef, chartData])
}
