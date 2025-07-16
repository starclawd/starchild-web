import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateAgentInfoListAgents,
  updateAgentInfoList,
  updateSearchedAgentInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateMarketplaceSearchString,
  updateCategorySearchString,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceInfoList,
  updateSearchedAgentMarketplaceInfoList,
  updateIsLoadingMarketplace,
} from './reducer'
import {
  useLazyGetAgentHubListQuery,
  useLazyGetAgentMarketplaceListQuery,
  useToggleSubscribeMutation,
} from 'api/agentHub'
import { AgentInfo, AgentInfoListParams } from './agenthub'
import { convertApiTaskListToAgentInfoList } from 'utils/agentUtils'

export function useAgentInfoList(): [
  AgentInfo[],
  number,
  number,
  number,
  (data: { data: AgentInfo[]; total: number; page: number; pageSize: number }) => void,
] {
  const agentInfoList = useSelector((state: RootState) => state.agentHub.agentInfoList)
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
  return [agentInfoList, agentInfoListTotal, agentInfoListPage, agentInfoListPageSize, setAgentInfoList]
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

export function useMarketplaceSearchString(): [string, (searchString: string) => void] {
  const marketplaceSearchString = useSelector((state: RootState) => state.agentHub.marketplaceSearchString)
  const dispatch = useDispatch()
  const setMarketplaceSearchString = useCallback(
    (searchString: string) => {
      dispatch(updateMarketplaceSearchString(searchString))
    },
    [dispatch],
  )
  return [marketplaceSearchString, setMarketplaceSearchString]
}

export function useCategorySearchString(): [string, (searchString: string) => void] {
  const categorySearchString = useSelector((state: RootState) => state.agentHub.categorySearchString)
  const dispatch = useDispatch()
  const setCategorySearchString = useCallback(
    (searchString: string) => {
      dispatch(updateCategorySearchString(searchString))
    },
    [dispatch],
  )
  return [categorySearchString, setCategorySearchString]
}

export function useSearchedAgentInfoList(): [
  AgentInfo[],
  number,
  number,
  number,
  (data: { data: AgentInfo[]; total: number; page: number; pageSize: number }) => void,
] {
  const searchedAgentInfoList = useSelector((state: RootState) => state.agentHub.searchedAgentInfoList)
  const searchedAgentInfoListTotal = useSelector((state: RootState) => state.agentHub.searchedAgentInfoListTotal)
  const searchedAgentInfoListPage = useSelector((state: RootState) => state.agentHub.searchedAgentInfoListPage)
  const searchedAgentInfoListPageSize = useSelector((state: RootState) => state.agentHub.searchedAgentInfoListPageSize)
  const dispatch = useDispatch()
  const setSearchedAgentInfoList = useCallback(
    (data: { data: AgentInfo[]; total: number; page: number; pageSize: number }) => {
      dispatch(updateSearchedAgentInfoList(data))
    },
    [dispatch],
  )
  return [
    searchedAgentInfoList,
    searchedAgentInfoListTotal,
    searchedAgentInfoListPage,
    searchedAgentInfoListPageSize,
    setSearchedAgentInfoList,
  ]
}

export function useGetAgentInfoList() {
  const [, , , , setAgentInfoList] = useAgentInfoList()
  const [, , , , setSearchedAgentInfoList] = useSearchedAgentInfoList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetAgentInfoList] = useLazyGetAgentHubListQuery()

  return useCallback(
    async (params: AgentInfoListParams) => {
      console.log('useGetAgentInfoList params', params)
      const { page = 1, filterString = '' } = params
      const isFirstPage = page === 1
      const isSearch = filterString.trim() !== ''

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

          // 根据是否有搜索字符串来决定更新哪个列表
          if (isSearch) {
            setSearchedAgentInfoList(finalData)
          } else {
            setAgentInfoList(finalData)
          }
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
    [setAgentInfoList, setSearchedAgentInfoList, setIsLoading, setIsLoadMoreLoading, triggerGetAgentInfoList],
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

export function useSearchedAgentMarketplaceInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const searchedAgentMarketplaceInfoList = useSelector(
    (state: RootState) => state.agentHub.searchedAgentMarketplaceInfoList,
  )
  const dispatch = useDispatch()
  const setSearchedAgentMarketplaceInfoList = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateSearchedAgentMarketplaceInfoList(agents))
    },
    [dispatch],
  )
  return [searchedAgentMarketplaceInfoList, setSearchedAgentMarketplaceInfoList]
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

export function useGetSearchedAgentMarketplaceInfoList() {
  const [, setSearchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
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
        setSearchedAgentMarketplaceInfoList(agentInfoList)
      }
      return data
    } catch (error) {
      return error
    } finally {
      setIsLoadingMarketplace(false)
    }
  }, [setSearchedAgentMarketplaceInfoList, setIsLoadingMarketplace, triggerGetAgentMarketplaceList])
}

export function useIsAgentSubscribed(agentId: string): boolean {
  const subscribedAgentIds = useSelector((state: RootState) => state.agentHub.subscribedAgentIds)
  return subscribedAgentIds.includes(agentId)
}
