import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateAgentInfoListAgents,
  updateAgentInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateSearchString,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceInfoList,
  updateIsLoadingMarketplace,
} from './reducer'
import {
  useLazyGetAgentHubListQuery,
  useLazyGetAgentMarketplaceListQuery,
  useToggleSubscribeMutation,
} from 'api/agentHub'
import { AgentInfo, AgentInfoListParams } from './agenthub'
import { convertApiTaskListToAgentInfoList } from 'utils/agentUtils'

export function useAgentInfoListAgents(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const agentInfoListAgents = useSelector((state: RootState) => state.agentHub.agentInfoList)
  const dispatch = useDispatch()
  const setAgentInfoListAgents = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateAgentInfoListAgents(agents))
    },
    [dispatch],
  )
  return [agentInfoListAgents, setAgentInfoListAgents]
}

export function useAgentInfoList(): [
  AgentInfo[],
  number,
  number,
  number,
  (data: { data: AgentInfo[]; total: number; page: number; pageSize: number }) => void,
] {
  const agentInfoListAgents = useSelector((state: RootState) => state.agentHub.agentInfoList)
  const agentInfoListTotal = useSelector((state: RootState) => state.agentHub.agentInfoListTotal)
  const agentInfoListPage = useSelector((state: RootState) => state.agentHub.agentInfoListPage)
  const agentInfoListPageSize = useSelector((state: RootState) => state.agentHub.agentInfoListPageSize)
  const dispatch = useDispatch()
  const setAgentInfoList = useCallback(
    (data: { data: AgentInfo[]; total: number; page: number; pageSize: number }) => {
      dispatch(updateAgentInfoList(data))
    },
    [dispatch],
  )
  return [agentInfoListAgents, agentInfoListTotal, agentInfoListPage, agentInfoListPageSize, setAgentInfoList]
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

export function useGetAgentInfoList() {
  const [, , , , setAgentInfoList] = useAgentInfoList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetAgentInfoList] = useLazyGetAgentHubListQuery()

  return useCallback(
    async (params: AgentInfoListParams) => {
      console.log('useGetAgentInfoList params', params)
      const { page = 1 } = params
      const isFirstPage = page === 1

      try {
        if (isFirstPage) {
          setIsLoading(true)
        } else {
          setIsLoadMoreLoading(true)
        }

        const response = await triggerGetAgentInfoList(params)
        if (response.isSuccess) {
          const data = response.data.data
          const pagination = data.pagination
          const convertedTasks = convertApiTaskListToAgentInfoList(data.tasks)
          const finalData = {
            data: convertedTasks,
            total: pagination.total_count,
            page: pagination.page,
            pageSize: pagination.page_size,
          }
          setAgentInfoList(finalData)
        }
        return response
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
    [setAgentInfoList, setIsLoading, setIsLoadMoreLoading, triggerGetAgentInfoList],
  )
}

export function useToggleAgentSubscribe() {
  const dispatch = useDispatch()
  const [toggleSubscribe, { isLoading: isToggleLoading }] = useToggleSubscribeMutation()

  return useCallback(
    async (agentId: string, currentSubscribed: boolean) => {
      try {
        const result = await toggleSubscribe({
          agentId,
          currentSubscribed,
        })

        if (result.data?.success) {
          // Update local state
          dispatch(
            updateAgentSubscriptionStatus({
              agentId,
              subscribed: !currentSubscribed,
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

export function useAgentMarketplaceInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const agentMarketplaceInfoList = useSelector((state: RootState) => state.agentHub.agentMarketplaceInfoList)
  const dispatch = useDispatch()
  const setAgentMarketplaceInfoList = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateAgentMarketplaceInfoList(agents))
    },
    [dispatch],
  )
  return [agentMarketplaceInfoList, setAgentMarketplaceInfoList]
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

export function useGetAgentMarketplaceInfoList() {
  const [, setAgentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [, setIsLoadingMarketplace] = useIsLoadingMarketplace()
  const [triggerGetAgentMarketplaceList] = useLazyGetAgentMarketplaceListQuery()

  return useCallback(async () => {
    try {
      setIsLoadingMarketplace(true)
      const data = await triggerGetAgentMarketplaceList()
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
        const agentInfoList = convertApiTaskListToAgentInfoList(responseTaskInfoList)
        setAgentMarketplaceInfoList(agentInfoList)
      }
      return data
    } catch (error) {
      return error
    } finally {
      setIsLoadingMarketplace(false)
    }
  }, [setAgentMarketplaceInfoList, setIsLoadingMarketplace, triggerGetAgentMarketplaceList])
}

export function useIsAgentSubscribed(agentId: string): boolean {
  const subscribedAgentIds = useSelector((state: RootState) => state.agentHub.subscribedAgentIds)
  return subscribedAgentIds.includes(agentId)
}
