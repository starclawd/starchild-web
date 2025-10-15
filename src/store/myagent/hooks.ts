import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { t } from '@lingui/core/macro'
import { RootState } from 'store'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { AgentOverviewDetailDataType, NewTriggerDataType } from 'store/myagent/myagent'
import { BacktestDataType, BACKTEST_STATUS, DEFAULT_BACKTEST_DATA } from 'store/agentdetail/agentdetail.d'
import {
  updateSubscribedAgents,
  updateAgentsRecommendList,
  updateCurrentEditAgentData,
  updateNewTriggerList,
  resetNewTriggerList,
} from './reducer'
import { ParamFun } from 'types/global'
import {
  useGetAgentsRecommendListQuery,
  useLazyGetMyAgentsOverviewListPaginatedQuery,
  useDeleteMyAgentMutation,
  useEditMyAgentMutation,
  useLazyGetTriggerHistoryQuery,
} from 'api/myAgent'
import { useLazyGetBacktestDataQuery, useLazyGetAgentDetailQuery } from 'api/chat'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { convertAgentDetailListToCardPropsList, convertAgentDetailToCardProps } from './utils'
import { usePagination, type PaginationParams, type PaginatedResponse } from 'hooks/usePagination'
import { WS_TYPE } from 'store/websocket/websocket'
import { webSocketDomain } from 'utils/url'
import { useWebSocketConnection } from 'store/websocket/hooks'
import { createSubscribeMessage, createUnsubscribeMessage } from 'store/websocket/utils'
import eventEmitter, { EventEmitterKey } from 'utils/eventEmitter'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useUserInfo } from 'store/login/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'

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

// Hook for fetching current agent detail data
export function useFetchCurrentAgentDetailData() {
  const { agentId } = useParsedQueryString()
  const [triggerGetAgentDetail] = useLazyGetAgentDetailQuery()

  const fetchCurrentAgentDetailData = useCallback(async () => {
    if (!agentId) {
      console.warn('No current agent data or task_id found')
      return { success: false, error: t`No current agent data or task_id found` }
    }

    try {
      const result = await triggerGetAgentDetail({ taskId: agentId })
      if (result.data) {
        const agentData = result.data as AgentDetailDataType
        // 只有当返回的数据id与当前agent的id相同时才更新
        if (agentData.id === Number(agentId)) {
          return { success: true, data: agentData }
        } else {
          console.warn('Agent ID mismatch, skipping update:', {
            currentId: agentId,
            fetchedId: agentData.id,
          })
          return { success: false, error: t`Agent ID mismatch` }
        }
      } else {
        console.error('Failed to fetch current agent detail:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error fetching current agent detail:', error)
      return { success: false, error }
    }
  }, [agentId, triggerGetAgentDetail])

  return {
    fetchCurrentAgentDetailData,
  }
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
  } = usePagination<AgentOverviewDetailDataType>({
    initialPageSize: 10,
    autoLoadFirstPage: true,
    fetchFunction: async (params: PaginationParams): Promise<PaginatedResponse<AgentOverviewDetailDataType>> => {
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
  // 订阅 agent-notification
  const subscribe = useCallback(() => {
    if (isOpen) {
      sendMessage(createSubscribeMessage('agent-notification'))
    }
  }, [isOpen, sendMessage])

  // 取消订阅 agent-notification
  const unsubscribe = useCallback(() => {
    if (isOpen) {
      sendMessage(createUnsubscribeMessage('agent-notification'))
    }
  }, [isOpen, sendMessage])
  return {
    isOpen,
    subscribe,
    unsubscribe,
  }
}

export function useListenNewTriggerNotification() {
  const [, addNewTrigger] = useNewTriggerList()
  useEffect(() => {
    eventEmitter.on(EventEmitterKey.AGENT_NEW_TRIGGER, (data: any) => {
      const triggerData = data as NewTriggerDataType
      if (triggerData && triggerData.alertOptions.id) {
        addNewTrigger(triggerData)
      }
    })
    return () => {
      eventEmitter.remove(EventEmitterKey.AGENT_NEW_TRIGGER)
    }
  }, [addNewTrigger])
}

// Hook for deleting my agent
export function useDeleteMyAgent() {
  const [deleteMyAgentMutation, { isLoading, error }] = useDeleteMyAgentMutation()
  const [{ telegramUserId }] = useUserInfo()

  const deleteMyAgent = useCallback(
    async (agentId: number) => {
      try {
        await deleteMyAgentMutation({ agentId, telegramUserId }).unwrap()
        return { success: true }
      } catch (error) {
        console.error('Delete agent failed:', error)
        return { success: false, error }
      }
    },
    [deleteMyAgentMutation, telegramUserId],
  )

  return {
    deleteMyAgent,
    isLoading,
    error,
  }
}

// Hook for editing my agent
export function useEditMyAgent() {
  const [editMyAgentMutation, { isLoading, error }] = useEditMyAgentMutation()
  const [{ telegramUserId }] = useUserInfo()

  const editMyAgent = useCallback(
    async (taskId: string, description: string) => {
      try {
        await editMyAgentMutation({ taskId, telegramUserId, description }).unwrap()
        return { success: true }
      } catch (error) {
        console.error('Edit agent failed:', error)
        return { success: false, error }
      }
    },
    [editMyAgentMutation, telegramUserId],
  )

  return {
    editMyAgent,
    isLoading,
    error,
  }
}

// Hook for paginated trigger history with load more functionality
export function useGetTriggerHistory(taskId: string) {
  const [triggerGetTriggerHistory] = useLazyGetTriggerHistoryQuery()

  // 使用通用分页hooks，只有在taskId存在时才自动加载第一页
  const {
    data: triggerHistory,
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
  } = usePagination<any>({
    initialPageSize: 10,
    autoLoadFirstPage: !!taskId, // 只有在taskId存在时才自动加载
    fetchFunction: async (params: PaginationParams): Promise<PaginatedResponse<any>> => {
      if (!taskId) {
        // 如果没有taskId，返回空数据
        return {
          data: [],
          hasNextPage: false,
          totalCount: 0,
        }
      }
      const result = await triggerGetTriggerHistory({ taskId, pageSize: params.pageSize, page: params.page })
      if (result.data?.status === 'success') {
        const data = result.data.data
        return {
          data: data.trigger_history || [],
          hasNextPage: data.total_pages > data.page,
          totalCount: data.total_count || 0,
        }
      }
      throw new Error('Failed to fetch trigger history')
    },
    onError: (error: any) => {
      console.error('Failed to load trigger history:', error)
    },
  })

  // 重命名方法以保持API兼容性
  const loadFirstPage = loadFirst
  const loadMoreTriggerHistory = loadNextPage
  const refreshTriggerHistory = refresh

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
    triggerHistory,
    paginationState,
    loadFirstPage,
    loadMoreTriggerHistory,
    refreshTriggerHistory,
    hasNextPage,
    isLoading,
    isLoadingMore,
    reset,
    error,
    totalCount,
  }
}
