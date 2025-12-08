import dayjs from 'dayjs'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  BinanceSymbolsDataType,
  CoingeckoCoinIdMapDataType,
  KlineSubDataType,
  KlineSubInnerDataType,
  LiveChatDataType,
} from './insights'
import {
  updateBinanceSymbols,
  updateCoingeckoCoinIdMap,
  updateKlineSubData,
  updateLiveChatList,
} from './reducer'
import { useLazyGetExchangeInfoQuery, useLazyGetKlineDataQuery } from 'api/binance'
import { KLINE_SUB_ID, KLINE_UNSUB_ID, WS_TYPE } from 'store/websocket/websocket'
import { KlineSubscriptionParams, useWebSocketConnection } from 'store/websocket/hooks'
import { createSubscribeMessage, createUnsubscribeMessage, formatKlineChannel } from 'store/websocket/utils'
import { webSocketDomain } from 'utils/url'
import { useTimezone } from 'store/timezonecache/hooks'
import {
  useLazyGetCoinDataQuery,
  useLazyGetCoingeckoCoinIdMapQuery,
  useLazyGetCoingeckoCoinOhlcRangeQuery,
} from 'api/coingecko'

export function getCoinGeckoMaxLimit(interval: string) {
  let limit = 0
  switch (interval) {
    case '1h':
    case '2h':
    case '4h':
    case '6h':
    case '8h':
    case '12h':
      // 根据限制，hourly最多支持31天数据
      limit = 500
      break
    case '1d':
    case '3d':
    case '1w':
    case '1M':
      // 根据限制，daily最多支持180天数据
      limit = 180
      break
    default:
      // 对于分钟级别的K线，使用hourly
      limit = 500
  }
  return limit
}

export function useGetHistoryKlineData() {
  const [triggerGetKlineData] = useLazyGetKlineDataQuery()
  const [triggerGetCoingeckoCoinOhlcRange] = useLazyGetCoingeckoCoinOhlcRangeQuery()

  const getHistoryData = useCallback(
    async ({
      symbol,
      interval,
      limit = 320,
      startTime,
      endTime,
      timeZone,
      coingeckoId,
      isBinanceSupport,
    }: {
      symbol: string
      interval: string
      limit?: number
      startTime?: number
      endTime?: number
      timeZone?: string
      coingeckoId: string
      isBinanceSupport: boolean
    }) => {
      try {
        // 判断是否使用币安数据
        if (isBinanceSupport) {
          // 币安API请求参数
          const params: any = {
            symbol,
            interval,
            limit,
          }

          // 如果提供了开始时间和结束时间，则添加到参数中
          if (startTime) params.startTime = startTime
          if (endTime) params.endTime = endTime
          // 如果提供了时区，则添加到参数中
          if (timeZone) params.timeZone = timeZone

          const response = await triggerGetKlineData(params)

          if (response.data) {
            // 转换币安K线数据格式为图表需要的格式
            // 币安K线数据格式: [开盘时间, 开盘价, 最高价, 最低价, 收盘价, 成交量, 收盘时间, ...]
            const formattedData = response.data.map((item: any) => ({
              time: item[0], // 使用开盘时间
              value: parseFloat(item[4]), // 使用收盘价
              open: parseFloat(item[1]),
              high: parseFloat(item[2]),
              low: parseFloat(item[3]),
              close: parseFloat(item[4]),
              volume: parseFloat(item[5]),
            }))

            return {
              data: formattedData,
              error: null,
            }
          }
        } else {
          // 计算时间范围
          const now = Date.now()
          // 根据limit和endTime计算from时间戳
          // endTime表示查询的截止时间，如果没有指定则使用当前时间
          const to = endTime || now

          // 根据不同的interval确定合适的时间跨度
          let timeSpan = 0

          // 将币安的K线周期转换为CoinGecko支持的格式
          let cgInterval = 'daily' // 默认为日线

          switch (interval) {
            case '1h':
            case '2h':
            case '4h':
            case '6h':
            case '8h':
            case '12h':
              cgInterval = 'hourly'
              // 根据限制，hourly最多支持31天数据
              timeSpan = Math.min(31 * 24 * 60 * 60 * 1000, limit * 60 * 60 * 1000)
              break
            case '1d':
            case '3d':
            case '1w':
            case '1M':
              cgInterval = 'daily'
              // 根据限制，daily最多支持180天数据
              timeSpan = Math.min(180 * 24 * 60 * 60 * 1000, limit * 24 * 60 * 60 * 1000)
              break
            default:
              // 对于分钟级别的K线，使用hourly
              cgInterval = 'hourly'
              timeSpan = Math.min(31 * 24 * 60 * 60 * 1000, limit * 60 * 60 * 1000)
          }

          // 计算from时间戳（秒）
          const from = Math.floor((to - timeSpan) / 1000)

          // 发起请求
          const response = await triggerGetCoingeckoCoinOhlcRange({
            id: coingeckoId,
            from,
            to: Math.floor(to / 1000),
            interval: cgInterval,
          })

          if (response?.data?.data) {
            // CoinGecko返回的OHLC数据格式: [时间戳(ms), 开盘价, 最高价, 最低价, 收盘价]
            const formattedData = response.data.data.map((item: any) => ({
              time: item[0], // 时间戳(ms)
              value: parseFloat(item[4]), // 收盘价
              open: parseFloat(item[1]),
              high: parseFloat(item[2]),
              low: parseFloat(item[3]),
              close: parseFloat(item[4]),
              // CoinGecko API没有提供成交量数据
              volume: 0,
            }))

            return {
              data: formattedData,
              error: null,
            }
          }
        }

        return {
          data: [],
          error: '获取数据失败',
        }
      } catch (error) {
        console.error('获取K线数据错误:', error)
        return {
          data: [],
          error,
        }
      }
    },
    [triggerGetKlineData, triggerGetCoingeckoCoinOhlcRange],
  )

  return getHistoryData
}

// K线数据订阅 Hook
export function useKlineSubscription() {
  const { sendMessage, isOpen } = useWebSocketConnection(webSocketDomain[WS_TYPE.BINNANCE_WS])

  // 订阅 K线数据
  const subscribe = useCallback(
    (params: KlineSubscriptionParams) => {
      const { symbol, interval, timeZone } = params
      // 格式化频道名，可能需要包含时区信息
      const channel = formatKlineChannel(symbol, interval, timeZone)
      if (isOpen) {
        sendMessage(createSubscribeMessage(channel, KLINE_SUB_ID))
      }
    },
    [isOpen, sendMessage],
  )

  // 取消订阅 K线数据
  const unsubscribe = useCallback(
    (params: KlineSubscriptionParams) => {
      const { symbol, interval, timeZone } = params
      // 确保取消订阅和订阅使用相同的频道名
      const channel = formatKlineChannel(symbol, interval, timeZone)
      if (isOpen) {
        sendMessage(createUnsubscribeMessage(channel, KLINE_UNSUB_ID))
      }
    },
    [isOpen, sendMessage],
  )
  return {
    isOpen,
    subscribe,
    unsubscribe,
  }
}

export function useKlineSubData(): [KlineSubInnerDataType, (data: KlineSubDataType | null) => void] {
  const klineSubData = useSelector((state: RootState) => state.insights.klineSubData)
  const dispatch = useDispatch()
  const setKlineSubData = useCallback(
    (data: KlineSubDataType | null) => {
      dispatch(updateKlineSubData(data))
    },
    [dispatch],
  )
  return [klineSubData?.data as KlineSubInnerDataType, setKlineSubData]
}

export function useGetFormatDisplayTime() {
  const [timezone] = useTimezone()
  const formatTimeDisplay = useCallback(
    (createdAt: number) => {
      const now = Date.now()
      const diffSeconds = Math.floor((now - createdAt) / 1000)

      if (diffSeconds < 60) {
        // 小于1分钟
        return `${diffSeconds} seconds ago`
      } else if (diffSeconds < 3600) {
        // 小于1小时
        const minutes = Math.floor(diffSeconds / 60)
        return `${minutes} minutes ago`
      } else if (diffSeconds < 86400) {
        // 小于1天
        const hours = Math.floor(diffSeconds / 3600)
        return `${hours} hours ago`
      } else {
        // 大于1天，显示格式化的日期
        return dayjs.tz(createdAt, timezone).format('MM-DD HH:mm')
      }
    },
    [timezone],
  )
  return formatTimeDisplay
}

export function useGetCoingeckoCoinIdMap() {
  const [triggerGetCoingeckoCoinIdMap] = useLazyGetCoingeckoCoinIdMapQuery()
  const [, setCoingeckoCoinIdMap] = useCoingeckoCoinIdMap()

  return useCallback(async () => {
    try {
      const data = await triggerGetCoingeckoCoinIdMap(1)
      setCoingeckoCoinIdMap(data.data.data)
      return data
    } catch (error) {
      return error
    }
  }, [setCoingeckoCoinIdMap, triggerGetCoingeckoCoinIdMap])
}

export function useCoingeckoCoinIdMap(): [CoingeckoCoinIdMapDataType[], (data: CoingeckoCoinIdMapDataType[]) => void] {
  const coingeckoCoinIdMap = useSelector((state: RootState) => state.insights.coingeckoCoinIdMap)
  const dispatch = useDispatch()
  const setCoingeckoCoinIdMap = useCallback(
    (data: CoingeckoCoinIdMapDataType[]) => {
      dispatch(updateCoingeckoCoinIdMap(data))
    },
    [dispatch],
  )
  return [coingeckoCoinIdMap, setCoingeckoCoinIdMap]
}

export function useGetExchangeInfo() {
  const [triggerGetExchangeInfo] = useLazyGetExchangeInfoQuery()
  const [, setBinanceSymbols] = useBinanceSymbols()
  return useCallback(async () => {
    try {
      const data = await triggerGetExchangeInfo(1)
      setBinanceSymbols(data.data.symbols)
      return data
    } catch (error) {
      return error
    }
  }, [setBinanceSymbols, triggerGetExchangeInfo])
}

export function useBinanceSymbols(): [BinanceSymbolsDataType[], (data: BinanceSymbolsDataType[]) => void] {
  const binanceSymbols = useSelector((state: RootState) => state.insights.binanceSymbols)
  const dispatch = useDispatch()
  const setBinanceSymbols = useCallback(
    (data: BinanceSymbolsDataType[]) => {
      dispatch(updateBinanceSymbols(data))
    },
    [dispatch],
  )
  return [binanceSymbols, setBinanceSymbols]
}

export function useGetCoinData() {
  const [triggerGetCoinData] = useLazyGetCoinDataQuery()
  return useCallback(
    async (coingeckoId: string) => {
      try {
        const data = await triggerGetCoinData({
          id: coingeckoId,
        })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerGetCoinData],
  )
}

// insights订阅 Hook
export function useInsightsSubscription(options?: { handleMessage?: boolean }) {
  const { sendMessage, isOpen } = useWebSocketConnection(webSocketDomain[WS_TYPE.INSIGHTS_WS], options)

  const subscribe = useCallback(
    (channel: string, id: number) => {
      if (isOpen) {
        sendMessage(createSubscribeMessage(channel, id))
      }
    },
    [isOpen, sendMessage],
  )

  const unsubscribe = useCallback(
    (channel: string, id: number) => {
      if (isOpen) {
        sendMessage(createUnsubscribeMessage(channel, id))
      }
    },
    [isOpen, sendMessage],
  )
  return {
    isOpen,
    subscribe,
    unsubscribe,
  }
}

