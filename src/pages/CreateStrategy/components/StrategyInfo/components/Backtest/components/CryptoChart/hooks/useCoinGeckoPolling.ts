import { useEffect } from 'react'
import { useGetCoinData } from 'store/insights/hooks'
import { KlineSubInnerDataType, KlineSubDataType } from 'store/insights/insights'
import { useGetConvertPeriod } from 'store/insightscache/hooks'

interface UseCoinGeckoPollingProps {
  isBinanceSupport: boolean
  historicalDataLoaded: boolean
  coingeckoId: string
  paramSymbol: string
  selectedPeriod: string
  setKlinesubData: (data: KlineSubInnerDataType | null) => void
}

// 创建一个函数，将获取的CoinGecko数据转换为klinesubData格式
const createKlineSubData = (
  coinData: any,
  symbol: string,
  period: string,
  getConvertPeriod: (period: any, isBinanceSupport: boolean) => string,
) => {
  if (!coinData || !coinData.market_data) return null

  const now = Date.now()
  const marketData = coinData.market_data

  // 获取当前价格和24小时前价格
  const currentPrice = marketData.current_price?.usd || 0
  const high24h = marketData.high_24h?.usd || currentPrice
  const low24h = marketData.low_24h?.usd || currentPrice
  const priceChange24h = marketData.price_change_24h || 0
  const priceChangePercentage24h = marketData.price_change_percentage_24h || 0

  // 使用CoinGecko提供的1小时价格变化数据
  const priceChangePercentage1h = marketData.price_change_percentage_1h_in_currency?.usd || 0
  // 根据1小时价格变化百分比计算价格变化值
  const priceChange1h = (currentPrice * priceChangePercentage1h) / 100

  // 根据周期选择不同的价格变化数据
  let openPrice = currentPrice
  let period_change = 0

  // 根据getConvertPeriod转换的周期选择价格变化
  const convertedPeriod = getConvertPeriod(period as any, false)
  if (convertedPeriod === '1h') {
    // 1小时价格变化
    openPrice = currentPrice - priceChange1h
    period_change = priceChangePercentage1h
  } else if (convertedPeriod === '1d') {
    // 24小时价格变化
    openPrice = currentPrice - priceChange24h
    period_change = priceChangePercentage24h
  }

  // 确保openPrice不为负数
  openPrice = Math.max(0.000001, openPrice)

  // 创建模拟的K线数据
  const klineData: KlineSubDataType = {
    stream: `${symbol.toLowerCase()}@kline_${period}`,
    data: {
      e: 'kline', // 事件类型
      E: now, // 事件时间
      s: symbol.toUpperCase(), // 交易对
      k: {
        t: now - (convertedPeriod === '1h' ? 3600000 : 86400000), // 开盘时间
        T: now, // 收盘时间
        s: symbol.toUpperCase(), // 交易对
        i: convertedPeriod, // 间隔
        f: 0, // 第一笔成交ID
        L: 0, // 最后一笔成交ID
        o: openPrice.toString(), // 开盘价
        c: currentPrice.toString(), // 收盘价
        h: high24h.toString(), // 最高价，使用24h最高价
        l: low24h.toString(), // 最低价，使用24h最低价
        v: '0', // 成交量，CoinGecko不提供
        n: 0, // 成交笔数
        x: false, // K线是否完结
        q: '0', // 成交额
        V: '0', // 主动买入成交量
        Q: '0', // 主动买入成交额
        B: '0', // 忽略
      },
    },
  }

  return klineData
}

export const useCoinGeckoPolling = ({
  isBinanceSupport,
  historicalDataLoaded,
  coingeckoId,
  paramSymbol,
  selectedPeriod,
  setKlinesubData,
}: UseCoinGeckoPollingProps) => {
  const triggerGetCoinData = useGetCoinData()
  const getConvertPeriod = useGetConvertPeriod()

  // 使用定时器轮询获取CoinGecko价格数据
  useEffect(() => {
    // 只有在不支持币安且已加载历史数据时才启动轮询
    if (!isBinanceSupport && historicalDataLoaded && coingeckoId) {
      const convertedPeriod = getConvertPeriod(selectedPeriod as any, false)
      // 首次获取数据
      const fetchCoinData = async () => {
        try {
          const response: any = await triggerGetCoinData(coingeckoId)
          if (response?.data?.data) {
            const formattedData = createKlineSubData(response.data.data, paramSymbol, convertedPeriod, getConvertPeriod)
            if (formattedData) {
              setKlinesubData(formattedData.data as KlineSubInnerDataType)
            }
          }
        } catch (error) {
          console.error('error:', error)
        }
      }

      // 首次执行
      fetchCoinData()

      // 设置定时器，每5秒轮询一次
      const intervalId = setInterval(fetchCoinData, 60000)

      // 组件卸载时清除定时器
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [
    isBinanceSupport,
    historicalDataLoaded,
    coingeckoId,
    paramSymbol,
    selectedPeriod,
    triggerGetCoinData,
    setKlinesubData,
    getConvertPeriod,
  ])
}
