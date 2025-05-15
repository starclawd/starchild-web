import dayjs from "dayjs"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { ALERT_TYPE, InsightsDataType, InstitutionalTradeOptions, KlineSubDataType, MOVEMENT_TYPE, PriceAlertOptions, PriceChange24hOptions, SIDE, TokenListDataType } from "./insights.d"
import { useLazyGetAllInsightsQuery, useLazyMarkAsReadQuery } from "api/insights"
import { resetMarkedReadList, updateAllInsightsData, updateAllInsightsDataWithReplace, updateCurrentShowId, updateIsLoadingInsights, updateKlineSubData, updateMarkedReadList, updateMarkerScrollPoint } from "./reducer"
import { PAGE_SIZE } from "constants/index"
import { useLazyGetKlineDataQuery } from "api/binance"
import { KLINE_SUB_ID, KLINE_UNSUB_ID, WS_TYPE } from "store/websocket/websocket"
import { KlineSubscriptionParams, useWebSocketConnection } from "store/websocket/hooks"
import { createSubscribeMessage, createUnsubscribeMessage, formatKlineChannel } from "store/websocket/utils"
import { webSocketDomain } from "utils/url"
import { useTimezone } from "store/timezonecache/hooks"
import { t } from "@lingui/core/macro"

export function useTokenList(): TokenListDataType[] {
  const [insightsList] = useInsightsList()
  return useMemo(() => {
    // 从 insightsList 中提取所有不重复的 symbol
    const uniqueSymbols = new Set<string>()
    insightsList.forEach(item => {
      if (item.marketId) {
        uniqueSymbols.add(item.marketId.toUpperCase())
      }
    })
    
    // 转换为所需的格式，并计算每个 symbol 出现的次数作为 size
    const symbolCountMap = new Map<string, number>()
    insightsList.forEach(item => {
      if (item.marketId && !item.isRead) {
        const symbol = item.marketId.toUpperCase()
        symbolCountMap.set(symbol, (symbolCountMap.get(symbol) || 0) + 1)
      }
    })
    
    return Array.from(uniqueSymbols).map(symbol => ({
      symbol,
      des: '',
      size: symbolCountMap.get(symbol) || 0
    }))
  }, [insightsList])
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
      const data = await triggerGetAllInsights({ pageIndex, pageSize: 100 })
      const list = (data.data as any).data || []
      dispatch(updateAllInsightsDataWithReplace(list))
      dispatch(resetMarkedReadList()) // 重置已标记为已读的列表
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetAllInsights, dispatch])
}

export function useInsightsList(): [InsightsDataType[], (data: InsightsDataType) => void] {
  const insightsList = useSelector((state: RootState) => state.insights.insightsList)
  const dispatch = useDispatch()
  const setAllInsightsData = useCallback((data: InsightsDataType) => {
    dispatch(updateAllInsightsData(data))
  }, [dispatch])
  return [insightsList, setAllInsightsData]
}

export function useGetHistoryKlineData() {
  const [triggerGetKlineData] = useLazyGetKlineDataQuery()
  
  const getHistoryData = useCallback(async ({
    symbol,
    interval,
    limit = 320,
    startTime,
    endTime,
    timeZone,
  }: {
    symbol: string
    interval: string
    limit?: number
    startTime?: number
    endTime?: number
    timeZone?: string
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
    const { symbol, interval, timeZone } = params;
    // 格式化频道名，可能需要包含时区信息
    const channel = formatKlineChannel(symbol, interval, timeZone);
    if (isOpen) {
      sendMessage(createSubscribeMessage(channel, KLINE_SUB_ID));
    }
  }, [isOpen, sendMessage]);
  
  // 取消订阅 K线数据
  const unsubscribe = useCallback((params: KlineSubscriptionParams) => {
    const { symbol, interval, timeZone } = params;
    // 确保取消订阅和订阅使用相同的频道名
    const channel = formatKlineChannel(symbol, interval, timeZone);
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


export function useMarkAsRead() {
  const [triggerMarkAsRead] = useLazyMarkAsReadQuery()
  const dispatch = useDispatch()
  
  return useCallback(async ({
    isList,
    id
  }: {
    isList: number[]
    id?: string
  }) => {
    try {
      const data = await triggerMarkAsRead({ isList })
      // 如果提供了id，将其添加到markedReadList中
      if (id) {
        dispatch(updateMarkedReadList(id))
      }
      return data
    } catch (error) {
      return error
    }
  }, [triggerMarkAsRead, dispatch])
}

// 新增：获取和使用markedReadList状态
export function useMarkedReadList(): [string[], () => void] {
  const markedReadList = useSelector((state: RootState) => state.insights.markedReadList)
  const dispatch = useDispatch()
  
  const resetList = useCallback(() => {
    dispatch(resetMarkedReadList())
  }, [dispatch])
  
  return [markedReadList, resetList]
}

// 修改：检测组件是否在视口中的钩子，接受任何HTML元素
export function useIsInViewport<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isIntersecting;
}

// 新增：自动标记为已读的钩子
export function useAutoMarkAsRead(id: string, isRead: boolean, isVisible: boolean) {
  const markAsRead = useMarkAsRead()
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (!isRead && isVisible && id) {
      // 当组件可见且未读时，标记为已读
      markAsRead({ isList: [parseInt(id)], id })
    }
  }, [isRead, isVisible, id, markAsRead, dispatch])
}

export function useIsLoadingInsights(): [boolean, (isLoading: boolean) => void] {
  const isLoadingInsights = useSelector((state: RootState) => state.insights.isLoadingInsights)
  const dispatch = useDispatch()

  const setIsLoadingInsights = useCallback((isLoading: boolean) => {
    dispatch(updateIsLoadingInsights(isLoading))
  }, [dispatch])

  return [isLoadingInsights, setIsLoadingInsights]
}

export function useGetFormatDisplayTime() {
  const [timezone] = useTimezone()
  const formatTimeDisplay = useCallback((createdAt: number) => {
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
  }, [timezone])
  return formatTimeDisplay
}

export function getIsInsightLong(data: InsightsDataType) {
  const { alertType, alertOptions } = data;
  const { side } = alertOptions as InstitutionalTradeOptions;
  const { movementType } = alertOptions as PriceAlertOptions;
  const { priceChange24h } = alertOptions as PriceChange24hOptions;
  if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return side === SIDE.BUY
  } else if (alertType === ALERT_TYPE.PRICE_ALERT) {
    return movementType === MOVEMENT_TYPE.PUMP || movementType === '+'
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return priceChange24h > 0
  }
  return false
}

export function getInsightSide(data: InsightsDataType) {
  const isLong = getIsInsightLong(data)
  return isLong ? t`Pump` : t`Dump`
}


