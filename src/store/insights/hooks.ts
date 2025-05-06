import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { InsightsDataType, TokenListDataType } from "./insights.d"
import { useLazyGetAllInsightsQuery } from "api/insights"
import { updateAllInsightsData } from "./reducer"
import { PAGE_SIZE } from "constants/index"
import { useLazyGetKlineDataQuery } from "api/binance"
import { subscribeWebsocket, unsubscribeWebsocket } from "store/websocket/actions"
import { KLINE_SUB_ID, KLINE_UNSUB_ID, WsKeyEnumType } from "store/websocket/websocket"

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
      id: '1',
      symbol: 'BTC',
      isLong: true,
      title: 'BTC is going to the moon',
      content: 'BTC is going to the moon',
    },
    {
      id: '2',
      symbol: 'ETH',
      isLong: true,
      title: 'ETH is going to the moon',
      content: 'ETH is going to the moon',
    },
    {
      id: '3',
      symbol: 'SOL',
      isLong: false,
      title: 'SOL is going to the moon',
      content: 'SOL is going to the moon',
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

export function useSubBinanceKlineData(): ({
  symbol,
  interval,
}: {
  symbol: string
  interval: string
}) => void {
  const dispatch = useDispatch()
  const subOrderBook = useCallback(
    ({
      symbol,
      interval,
    }: {
      symbol: string
      interval: string
    }) => {
      dispatch(
        subscribeWebsocket({
          wsKey: WsKeyEnumType.BinanceWs,
          sendData: {
            id: KLINE_SUB_ID,
            method: "SUBSCRIBE",
            params: [`${symbol}@kline_${interval}`]
          },
        })
      )
    },
    [dispatch]
  )
  return subOrderBook
}

export function useUnSubBinanceKlineData(): ({
  symbol,
  interval,
}: {
  symbol: string
  interval: string
}) => void {
  const dispatch = useDispatch()
  const unSubOrderBook = useCallback(
    ({
      symbol,
      interval,
    }: {
      symbol: string
      interval: string
    }) => {
      dispatch(
        unsubscribeWebsocket({
          wsKey: WsKeyEnumType.BinanceWs,
          sendData: {
            id: KLINE_UNSUB_ID,
            method: "UNSUBSCRIBE",
            params: [`${symbol}@kline_${interval}`]
          },
        })
      )
    },
    [dispatch]
  )
  return unSubOrderBook
}

export function useKlineSubData() {
  const klineSubData = useSelector((state: RootState) => state.insights.klineSubData)
  return klineSubData?.data
}