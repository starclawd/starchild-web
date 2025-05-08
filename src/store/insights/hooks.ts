import { useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { InsightsDataType, KlineSubDataType, TokenListDataType } from "./insights.d"
import { useLazyGetAllInsightsQuery } from "api/insights"
import { updateAllInsightsData, updateCurrentShowId, updateKlineSubData, updateMarkerScrollPoint } from "./reducer"
import { PAGE_SIZE } from "constants/index"
import { useLazyGetKlineDataQuery } from "api/binance"
import { KLINE_SUB_ID, KLINE_UNSUB_ID, WS_TYPE } from "store/websocket/websocket"
import { KlineSubscriptionParams, useWebSocketConnection } from "store/websocket/hooks"
import { createSubscribeMessage, createUnsubscribeMessage, formatKlineChannel } from "store/websocket/utils"
import { webSocketDomain } from "utils/url"

export function useTokenList(): TokenListDataType[] {
  return useMemo(() => {
    return [
      {
        symbol: 'BTC',
        des: 'BTC is going to the moon',
      },
      {
        symbol: 'ETH',
        des: 'ETH is going to the moon',
      },
      {
        symbol: 'SOL',
        des: 'SOL is going to the moon',
      },
    ]
  }, [])
}

export function useGetAllInsights() {
  const [triggerGetAllInsights] = useLazyGetAllInsightsQuery()
  const dispatch = useDispatch()
  return useCallback(async ({
    pageIndex,
  }: {
    pageIndex: number
  }) => {
    try {
      const data = await triggerGetAllInsights({ pageIndex, pageSize: PAGE_SIZE })
      const list = (data.data as any).list || []
      const totalSize = (data.data as any).totalSize || 0
      dispatch(updateAllInsightsData({ list, totalSize }))
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetAllInsights, dispatch])
}


// [
//   {
//     id: '1',
//     symbol: 'BTC',
//     isLong: true,
//     title: 'BTC is going to the moon',
//     content: 'BTC is going to the moon',
//   },
//   {
//     id: '2',
//     symbol: 'ETH',
//     isLong: true,
//     title: 'ETH is going to the moon',
//     content: 'ETH is going to the moon',
//   },
//   {
//     id: '3',
//     symbol: 'SOL',
//     isLong: false,
//     title: 'SOL is going to the moon',
//     content: 'SOL is going to the moon',
//   },
// ]
export function useAllInsightsData(): [InsightsDataType[], number] {
  const allInsightsData = useSelector((state: RootState) => state.insights.allInsightsData)
  return [[
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746686169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746685169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746675169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746665169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746655169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746645169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746635169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746625169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
    {
      query: 'broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)',
      type: 'price_alert',
      timestamp: 1746615169,
      message: '*broccoli714 -6.53% in 15m - now $0.031330(test message, ignore please)*\n\nMessage received and noted as a test. If you need any crypto-related assistance, market analysis, or updates on specific tokens, let me know how I can help!',
      market_id: 'btc'
    },
  ], allInsightsData.totalSize]
}

export function useGetHistoryKlineData() {
  const [triggerGetKlineData] = useLazyGetKlineDataQuery()
  
  const getHistoryData = useCallback(async ({
    symbol,
    interval,
    limit = 320,
    startTime,
    endTime,
  }: {
    symbol: string
    interval: string
    limit?: number
    startTime?: number
    endTime?: number
  }) => {
    try {
      // 币安API请求参数
      const params: any = {
        symbol, 
        interval,
        limit,
      }
      
      // 如果提供了开始时间和结束时间，则添加到参数中
      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime
      
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
          error: null
        }
      }
      
      return {
        data: [],
        error: '获取数据失败'
      }
    } catch (error) {
      console.error('获取K线数据错误:', error)
      return {
        data: [],
        error
      }
    }
  }, [triggerGetKlineData])
  
  return getHistoryData
}


// K线数据订阅 Hook
export function useKlineSubscription() {
  const { sendMessage, isOpen } = useWebSocketConnection(webSocketDomain[WS_TYPE.BINNANCE_WS]);
  
  // 订阅 K线数据
  const subscribe = useCallback((params: KlineSubscriptionParams) => {
    const { symbol, interval } = params;
    const channel = formatKlineChannel(symbol, interval);
    if (isOpen) {
      sendMessage(createSubscribeMessage(channel, KLINE_SUB_ID));
    }
  }, [isOpen, sendMessage]);
  
  // 取消订阅 K线数据
  const unsubscribe = useCallback((params: KlineSubscriptionParams) => {
    const { symbol, interval } = params;
    const channel = formatKlineChannel(symbol, interval);
    if (isOpen) {
      sendMessage(createUnsubscribeMessage(channel, KLINE_UNSUB_ID));
    }
  }, [isOpen, sendMessage]);
  return {
    isOpen,
    subscribe,
    unsubscribe,
  };
}

export function useKlineSubData(): [any, (data: any) => void] {
  const klineSubData = useSelector((state: RootState) => state.insights.klineSubData)
  const dispatch = useDispatch()
  const setKlineSubData = useCallback((data: KlineSubDataType) => {
    dispatch(updateKlineSubData(data))
  }, [dispatch])
  return [klineSubData?.data, setKlineSubData]
}

// K线数据订阅 Hook
export function useInsightsSubscription() {
  const { isOpen } = useWebSocketConnection(webSocketDomain[WS_TYPE.INSIGHTS_WS]);
  return {
    isOpen
  };
}

export function useCurrentShowId(): [string, (id: string) => void] {
  const currentShowId = useSelector((state: RootState) => state.insights.currentShowId)
  const dispatch = useDispatch()
  const setCurrentShowId = useCallback((id: string) => {
    dispatch(updateCurrentShowId(id))
  }, [dispatch])
  return [currentShowId, setCurrentShowId]
}

// 创建一个钩子来存储和设置需要滚动到的marker时间点
export function useMarkerScrollPoint(): [
  number | null,
  (timestamp: number | null) => void
] {
  const dispatch = useDispatch()
  const markerScrollPoint = useSelector((state: RootState) => state.insights.markerScrollPoint)

  const setMarkerScrollPoint = useCallback(
    (timestamp: number | null) => {
      dispatch(updateMarkerScrollPoint(timestamp))
    },
    [dispatch]
  )

  return [markerScrollPoint, setMarkerScrollPoint]
}
