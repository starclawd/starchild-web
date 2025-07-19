import { useEffect, useMemo } from 'react'
import { useGetHistoryKlineData } from 'store/insights/hooks'
import { KlineDataParams, KlineSubInnerDataType, KlineSubDataType } from 'store/insights/insights'
import { useTimezone } from 'store/timezonecache/hooks'
import { convertToBinanceTimeZone } from 'utils/timezone'

interface UseBinanceKlinePollingProps {
  isBinanceSupport: boolean
  historicalDataLoaded: boolean
  symbol: string
  paramSymbol: string
  selectedPeriod: string
  setKlinesubData: (data: KlineSubInnerDataType | null) => void
}

export const useBinanceKlinePolling = ({
  isBinanceSupport,
  historicalDataLoaded,
  symbol,
  paramSymbol,
  selectedPeriod,
  setKlinesubData,
}: UseBinanceKlinePollingProps) => {
  const triggerGetKlineData = useGetHistoryKlineData()
  const [timezone] = useTimezone()

  // 获取币安API格式的时区
  const binanceTimeZone = useMemo(() => {
    return convertToBinanceTimeZone(timezone)
  }, [timezone])

  // 使用定时器轮询获取币安最新K线数据
  useEffect(() => {
    // 只有在支持币安且已加载历史数据时才启动轮询
    if (isBinanceSupport && historicalDataLoaded && symbol) {
      // 首次获取数据
      const fetchLatestKlineData = async () => {
        try {
          const response = await triggerGetKlineData({
            isBinanceSupport,
            symbol: paramSymbol,
            interval: selectedPeriod,
            limit: 1, // 只获取最新的一条K线数据
            timeZone: binanceTimeZone, // 使用转换后的时区格式
            // 不传endTime，获取最新数据
          } as KlineDataParams)

          if (response.data && response.data.length > 0) {
            const latestItem = response.data[0]
            // 格式化为klinesubData格式
            const now = Date.now()
            const formattedKlineData: KlineSubDataType = {
              stream: `${paramSymbol.toLowerCase()}@kline_${selectedPeriod}`,
              data: {
                e: 'kline',
                E: now,
                s: paramSymbol.toUpperCase(),
                k: {
                  t: new Date(latestItem.time).getTime(),
                  T: now,
                  s: paramSymbol.toUpperCase(),
                  i: selectedPeriod,
                  f: 0,
                  L: 0,
                  o: (latestItem.open || latestItem.close || latestItem.value).toString(),
                  c: (latestItem.close || latestItem.value).toString(),
                  h: (latestItem.high || latestItem.close || latestItem.value).toString(),
                  l: (latestItem.low || latestItem.close || latestItem.value).toString(),
                  v: (latestItem.volume || 0).toString(),
                  n: 0,
                  x: false,
                  q: '0',
                  V: '0',
                  Q: '0',
                  B: '0',
                },
              },
            }
            setKlinesubData(formattedKlineData.data as KlineSubInnerDataType)
          }
        } catch (error) {
          console.error('binance error:', error)
        }
      }

      // 首次执行
      fetchLatestKlineData()

      // 设置定时器，每60秒轮询一次
      const intervalId = setInterval(fetchLatestKlineData, 60000)

      // 组件卸载时清除定时器
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [
    isBinanceSupport,
    historicalDataLoaded,
    symbol,
    paramSymbol,
    selectedPeriod,
    triggerGetKlineData,
    setKlinesubData,
    binanceTimeZone,
  ])
}
