import { useCallback, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { useGetHistoryKlineData } from 'store/insights/hooks'

export const usePriceData = (
  symbol: string,
  isBinanceSupport: boolean,
  endTime: number,
  fundingTrendsLen: number,
  initialPriceData: React.MutableRefObject<boolean>,
  setPriceData: (data: { close: number; time: number }[]) => void,
  priceData: { close: number; time: number }[],
) => {
  const triggerGetKlineData = useGetHistoryKlineData()

  const formatPriceData = useMemo(() => {
    const data = {} as Record<string, { close: number; time: number }>
    priceData.forEach((item) => {
      const time = item.time
      const formatTime = dayjs.tz(time, 'Etc/UTC').format('YYYY-MM-DD')
      data[formatTime] = item
    })
    return data
  }, [priceData])

  const getPriceData = useCallback(async () => {
    const paramSymbol = `${symbol}USDT`
    if (symbol && fundingTrendsLen > 0) {
      if (initialPriceData.current) {
        initialPriceData.current = false
        const data = await triggerGetKlineData({
          symbol: paramSymbol,
          interval: '1d',
          endTime: endTime * 1000,
          limit: 1000,
          timeZone: '0',
          isBinanceSupport,
        })
        setPriceData(data.data)
      }
    }
  }, [isBinanceSupport, symbol, endTime, fundingTrendsLen, triggerGetKlineData, setPriceData, initialPriceData])

  useEffect(() => {
    getPriceData()
  }, [getPriceData])

  return {
    formatPriceData,
    getPriceData,
  }
}
