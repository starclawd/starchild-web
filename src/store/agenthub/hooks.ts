import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateAgentInfoList,
  updateSearchedAgentInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateMarketplaceSearchString,
  updateCategorySearchString,
  updateCategorySearchTag,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceInfoList,
  updateAgentMarketplaceListViewInfoList,
  updateSearchedAgentMarketplaceInfoList,
  updateSearchedAgentMarketplaceListViewInfoList,
  updateIsLoadingMarketplace,
  updateSubscribedAgentIds,
  updateCurrentKolInfo,
  updateCurrentTokenInfo,
  updateListViewSortingColumn,
  updateListViewSortingOrder,
} from './reducer'
import {
  useLazyGetAgentHubListQuery,
  useLazyGetAgentMarketplaceListQuery,
  useLazySubscribeAgentQuery,
  useLazyUnsubscribeAgentQuery,
  useLazyGetSubscribedAgentsQuery,
  useLazySearchAgentsQuery,
  useLazyGetKolsListQuery,
  useLazyGetTokensListQuery,
} from 'api/agentHub'
import { AgentInfo, AgentInfoListParams, KolInfo, TokenInfo } from './agenthub'
import {
  convertApiTaskListToAgentInfoList,
  convertApiDataListToAgentMarketplaceInfoList,
  convertApiKolListToAgentInfoList,
  convertApiTokenListToAgentInfoList,
  filterAgentsByForCardView,
  filterAgentsForListView,
} from 'store/agenthub/utils'
import { useUserInfo } from '../login/hooks'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useSubscribedAgents } from 'store/myagent/hooks'
import { useAgentHubViewMode } from 'store/agenthubcache/hooks'
import { AgentHubViewMode } from 'store/agenthubcache/agenthubcache'
import { ListViewSortingColumn, ListViewSortingOrder } from './agenthub'

export function useAgentInfoList(): [
  AgentInfo[],
  number,
  number,
  number,
  string[],
  (data: { data: AgentInfo[]; total: number; page: number; pageSize: number; categoryAgentTags: string[] }) => void,
] {
  const agentInfoList = useSelector((state: RootState) => state.agentHub.agentInfoList)
  const agentInfoListTotal = useSelector((state: RootState) => state.agentHub.agentInfoListTotal)
  const agentInfoListPage = useSelector((state: RootState) => state.agentHub.agentInfoListPage)
  const agentInfoListPageSize = useSelector((state: RootState) => state.agentHub.agentInfoListPageSize)
  const categoryAgentTags = useSelector((state: RootState) => state.agentHub.categoryAgentTags)
  const dispatch = useDispatch()
  const setAgentInfoList = useCallback(
    (data: { data: AgentInfo[]; total: number; page: number; pageSize: number; categoryAgentTags: string[] }) => {
      dispatch(updateAgentInfoList(data))
    },
    [dispatch],
  )
  return [
    agentInfoList,
    agentInfoListTotal,
    agentInfoListPage,
    agentInfoListPageSize,
    categoryAgentTags,
    setAgentInfoList,
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

export function useCategorySearchTag(): [string, (searchTag: string) => void] {
  const categorySearchTag = useSelector((state: RootState) => state.agentHub.categorySearchTag)
  const dispatch = useDispatch()
  const setCategorySearchTag = useCallback(
    (searchTag: string) => {
      dispatch(updateCategorySearchTag(searchTag))
    },
    [dispatch],
  )
  return [categorySearchTag, setCategorySearchTag]
}

export function useSearchedAgentInfoList(): [AgentInfo[], (data: AgentInfo[]) => void] {
  const searchedAgentInfoList = useSelector((state: RootState) => state.agentHub.searchedAgentInfoList)
  const dispatch = useDispatch()
  const setSearchedAgentInfoList = useCallback(
    (data: AgentInfo[]) => {
      dispatch(updateSearchedAgentInfoList(data))
    },
    [dispatch],
  )
  return [searchedAgentInfoList, setSearchedAgentInfoList]
}

export function useGetAgentInfoList() {
  const [, , , , , setAgentInfoList] = useAgentInfoList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetAgentInfoList] = useLazyGetAgentHubListQuery()
  const [triggerGetKolsList] = useLazyGetKolsListQuery()
  const [triggerGetTokensList] = useLazyGetTokensListQuery()

  return useCallback(
    async (params: AgentInfoListParams) => {
      const { page = 1, filterType } = params
      const isFirstPage = page === 1

      try {
        if (isFirstPage) {
          setIsLoading(true)
        } else {
          setIsLoadMoreLoading(true)
        }

        let response
        let convertedData: any[] = []
        let categoryAgentTags: string[] = []
        let pagination: any = {}

        // 根据 filterType和tag决定调用哪个 API 和使用哪个转换函数
        if (filterType === AGENT_HUB_TYPE.KOL_RADAR && !params.tag) {
          // kol radar且没有tag时，调用kols list api
          response = await triggerGetKolsList(params)
          if (response.isSuccess) {
            const data = response.data
            pagination = data.data.pagination
            convertedData = convertApiKolListToAgentInfoList(data.data.kols)
            categoryAgentTags = []
          }
        } else if (filterType === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE && !params.tag) {
          // token deep dive且没有tag时，调用tokens list api
          response = await triggerGetTokensList(params)
          if (response.isSuccess) {
            const data = response.data
            pagination = data.pagination || {}
            convertedData = convertApiTokenListToAgentInfoList(data.data)
            categoryAgentTags = []
          }
        } else {
          // 默认情况使用原有的 API
          response = await triggerGetAgentInfoList(params)
          if (response.isSuccess) {
            const data = response.data.data
            pagination = data.pagination
            convertedData = convertApiTaskListToAgentInfoList(
              data.tasks.map((task: any) => ({
                ...task,
                categories: [filterType],
              })),
            )
            categoryAgentTags = response.data.tags || []
          }
        }

        if (response.isSuccess) {
          const finalData = {
            data: convertedData,
            categoryAgentTags,
            total: pagination?.total_count || 0,
            page: pagination?.page || 1,
            pageSize: pagination?.page_size || 10,
          }
          setAgentInfoList(finalData)
        }

        return response
      } catch (error) {
        console.log(error)
        return error
      } finally {
        if (isFirstPage) {
          setIsLoading(false)
        } else {
          setIsLoadMoreLoading(false)
        }
      }
    },
    [
      setAgentInfoList,
      setIsLoading,
      setIsLoadMoreLoading,
      triggerGetAgentInfoList,
      triggerGetKolsList,
      triggerGetTokensList,
    ],
  )
}

export function useGetSearchedCategoryAgentInfoList() {
  const [, setSearchedAgentInfoList] = useSearchedAgentInfoList()
  const [, setIsLoading] = useIsLoading()
  const [triggerSearchAgents] = useLazySearchAgentsQuery()

  return useCallback(
    async (params: { searchStr: string; category: string; tag?: string }) => {
      const { searchStr, category, tag } = params

      try {
        setIsLoading(true)
        // clear data before search
        setSearchedAgentInfoList([])
        const response = await triggerSearchAgents({ searchStr, category, tag })
        let convertedData: any[] = []
        if (response.isSuccess) {
          const data = response.data.data
          if (category === AGENT_HUB_TYPE.KOL_RADAR) {
            convertedData = convertApiKolListToAgentInfoList(data[category].kols)
          } else if (category === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE) {
            convertedData = convertApiTokenListToAgentInfoList(data[category].tokens)
          } else {
            convertedData = convertApiTaskListToAgentInfoList(
              data[category].tasks.map((task: any) => ({
                ...task,
                categories: [category],
              })),
            )
          }

          setSearchedAgentInfoList(convertedData)
        }
        return response
      } catch (error) {
        console.error('Failed to search agents:', error)
        return error
      } finally {
        setIsLoading(false)
      }
    },
    [setSearchedAgentInfoList, setIsLoading, triggerSearchAgents],
  )
}

export function useSubscribeAgent() {
  const dispatch = useDispatch()
  const [subscribeAgent, { isLoading: isSubscribeLoading }] = useLazySubscribeAgentQuery()
  const [{ telegramUserId }] = useUserInfo()

  return useCallback(
    async (agentId: number) => {
      try {
        const result = await subscribeAgent({
          agentId,
          userId: telegramUserId,
        })
        if (result.data?.status === 'success') {
          // Update local state
          dispatch(
            updateAgentSubscriptionStatus({
              agentId,
              subscribed: true,
            }),
          )
          return result.data
        }
        return null
      } catch (error) {
        console.error('Failed to subscribe agent:', error)
        return null
      }
    },
    [dispatch, subscribeAgent, telegramUserId],
  )
}

export function useUnsubscribeAgent() {
  const dispatch = useDispatch()
  const [unsubscribeAgent, { isLoading: isUnsubscribeLoading }] = useLazyUnsubscribeAgentQuery()
  const [{ telegramUserId }] = useUserInfo()

  return useCallback(
    async (agentId: number) => {
      try {
        const result = await unsubscribeAgent({
          agentId,
          userId: telegramUserId,
        })
        if (result.data?.status === 'success') {
          // Update local state
          dispatch(
            updateAgentSubscriptionStatus({
              agentId,
              subscribed: false,
            }),
          )
          return result.data
        }
        return null
      } catch (error) {
        console.error('Failed to unsubscribe agent:', error)
        return null
      }
    },
    [dispatch, unsubscribeAgent, telegramUserId],
  )
}

export function useAgentMarketplaceInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const [viewMode] = useAgentHubViewMode()
  const agentMarketplaceInfoList = useSelector((state: RootState) => state.agentHub.agentMarketplaceInfoList)
  const agentMarketplaceListViewInfoList = useSelector(
    (state: RootState) => state.agentHub.agentMarketplaceListViewInfoList,
  )
  const dispatch = useDispatch()

  const setAgentMarketplaceInfoList = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateAgentMarketplaceInfoList(agents))
    },
    [dispatch],
  )

  // 根据 viewMode 返回对应的数据
  const currentList = viewMode === AgentHubViewMode.LIST ? agentMarketplaceListViewInfoList : agentMarketplaceInfoList

  return [currentList, setAgentMarketplaceInfoList]
}

export function useSearchedAgentMarketplaceInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const [viewMode] = useAgentHubViewMode()
  const searchedAgentMarketplaceInfoList = useSelector(
    (state: RootState) => state.agentHub.searchedAgentMarketplaceInfoList,
  )
  const searchedAgentMarketplaceListViewInfoList = useSelector(
    (state: RootState) => state.agentHub.searchedAgentMarketplaceListViewInfoList,
  )
  const dispatch = useDispatch()

  const setSearchedAgentMarketplaceInfoList = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateSearchedAgentMarketplaceInfoList(agents))
    },
    [dispatch],
  )

  // 根据 viewMode 返回对应的搜索数据
  const currentSearchedList =
    viewMode === AgentHubViewMode.LIST ? searchedAgentMarketplaceListViewInfoList : searchedAgentMarketplaceInfoList

  return [currentSearchedList, setSearchedAgentMarketplaceInfoList]
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
  const dispatch = useDispatch()

  return useCallback(async () => {
    try {
      setIsLoadingMarketplace(true)
      const data = await triggerGetAgentMarketplaceList()
      if (data.isSuccess) {
        const dataList = data.data.data
        const allAgents = convertApiDataListToAgentMarketplaceInfoList(dataList)

        // 设置 Card View 数据（应用类别筛选规则）
        const filteredAgentsForCardView = filterAgentsByForCardView(allAgents)
        setAgentMarketplaceInfoList(filteredAgentsForCardView)

        // 设置 List View 数据（筛选没有 kolInfo 和 tokenInfo 的，去重并排序）
        const filteredAgentsForListView = filterAgentsForListView(allAgents)
        dispatch(updateAgentMarketplaceListViewInfoList(filteredAgentsForListView))
      }
      return data
    } catch (error) {
      return error
    } finally {
      setIsLoadingMarketplace(false)
    }
  }, [setAgentMarketplaceInfoList, setIsLoadingMarketplace, triggerGetAgentMarketplaceList, dispatch])
}

export function useGetSearchedAgentMarketplaceInfoList() {
  const [, setSearchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
  const [, setIsLoadingMarketplace] = useIsLoadingMarketplace()
  const [triggerSearchAgents] = useLazySearchAgentsQuery()
  const dispatch = useDispatch()

  return useCallback(
    async (searchStr: string) => {
      try {
        setIsLoadingMarketplace(true)
        const data = await triggerSearchAgents({ searchStr })
        if (data.isSuccess) {
          const dataList = data.data.data
          const allAgents = convertApiDataListToAgentMarketplaceInfoList(dataList)

          // 设置 Card View 搜索数据（应用类别筛选规则）
          const filteredAgentsForCardView = filterAgentsByForCardView(allAgents)
          setSearchedAgentMarketplaceInfoList(filteredAgentsForCardView)

          // 设置 List View 搜索数据（筛选没有 kolInfo 和 tokenInfo 的，去重并排序）
          const filteredAgentsForListView = filterAgentsForListView(allAgents)
          dispatch(updateSearchedAgentMarketplaceListViewInfoList(filteredAgentsForListView))
        }
        return data
      } catch (error) {
        return error
      } finally {
        setIsLoadingMarketplace(false)
      }
    },
    [setSearchedAgentMarketplaceInfoList, setIsLoadingMarketplace, triggerSearchAgents, dispatch],
  )
}

export function useIsAgentSubscribed(agentId: number): boolean {
  const subscribedAgentIds = useSelector((state: RootState) => state.agentHub.subscribedAgentIds)
  return subscribedAgentIds.includes(agentId)
}

export function useIsSelfAgent(agentId: number): boolean {
  const [{ telegramUserId }] = useUserInfo()
  const [subscribedAgents] = useSubscribedAgents()
  const agent = subscribedAgents.find((agent) => agent.id === agentId)
  return agent?.user_id === telegramUserId
}

export function useGetSubscribedAgents() {
  const dispatch = useDispatch()
  const [, setSubscribedAgents] = useSubscribedAgents()
  const [triggerGetSubscribedAgents] = useLazyGetSubscribedAgentsQuery()
  const [{ telegramUserId }] = useUserInfo()

  return useCallback(async () => {
    try {
      const response = await triggerGetSubscribedAgents({
        userId: telegramUserId,
      })

      if (response.isSuccess) {
        // Extract agent IDs from response
        const agents = response.data.data.tasks
        const agentIds = agents.map((agent: any) => agent.id)
        setSubscribedAgents(agents)
        dispatch(updateSubscribedAgentIds(agentIds))
      }

      return response
    } catch (error) {
      console.error('Failed to get subscribed agents:', error)
      return error
    }
  }, [dispatch, setSubscribedAgents, triggerGetSubscribedAgents, telegramUserId])
}

export function useCurrentKolInfo(): [KolInfo | null, (kolInfo: KolInfo | null) => void] {
  const currentKolInfo = useSelector((state: RootState) => state.agentHub.currentKolInfo)
  const dispatch = useDispatch()
  const setCurrentKolInfo = useCallback(
    (kolInfo: KolInfo | null) => {
      dispatch(updateCurrentKolInfo(kolInfo))
    },
    [dispatch],
  )
  return [currentKolInfo, setCurrentKolInfo]
}

export function useCurrentTokenInfo(): [TokenInfo | null, (tokenInfo: TokenInfo | null) => void] {
  const currentTokenInfo = useSelector((state: RootState) => state.agentHub.currentTokenInfo)
  const dispatch = useDispatch()
  const setCurrentTokenInfo = useCallback(
    (tokenInfo: TokenInfo | null) => {
      dispatch(updateCurrentTokenInfo(tokenInfo))
    },
    [dispatch],
  )
  return [currentTokenInfo, setCurrentTokenInfo]
}

// 排序相关的hooks
export function useListViewSortingColumn(): [
  ListViewSortingColumn | null,
  (column: ListViewSortingColumn | null) => void,
] {
  const listViewSortingColumn = useSelector((state: RootState) => state.agentHub.listViewSortingColumn)
  const dispatch = useDispatch()
  const setListViewSortingColumn = useCallback(
    (column: ListViewSortingColumn | null) => {
      dispatch(updateListViewSortingColumn(column))
    },
    [dispatch],
  )
  return [listViewSortingColumn, setListViewSortingColumn]
}

export function useListViewSortingOrder(): [ListViewSortingOrder | null, (order: ListViewSortingOrder | null) => void] {
  const listViewSortingOrder = useSelector((state: RootState) => state.agentHub.listViewSortingOrder)
  const dispatch = useDispatch()
  const setListViewSortingOrder = useCallback(
    (order: ListViewSortingOrder | null) => {
      dispatch(updateListViewSortingOrder(order))
    },
    [dispatch],
  )
  return [listViewSortingOrder, setListViewSortingOrder]
}

// 排序逻辑hook
export function useListViewSorting() {
  const [sortingColumn, setSortingColumn] = useListViewSortingColumn()
  const [sortingOrder, setSortingOrder] = useListViewSortingOrder()

  const handleSort = useCallback(
    (column: ListViewSortingColumn) => {
      if (sortingColumn === column) {
        // 同一个字段连续点击：降序 -> 升序 -> 取消排序
        if (sortingOrder === ListViewSortingOrder.DESC) {
          setSortingOrder(ListViewSortingOrder.ASC)
        } else if (sortingOrder === ListViewSortingOrder.ASC) {
          setSortingOrder(null)
          setSortingColumn(null)
        } else {
          setSortingOrder(ListViewSortingOrder.DESC)
        }
      } else {
        // 切换字段：从降序开始
        setSortingColumn(column)
        setSortingOrder(ListViewSortingOrder.DESC)
      }
    },
    [sortingColumn, sortingOrder, setSortingColumn, setSortingOrder],
  )

  return {
    sortingColumn,
    sortingOrder,
    handleSort,
  }
}

// 应用排序到数据
export function useSortedAgentMarketplaceListViewInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const agentMarketplaceListViewInfoList = useSelector(
    (state: RootState) => state.agentHub.agentMarketplaceListViewInfoList,
  )
  const searchedAgentMarketplaceListViewInfoList = useSelector(
    (state: RootState) => state.agentHub.searchedAgentMarketplaceListViewInfoList,
  )
  const [sortingColumn] = useListViewSortingColumn()
  const [sortingOrder] = useListViewSortingOrder()
  const [searchString] = useMarketplaceSearchString()
  const dispatch = useDispatch()

  const currentList = searchString ? searchedAgentMarketplaceListViewInfoList : agentMarketplaceListViewInfoList
  const setCurrentList = useCallback(
    (agents: AgentInfo[]) => {
      if (searchString) {
        dispatch(updateSearchedAgentMarketplaceListViewInfoList(agents))
      } else {
        dispatch(updateAgentMarketplaceListViewInfoList(agents))
      }
    },
    [searchString, dispatch],
  )

  const sortedList = useMemo(() => {
    if (!sortingColumn || !sortingOrder) {
      return currentList
    }

    return [...currentList].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortingColumn) {
        case ListViewSortingColumn.UPDATED_TIME:
          aValue = a.updatedTime || 0
          bValue = b.updatedTime || 0
          break
        case ListViewSortingColumn.CREATED_TIME:
          aValue = a.createdTime || 0
          bValue = b.createdTime || 0
          break
        case ListViewSortingColumn.SUBSCRIPTIONS:
          aValue = a.subscriberCount || 0
          bValue = b.subscriberCount || 0
          break
        default:
          return 0
      }

      if (sortingOrder === ListViewSortingOrder.ASC) {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }, [currentList, sortingColumn, sortingOrder])

  return [sortedList, setCurrentList]
}

// 统一的数据源选择 hook
export function useCurrentAgentList(showSearchBar: boolean = true): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const [viewMode] = useAgentHubViewMode()
  const [searchString] = useMarketplaceSearchString()
  const [agentMarketplaceInfoList, setAgentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [searchedAgentMarketplaceInfoList, setSearchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
  const [sortedAgentMarketplaceListViewInfoList, setSortedAgentMarketplaceListViewInfoList] =
    useSortedAgentMarketplaceListViewInfoList()

  const currentAgentList = useMemo(() => {
    if (viewMode === AgentHubViewMode.LIST) {
      return sortedAgentMarketplaceListViewInfoList
    }
    return showSearchBar && searchString ? searchedAgentMarketplaceInfoList : agentMarketplaceInfoList
  }, [
    viewMode,
    sortedAgentMarketplaceListViewInfoList,
    showSearchBar,
    searchString,
    searchedAgentMarketplaceInfoList,
    agentMarketplaceInfoList,
  ])

  const setCurrentAgentList = useCallback(
    (agents: AgentInfo[]) => {
      if (viewMode === AgentHubViewMode.LIST) {
        setSortedAgentMarketplaceListViewInfoList(agents)
      } else if (showSearchBar && searchString) {
        setSearchedAgentMarketplaceInfoList(agents)
      } else {
        setAgentMarketplaceInfoList(agents)
      }
    },
    [
      viewMode,
      setSortedAgentMarketplaceListViewInfoList,
      showSearchBar,
      searchString,
      setSearchedAgentMarketplaceInfoList,
      setAgentMarketplaceInfoList,
    ],
  )

  return [currentAgentList, setCurrentAgentList]
}
