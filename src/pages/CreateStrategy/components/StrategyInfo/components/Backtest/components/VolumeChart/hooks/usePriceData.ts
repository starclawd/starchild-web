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
  coingeckoId: string,
  setIsPending: (pending: boolean) => void,
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

        if (isBinanceSupport) {
          // Binance supports up to 1000 data points in a single request
          setIsPending(true)
          try {
            const data = await triggerGetKlineData({
              symbol: paramSymbol,
              interval: '1d',
              endTime: endTime * 1000,
              limit: 1000,
              timeZone: '0',
              isBinanceSupport,
              coingeckoId,
            })
            setPriceData(data.data)
          } finally {
            setIsPending(false)
          }
        } else {
          // For non-Binance sources (like CoinGecko), we need to make multiple requests
          // to accumulate 1000 data points since they only support 180 days per request
          setIsPending(true)
          try {
            const targetDataPoints = 1000
            const maxPerRequest = 180
            const allPriceData: { close: number; time: number }[] = []
            let currentEndTime = endTime * 1000
            let remainingPoints = targetDataPoints

            while (remainingPoints > 0 && allPriceData.length < targetDataPoints) {
              const requestLimit = Math.min(maxPerRequest, remainingPoints)

              const data = await triggerGetKlineData({
                symbol: paramSymbol,
                interval: '1d',
                endTime: currentEndTime,
                limit: requestLimit,
                timeZone: '0',
                isBinanceSupport,
                coingeckoId,
              })

              if (data.data && data.data.length > 0) {
                // Add the new data to our collection
                allPriceData.unshift(...data.data)

                // Update the end time for the next request (go back in time)
                // Each data point represents 1 day, so we go back by the number of days we just fetched
                const daysToSubtract = data.data.length * 24 * 60 * 60 * 1000 // Convert days to milliseconds
                currentEndTime -= daysToSubtract

                remainingPoints -= data.data.length
              } else {
                // No more data available, break the loop
                break
              }
            }

            // Set the combined data (up to 1000 points)
            setPriceData(allPriceData)
          } finally {
            setIsPending(false)
          }
        }
      }
    }
  }, [
    isBinanceSupport,
    symbol,
    endTime,
    fundingTrendsLen,
    coingeckoId,
    triggerGetKlineData,
    setPriceData,
    initialPriceData,
    setIsPending,
  ])

  useEffect(() => {
    getPriceData()
  }, [getPriceData])

  return {
    formatPriceData,
    getPriceData,
  }
}
