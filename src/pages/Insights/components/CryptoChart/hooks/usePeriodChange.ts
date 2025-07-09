import { useCallback } from 'react'
import { UTCTimestamp } from 'lightweight-charts'
import { useGetHistoryKlineData } from 'store/insights/hooks'
import { useGetConvertPeriod } from 'store/insightscache/hooks'
import { ChartDataItem, KlineDataParams } from 'store/insights/insights'

interface UsePeriodChangeProps {
  paramSymbol: string
  isBinanceSupport: boolean
  binanceTimeZone: string
  setHistoricalDataLoaded: (loaded: boolean) => void
  setChartData: (data: ChartDataItem[]) => void
  seriesRef: React.RefObject<any>
}

export const usePeriodChange = ({
  paramSymbol,
  isBinanceSupport,
  binanceTimeZone,
  setHistoricalDataLoaded,
  setChartData,
  seriesRef,
}: UsePeriodChangeProps) => {
  const triggerGetKlineData = useGetHistoryKlineData()
  const getConvertPeriod = useGetConvertPeriod()

  const handlePeriodChange = useCallback(
    async (period: string) => {
      setHistoricalDataLoaded(false)
      setChartData([])

      try {
        const convertedPeriod = getConvertPeriod(period as any, isBinanceSupport)

        const response = await triggerGetKlineData({
          isBinanceSupport,
          symbol: paramSymbol,
          interval: isBinanceSupport ? period : convertedPeriod,
          limit: 500,
          timeZone: binanceTimeZone,
        } as KlineDataParams)

        if (response.data && response.data.length > 0) {
          const formattedData = response.data.map((item: any) => {
            const timeFormat = Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp

            return {
              time: timeFormat,
              value: item.close || item.value,
              open: item.open,
              high: item.high,
              low: item.low,
              close: item.close || item.value,
              volume: item.volume || 0,
            }
          })

          setChartData(formattedData)

          if (seriesRef.current) {
            seriesRef.current.setData(formattedData)
          }

          setHistoricalDataLoaded(true)
        }
      } catch (error) {
        setHistoricalDataLoaded(false)
      }
    },
    [
      paramSymbol,
      isBinanceSupport,
      binanceTimeZone,
      triggerGetKlineData,
      getConvertPeriod,
      setHistoricalDataLoaded,
      setChartData,
      seriesRef,
    ],
  )

  return { handlePeriodChange }
}
