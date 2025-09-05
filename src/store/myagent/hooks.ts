/**
 * MyAgent 分页功能使用示例：
 *
 * // 使用分页 hook
 * const {
 *   agents,
 *   paginationState,
 *   loadFirstPage,
 *   loadMoreAgents,
 *   refreshAgents,
 *   hasNextPage,
 *   isLoading,
 *   isLoadingMore
 * } = useMyAgentsOverviewListPaginated()
 *
 * // 组件挂载时加载第一页
 * useEffect(() => {
 *   loadFirstPage()
 * }, [loadFirstPage])
 *
 * // 加载更多数据
 * const handleLoadMore = () => {
 *   if (hasNextPage && !isLoadingMore) {
 *     loadMoreAgents()
 *   }
 * }
 *
 * // 刷新数据
 * const handleRefresh = () => {
 *   refreshAgents()
 * }
 */

import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { BacktestDataType, BACKTEST_STATUS, DEFAULT_BACKTEST_DATA } from 'store/agentdetail/agentdetail.d'
import {
  updateCurrentAgentDetailData,
  updateSubscribedAgents,
  updateAgentsRecommendList,
  updateCurrentEditAgentData,
  updateNewTriggerList,
  resetNewTriggerList,
  NewTriggerDataType,
} from './reducer'
import { ParamFun } from 'types/global'
import { useGetAgentsRecommendListQuery, useLazyGetMyAgentsOverviewListPaginatedQuery } from 'api/myAgent'
import { useLazyGetBacktestDataQuery } from 'api/chat'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { convertAgentDetailListToCardPropsList, convertAgentDetailToCardProps } from './utils'
import { usePagination, type PaginationParams, type PaginatedResponse } from 'hooks/usePagination'
import { WS_TYPE } from 'store/websocket/websocket'
import { webSocketDomain } from 'utils/url'
import { KlineSubscriptionParams, useWebSocketConnection } from 'store/websocket/hooks'
import { createSubscribeMessage, createUnsubscribeMessage } from 'store/websocket/utils'
import eventEmitter, { EventEmitterKey } from 'utils/eventEmitter'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useUserInfo } from 'store/login/hooks'

export function useSubscribedAgents(): [AgentDetailDataType[], ParamFun<AgentDetailDataType[]>] {
  const dispatch = useDispatch()
  const subscribedAgents = useSelector((state: RootState) => state.myagent.subscribedAgents)
  const setSubscribedAgents = useCallback(
    (value: AgentDetailDataType[]) => {
      dispatch(updateSubscribedAgents(value))
    },
    [dispatch],
  )
  return [subscribedAgents, setSubscribedAgents]
}

export function useCurrentAgentDetailData(): [AgentDetailDataType | null, ParamFun<AgentDetailDataType | null>] {
  const dispatch = useDispatch()
  const currentAgentDetailData = useSelector((state: RootState) => state.myagent.currentAgentDetailData)
  const setCurrentAgentDetailData = useCallback(
    (value: AgentDetailDataType | null) => {
      dispatch(updateCurrentAgentDetailData(value))
    },
    [dispatch],
  )
  return [
    currentAgentDetailData && currentAgentDetailData.id ? currentAgentDetailData : null,
    setCurrentAgentDetailData,
  ]
}

// Hook for agents recommend list - returns converted AgentCardProps[]
export function useAgentsRecommendList(): [AgentCardProps[], ParamFun<AgentDetailDataType[]>] {
  const dispatch = useDispatch()
  const agentsRecommendList = useSelector((state: RootState) => state.myagent.agentsRecommendList)
  const setAgentsRecommendList = useCallback(
    (value: AgentDetailDataType[]) => {
      dispatch(updateAgentsRecommendList(value))
    },
    [dispatch],
  )
  // Convert AgentDetailDataType[] to AgentCardProps[] before returning
  const convertedList = convertAgentDetailListToCardPropsList(agentsRecommendList)
  return [convertedList, setAgentsRecommendList]
}

// Hook to fetch and update agents recommend list
export function useFetchAgentsRecommendList() {
  const dispatch = useDispatch()
  const { data, isLoading, error, refetch } = useGetAgentsRecommendListQuery()

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(
        updateAgentsRecommendList(
          data.data.tasks.map((task: any) => ({
            ...task,
            categories: [AGENT_HUB_TYPE.INDICATOR],
          })),
        ),
      )
    }
  }, [data, dispatch])

  return { data, isLoading, error, refetch }
}

export function useGetBacktestData() {
  const [backtestData, setBacktestData] = useState<BacktestDataType>(DEFAULT_BACKTEST_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [triggerGetBacktestData] = useLazyGetBacktestDataQuery()

  const fetchBacktestData = useCallback(
    async (taskId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await triggerGetBacktestData({ taskId })
        if (data.isSuccess) {
          const backtestResult = (data.data as any).backtest_result
          const result = backtestResult.result
          if (result && result.symbol) {
            setBacktestData({
              ...result,
              status: BACKTEST_STATUS.SUCCESS,
            } as BacktestDataType)
          } else {
            if (backtestResult.message) {
              setBacktestData({
                ...DEFAULT_BACKTEST_DATA,
                status: BACKTEST_STATUS.FAILED,
                error_msg: backtestResult.message,
              } as BacktestDataType)
            } else {
              setBacktestData({
                ...DEFAULT_BACKTEST_DATA,
                status: BACKTEST_STATUS.RUNNING,
              } as BacktestDataType)
            }
          }
        } else {
          setError(data.error)
          setBacktestData({
            ...DEFAULT_BACKTEST_DATA,
            status: BACKTEST_STATUS.FAILED,
            error_msg: 'Failed to fetch backtest data',
          } as BacktestDataType)
        }
        setIsLoading(false)
        return data
      } catch (error) {
        setError(error)
        setIsLoading(false)
        setBacktestData({
          ...DEFAULT_BACKTEST_DATA,
          status: BACKTEST_STATUS.FAILED,
          error_msg: 'An error occurred while fetching backtest data',
        } as BacktestDataType)
        return error
      }
    },
    [triggerGetBacktestData],
  )

  return {
    backtestData,
    isLoading,
    error,
    fetchBacktestData,
    setBacktestData,
  }
}

export function useCurrentEditAgentData(): [AgentDetailDataType | null, ParamFun<AgentDetailDataType | null>] {
  const dispatch = useDispatch()
  const currentEditAgentData = useSelector((state: RootState) => state.myagent.currentEditAgentData)
  const setCurrentEditAgentData = useCallback(
    (value: AgentDetailDataType | null) => {
      dispatch(updateCurrentEditAgentData(value))
    },
    [dispatch],
  )
  return [currentEditAgentData, setCurrentEditAgentData]
}

// Hook for paginated my agents overview list with load more functionality
// 使用通用的usePagination hooks，避免Redux状态循环更新
export function useMyAgentsOverviewListPaginated() {
  const [triggerGetMyAgentsPaginated] = useLazyGetMyAgentsOverviewListPaginatedQuery()
  const [{ telegramUserId }] = useUserInfo()

  // 使用通用分页hooks，自动加载第一页
  const {
    data: agents,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalCount,
    error,
    loadFirstPage: loadFirst,
    loadNextPage,
    refresh,
    reset,
    page,
    pageSize,
  } = usePagination<AgentDetailDataType>({
    initialPageSize: 10,
    autoLoadFirstPage: true,
    fetchFunction: async (params: PaginationParams): Promise<PaginatedResponse<AgentDetailDataType>> => {
      const result = await triggerGetMyAgentsPaginated({ params, telegramUserId })
      if (result.data) {
        return {
          data: result.data.data.tasks.map((task: any) => ({
            ...task,
            trigger_history: task.trigger_history === null ? [] : [task.trigger_history], // 此处后端返回的是对象，而前端的interface是数组
          })),
          hasNextPage: result.data.data.has_next,
          totalCount: result.data.data.total,
        }
      }
      throw new Error('Failed to fetch agents')
    },
    onError: (error: any) => {
      console.error('Failed to load agents:', error)
    },
  })

  // 重命名方法以保持API兼容性
  const loadFirstPage = loadFirst
  const loadMoreAgents = loadNextPage
  const refreshAgents = refresh

  // 构造分页状态对象，保持与原有接口的兼容性
  const paginationState = {
    page,
    pageSize,
    hasNextPage,
    isLoading,
    isLoadingMore,
    isRefreshing: false,
    totalCount,
    error,
  }

  return {
    agents,
    paginationState,
    loadFirstPage,
    loadMoreAgents,
    refreshAgents,
    hasNextPage,
    isLoading,
    isLoadingMore,
    reset,
    error,
    totalCount,
  }
}

// Hook for new trigger list management
export function useNewTriggerList(): [NewTriggerDataType[], ParamFun<NewTriggerDataType>] {
  const dispatch = useDispatch()
  const newTriggerList = useSelector((state: RootState) => state.myagent.newTriggerList)
  const addNewTrigger = useCallback(
    (trigger: NewTriggerDataType) => {
      dispatch(updateNewTriggerList(trigger))
    },
    [dispatch],
  )
  return [newTriggerList, addNewTrigger]
}

// Hook for resetting new trigger list
export function useResetNewTrigger() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetNewTriggerList())
  }, [dispatch])
}

// Hook for private websocket subscription for agent triggers
export function usePrivateAgentSubscription() {
  const [{ aiChatKey }] = useUserInfo()
  const { sendMessage, isOpen } = useWebSocketConnection(`${webSocketDomain[WS_TYPE.PRIVATE_WS]}/account@${aiChatKey}`)
  // 订阅 myAgent triggers
  const subscribe = useCallback(() => {
    if (isOpen) {
      // sendMessage(createSubscribeMessage('myAgentTriggers'))
    }
  }, [isOpen])

  // 取消订阅 myAgent triggers
  const unsubscribe = useCallback(() => {
    if (isOpen) {
      // sendMessage(createUnsubscribeMessage('myAgentTriggers'))
    }
  }, [isOpen, sendMessage])
  return {
    isOpen,
    subscribe,
    unsubscribe,
  }
}

export function useListenNewTriggerNotification() {
  // FIXME: 暂时使用mock数据，后续需要替换为真实数据
  useMockNewTriggerData()
  // useEffect(() => {
  //   eventEmitter.on(EventEmitterKey.AGENT_NEW_TRIGGER, (data: any) => {

  //   })
  //   return () => {
  //     eventEmitter.remove(EventEmitterKey.AGENT_NEW_TRIGGER)
  //   }
  // }, [])
}

// Mock数据生成Hook - 每10秒推送一条newTrigger
export function useMockNewTriggerData() {
  const [, addNewTrigger] = useNewTriggerList()

  useEffect(() => {
    // Mock agent IDs - 模拟一些agent ID
    const mockAgentIds = [1001, 1002, 1003, 1004, 1005]

    const generateMockTrigger = () => {
      const randomAgentId = mockAgentIds[Math.floor(Math.random() * mockAgentIds.length)]
      const mockTrigger: NewTriggerDataType = {
        agentId: randomAgentId,
        timestamp: Date.now(),
      }
      addNewTrigger(mockTrigger)
      console.log('Mock new trigger generated:', mockTrigger)
    }

    // 立即生成一个mock数据用于测试
    generateMockTrigger()

    // 每10秒生成一个mock trigger
    const interval = setInterval(generateMockTrigger, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [addNewTrigger])

  return {
    isGeneratingMockData: true,
  }
}
