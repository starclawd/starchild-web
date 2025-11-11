import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePagination, type PaginationParams, type PaginatedResponse } from 'hooks/usePagination'
import { useLazyGetSystemSignalOverviewListPaginatedQuery, useLazyGetSystemSignalAgentsQuery } from 'api/insight'
import { AgentOverviewDetailDataType, NewTriggerDataType } from 'store/myagent/myagent'
import { RootState } from 'store'
import {
  updateSystemSignalOverviewList,
  updateIsLoadingSystemSignalOverview,
  updateSystemSignalList,
  updateNewTriggerSystemSignalHistoryList,
  resetNewTriggerSystemSignalHistoryList,
} from 'store/insights/reducer'
import { ParamFun } from 'types/global'
import { useSubscribedAgents } from 'store/myagent/hooks'
import { useUserInfo } from 'store/login/hooks'
import { useWebSocketConnection } from 'store/websocket/hooks'
import { webSocketDomain } from 'utils/url'
import { WS_TYPE } from 'store/websocket/websocket'
import { createSubscribeMessage, createUnsubscribeMessage } from 'store/websocket/utils'
import eventEmitter, { EventEmitterKey } from 'utils/eventEmitter'

// Hook for system signal overview list management
export function useSystemSignalOverviewList(): [
  AgentOverviewDetailDataType[],
  ParamFun<AgentOverviewDetailDataType[]>,
] {
  const dispatch = useDispatch()
  const systemSignalOverviewList = useSelector((state: RootState) => state.insights.systemSignalOverviewList)
  const setSystemSignalOverviewList = useCallback(
    (value: AgentOverviewDetailDataType[]) => {
      dispatch(updateSystemSignalOverviewList(value))
    },
    [dispatch],
  )
  return [systemSignalOverviewList, setSystemSignalOverviewList]
}

// Hook for system signal overview loading state
export function useSystemSignalOverviewLoadingState(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingSystemSignalOverview = useSelector((state: RootState) => state.insights.isLoadingSystemSignalOverview)
  const setIsLoadingSystemSignalOverview = useCallback(
    (value: boolean) => {
      dispatch(updateIsLoadingSystemSignalOverview(value))
    },
    [dispatch],
  )
  return [isLoadingSystemSignalOverview, setIsLoadingSystemSignalOverview]
}

// Hook for system signal agents list management
export function useSystemSignalAgents(): [AgentOverviewDetailDataType[], ParamFun<AgentOverviewDetailDataType[]>] {
  const dispatch = useDispatch()
  const systemSignalList = useSelector((state: RootState) => state.insights.systemSignalList)
  const setSystemSignalList = useCallback(
    (value: AgentOverviewDetailDataType[]) => {
      dispatch(updateSystemSignalList(value))
    },
    [dispatch],
  )
  return [systemSignalList, setSystemSignalList]
}

// Hook for paginated system signal overview list with load more functionality
export function useSystemSignalOverviewListPaginated() {
  const [triggerGetSystemSignalPaginated] = useLazyGetSystemSignalOverviewListPaginatedQuery()

  // 使用通用分页hooks，自动加载第一页
  const {
    data: signals,
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
      const result = await triggerGetSystemSignalPaginated({ params })
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
      throw new Error('Failed to fetch system signals')
    },
    onError: (error: any) => {
      console.error('Failed to load system signals:', error)
    },
  })

  // 重命名方法以保持API兼容性
  const loadFirstPage = loadFirst
  const loadMoreSignals = loadNextPage
  const refreshSignals = refresh

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
    signals,
    paginationState,
    loadFirstPage,
    loadMoreSignals,
    refreshSignals,
    hasNextPage,
    isLoading,
    isLoadingMore,
    reset,
    error,
    totalCount,
  }
}

/**
 * 获取系统信号Agent列表
 */
export function useGetSystemSignalAgents() {
  const dispatch = useDispatch()
  const [triggerGetSystemSignalAgents] = useLazyGetSystemSignalAgentsQuery()

  return useCallback(async () => {
    try {
      const response = await triggerGetSystemSignalAgents()

      if (response.isSuccess) {
        const agents = response.data.data.tasks
        dispatch(updateSystemSignalList(agents))
      }

      return response
    } catch (error) {
      console.error('Failed to get system signal agents:', error)
      return error
    }
  }, [dispatch, triggerGetSystemSignalAgents])
}

// Hook for new trigger list management for system signal history list
export function useNewTriggerSystemSignalsHistoryList(): [NewTriggerDataType[], ParamFun<NewTriggerDataType>] {
  const dispatch = useDispatch()
  const newTriggerSystemSignalHistoryList = useSelector(
    (state: RootState) => state.insights.newTriggerSystemSignalHistoryList,
  )
  const addNewTrigger = useCallback(
    (trigger: NewTriggerDataType) => {
      dispatch(updateNewTriggerSystemSignalHistoryList(trigger))
    },
    [dispatch],
  )
  return [newTriggerSystemSignalHistoryList, addNewTrigger]
}

// Hook for resetting new trigger list for system signal history list
export function useResetNewTriggerSystemSignalsHistoryList() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetNewTriggerSystemSignalHistoryList())
  }, [dispatch])
}

// Hook for private websocket subscription for system signal triggers
export function usePrivateSystemSignalSubscription() {
  const [{ aiChatKey }] = useUserInfo()
  const { sendMessage, isOpen } = useWebSocketConnection(`${webSocketDomain[WS_TYPE.PRIVATE_WS]}/account@${aiChatKey}`)
  // 订阅 agent-notification
  const subscribe = useCallback(() => {
    if (isOpen) {
      sendMessage(createSubscribeMessage('signal-notification'))
    }
  }, [isOpen, sendMessage])

  // 取消订阅 agent-notification
  const unsubscribe = useCallback(() => {
    if (isOpen) {
      sendMessage(createUnsubscribeMessage('signal-notification'))
    }
  }, [isOpen, sendMessage])
  return {
    isOpen,
    subscribe,
    unsubscribe,
  }
}

export function useListenNewTriggerSystemSignalNotification() {
  const [, addNewTrigger] = useNewTriggerSystemSignalsHistoryList()
  useEffect(() => {
    eventEmitter.on(EventEmitterKey.SIGNAL_NEW_TRIGGER, (data: any) => {
      const triggerData = data as NewTriggerDataType
      if (triggerData && triggerData.alertOptions.id) {
        addNewTrigger(triggerData)
      }
    })
    return () => {
      eventEmitter.remove(EventEmitterKey.SIGNAL_NEW_TRIGGER)
    }
  }, [addNewTrigger])
}
