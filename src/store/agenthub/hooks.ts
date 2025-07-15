import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateAgentThreadInfoListAgents,
  updateAgentThreadInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateSearchString,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceThreadInfoList,
  updateIsLoadingMarketplace,
} from './reducer'
import {
  useLazyGetAgentHubThreadListQuery,
  useLazyGetAgentMarketplaceThreadListQuery,
  useToggleSubscribeMutation,
} from 'api/agentHub'
import { AgentThreadInfo, AgentThreadInfoListParams } from './agenthub'

export function useAgentThreadInfoListAgents(): [AgentThreadInfo[], (agents: AgentThreadInfo[]) => void] {
  const agentThreadInfoListAgents = useSelector((state: RootState) => state.agentHub.agentThreadInfoList)
  const dispatch = useDispatch()
  const setAgentThreadInfoListAgents = useCallback(
    (agents: AgentThreadInfo[]) => {
      dispatch(updateAgentThreadInfoListAgents(agents))
    },
    [dispatch],
  )
  return [agentThreadInfoListAgents, setAgentThreadInfoListAgents]
}

export function useAgentThreadInfoList(): [
  AgentThreadInfo[],
  number,
  number,
  number,
  (data: { data: AgentThreadInfo[]; total: number; page: number; pageSize: number }) => void,
] {
  const agentThreadInfoListAgents = useSelector((state: RootState) => state.agentHub.agentThreadInfoList)
  const agentThreadInfoListTotal = useSelector((state: RootState) => state.agentHub.agentThreadInfoListTotal)
  const agentThreadInfoListPage = useSelector((state: RootState) => state.agentHub.agentThreadInfoListPage)
  const agentThreadInfoListPageSize = useSelector((state: RootState) => state.agentHub.agentThreadInfoListPageSize)
  const dispatch = useDispatch()
  const setAgentThreadInfoList = useCallback(
    (data: { data: AgentThreadInfo[]; total: number; page: number; pageSize: number }) => {
      dispatch(updateAgentThreadInfoList(data))
    },
    [dispatch],
  )
  return [
    agentThreadInfoListAgents,
    agentThreadInfoListTotal,
    agentThreadInfoListPage,
    agentThreadInfoListPageSize,
    setAgentThreadInfoList,
  ]
}

export function useIsLoading(): [boolean, (isLoading: boolean) => void] {
  const isLoading = useSelector((state: RootState) => state.agentHub.isLoading)
  const dispatch = useDispatch()
  const setIsLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(updateIsLoading(isLoading))
    },
    [dispatch],
  )
  return [isLoading, setIsLoading]
}

export function useIsLoadMoreLoading(): [boolean, (isLoadMoreLoading: boolean) => void] {
  const isLoadMoreLoading = useSelector((state: RootState) => state.agentHub.isLoadMoreLoading)
  const dispatch = useDispatch()
  const setIsLoadMoreLoading = useCallback(
    (isLoadMoreLoading: boolean) => {
      dispatch(updateIsLoadMoreLoading(isLoadMoreLoading))
    },
    [dispatch],
  )
  return [isLoadMoreLoading, setIsLoadMoreLoading]
}

export function useSearchString(): [string, (searchString: string) => void] {
  const searchString = useSelector((state: RootState) => state.agentHub.searchString)
  const dispatch = useDispatch()
  const setSearchString = useCallback(
    (searchString: string) => {
      dispatch(updateSearchString(searchString))
    },
    [dispatch],
  )
  return [searchString, setSearchString]
}

export function useGetAgentThreadInfoList() {
  const [, , , , setAgentThreadInfoList] = useAgentThreadInfoList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetAgentThreadInfoList] = useLazyGetAgentHubThreadListQuery()

  return useCallback(
    async (params: AgentThreadInfoListParams) => {
      console.log('useGetAgentThreadInfoList params', params)
      const { page = 1 } = params
      const isFirstPage = page === 1

      try {
        if (isFirstPage) {
          setIsLoading(true)
        } else {
          setIsLoadMoreLoading(true)
        }

        const data = await triggerGetAgentThreadInfoList(params)
        if (data.isSuccess) {
          setAgentThreadInfoList(data.data as any)
        }
        return data
      } catch (error) {
        return error
      } finally {
        if (isFirstPage) {
          setIsLoading(false)
        } else {
          setIsLoadMoreLoading(false)
        }
      }
    },
    [setAgentThreadInfoList, setIsLoading, setIsLoadMoreLoading, triggerGetAgentThreadInfoList],
  )
}

export function useToggleAgentSubscribe() {
  const dispatch = useDispatch()
  const [toggleSubscribe, { isLoading: isToggleLoading }] = useToggleSubscribeMutation()

  return useCallback(
    async (threadId: string, currentSubscribed: boolean) => {
      try {
        const result = await toggleSubscribe({
          threadId,
          currentSubscribed,
        })

        if (result.data?.success) {
          // Update local state
          dispatch(
            updateAgentSubscriptionStatus({
              threadId,
              subscribed: result.data.subscribed,
            }),
          )
          return result.data
        }
        return null
      } catch (error) {
        console.error('Failed to toggle subscription:', error)
        return null
      }
    },
    [dispatch, toggleSubscribe],
  )
}

export function useAgentMarketplaceThreadInfoList(): [AgentThreadInfo[], (agents: AgentThreadInfo[]) => void] {
  const agentMarketplaceThreadInfoList = useSelector(
    (state: RootState) => state.agentHub.agentMarketplaceThreadInfoList,
  )
  const dispatch = useDispatch()
  const setAgentMarketplaceThreadInfoList = useCallback(
    (agents: AgentThreadInfo[]) => {
      dispatch(updateAgentMarketplaceThreadInfoList(agents))
    },
    [dispatch],
  )
  return [agentMarketplaceThreadInfoList, setAgentMarketplaceThreadInfoList]
}

export function useIsLoadingMarketplace(): [boolean, (isLoading: boolean) => void] {
  const isLoadingMarketplace = useSelector((state: RootState) => state.agentHub.isLoadingMarketplace)
  const dispatch = useDispatch()
  const setIsLoadingMarketplace = useCallback(
    (isLoading: boolean) => {
      dispatch(updateIsLoadingMarketplace(isLoading))
    },
    [dispatch],
  )
  return [isLoadingMarketplace, setIsLoadingMarketplace]
}

export function useGetAgentMarketplaceThreadInfoList() {
  const [, setAgentMarketplaceThreadInfoList] = useAgentMarketplaceThreadInfoList()
  const [, setIsLoadingMarketplace] = useIsLoadingMarketplace()
  const [triggerGetAgentMarketplaceThreadList] = useLazyGetAgentMarketplaceThreadListQuery()

  return useCallback(async () => {
    try {
      setIsLoadingMarketplace(true)
      const data = await triggerGetAgentMarketplaceThreadList()
      if (data.isSuccess) {
        // map data
        const dataList = data.data.data
        // Extract tasks from each category
        const responseTaskInfoList: any[] = []
        Object.values(dataList).forEach((categoryData: any) => {
          if (categoryData.tasks && Array.isArray(categoryData.tasks)) {
            responseTaskInfoList.push(...categoryData.tasks)
          }
        })
        const agentThreadInfoList = responseTaskInfoList.map((responseTaskInfo) => {
          return {
            threadId: responseTaskInfo.task_id,
            title: responseTaskInfo.title,
            description: responseTaskInfo.description,
            creator: responseTaskInfo.user_name,
            subscriberCount: 6666, // TODO: get from backend
            avatar: responseTaskInfo.user_avatar,
            subscribed: false, // TODO: get from backend
            type: responseTaskInfo.category,
            threadImageUrl: undefined, // TODO: get from backend
            stats: undefined, // TODO: get from backend
            tags: JSON.parse(responseTaskInfo.tags),
            recentChats: responseTaskInfo.trigger_history.map((trigger: any) => ({
              error: trigger.error,
              message: trigger.message,
              triggerTime: trigger.trigger_time,
            })),
            tokenInfo: undefined, // TODO: get from backend
            kolInfo: undefined, // TODO: get from backend
          } as AgentThreadInfo
        })
        setAgentMarketplaceThreadInfoList(agentThreadInfoList)
      }
      return data
    } catch (error) {
      return error
    } finally {
      setIsLoadingMarketplace(false)
    }
  }, [setAgentMarketplaceThreadInfoList, setIsLoadingMarketplace, triggerGetAgentMarketplaceThreadList])
}
