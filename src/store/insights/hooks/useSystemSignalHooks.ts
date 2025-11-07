import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePagination, type PaginationParams, type PaginatedResponse } from 'hooks/usePagination'
import { useLazyGetSystemSignalOverviewListPaginatedQuery } from 'api/insight'
import { AgentOverviewDetailDataType } from 'store/myagent/myagent'
import { RootState } from 'store'
import { updateSystemSignalList, updateIsLoadingSystemSignals } from 'store/insights/reducer'
import { ParamFun } from 'types/global'

// Hook for system signal list management
export function useSystemSignalList(): [AgentOverviewDetailDataType[], ParamFun<AgentOverviewDetailDataType[]>] {
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

// Hook for system signal loading state
export function useSystemSignalLoadingState(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingSystemSignals = useSelector((state: RootState) => state.insights.isLoadingSystemSignals)
  const setIsLoadingSystemSignals = useCallback(
    (value: boolean) => {
      dispatch(updateIsLoadingSystemSignals(value))
    },
    [dispatch],
  )
  return [isLoadingSystemSignals, setIsLoadingSystemSignals]
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
