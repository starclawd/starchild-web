import { memo, useState, useEffect, useCallback } from 'react'
import AgentTable from '../AgentTableList/components/AgentTable'
import { convertApiTaskListToAgentInfoList } from 'store/agenthub/utils'
import { AgentInfo, ListViewSortingColumn, ListViewSortingOrder } from 'store/agenthub/agenthub'
import { useLazyGetAgentMarketplaceListViewInfoListQuery } from 'api/agentHub'
import { subscriptionEventTarget } from 'store/agenthub/hooks/useSubscription'
import { usePagination, PaginationParams, PaginatedResponse } from 'hooks/usePagination'

interface AgentMarketplaceListViewProps {
  showSearchBar: boolean
  category?: string
  sortingColumn?: ListViewSortingColumn
  sortingOrder?: ListViewSortingOrder
  searchString: string
}

export default memo(function AgentMarketplaceListView({
  showSearchBar,
  category,
  sortingColumn,
  sortingOrder,
  searchString,
}: AgentMarketplaceListViewProps) {
  // API hook
  const [triggerGetAgentMarketplaceListViewInfoList] = useLazyGetAgentMarketplaceListViewInfoListQuery()

  // API适配器函数：将API响应转换为usePagination所需格式
  const fetchFunction = useCallback(
    async (params: PaginationParams): Promise<PaginatedResponse<AgentInfo>> => {
      const response = await triggerGetAgentMarketplaceListViewInfoList({
        page: params.page,
        pageSize: params.pageSize,
        searchStr: showSearchBar ? params.searchString || '' : '',
        category: params.category,
        sortingColumn: params.sortingColumn,
        sortingOrder: params.sortingOrder,
      })

      if (!response.isSuccess) {
        throw new Error('Failed to fetch agent marketplace list view info')
      }

      const data = response.data.data
      const newAgents = convertApiTaskListToAgentInfoList(data?.tasks || [])
      const pagination = data?.pagination || {}
      const totalCount = pagination?.total_count || 0

      return {
        data: newAgents,
        hasNextPage: params.page * params.pageSize < totalCount,
        totalCount,
      }
    },
    [triggerGetAgentMarketplaceListViewInfoList, showSearchBar],
  )

  // 使用usePagination管理分页状态
  const {
    data: currentAgentList,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalCount,
    loadFirstPage,
    loadNextPage,
    setExtraParams,
  } = usePagination<AgentInfo>({
    initialPageSize: 20,
    fetchFunction,
    extraParams: {
      searchString,
      category,
      sortingColumn,
      sortingOrder,
    },
    onError: (error) => {
      console.error('Failed to fetch agent marketplace list view info:', error)
    },
  })

  // 本地状态：用于订阅状态变化
  const [displayAgentList, setDisplayAgentList] = useState<AgentInfo[]>([])

  // 同步分页数据到显示列表
  useEffect(() => {
    setDisplayAgentList(currentAgentList)
  }, [currentAgentList])

  // 监听订阅状态变化事件
  const subscriptionEventHandler = useCallback((event: Event) => {
    const customEvent = event as CustomEvent
    const { type, agentId } = customEvent.detail

    setDisplayAgentList((prevList) =>
      prevList.map((agent) => {
        if (agent.agentId === agentId) {
          if (type === 'SUBSCRIBE_AGENT') {
            return {
              ...agent,
              subscriberCount: agent.subscriberCount + 1,
            }
          } else if (type === 'UNSUBSCRIBE_AGENT') {
            return {
              ...agent,
              subscriberCount: Math.max(0, agent.subscriberCount - 1),
            }
          }
        }
        return agent
      }),
    )
  }, [])

  // 监听参数变化，更新分页参数并重新获取数据
  useEffect(() => {
    setExtraParams({
      searchString,
      category,
      sortingColumn,
      sortingOrder,
    })
    loadFirstPage()
  }, [searchString, category, sortingColumn, sortingOrder, setExtraParams, loadFirstPage])

  // 注册和注销订阅事件监听器
  useEffect(() => {
    subscriptionEventTarget.addEventListener('agentSubscriptionChange', subscriptionEventHandler)

    return () => {
      subscriptionEventTarget.removeEventListener('agentSubscriptionChange', subscriptionEventHandler)
    }
  }, [subscriptionEventHandler])

  // 加载更多数据
  const handleLoadMore = useCallback(async () => {
    await loadNextPage()
  }, [loadNextPage])

  return (
    <AgentTable
      agents={displayAgentList}
      isLoading={isLoading}
      hasLoadMore={hasNextPage}
      isLoadMoreLoading={isLoadingMore}
      onLoadMore={handleLoadMore}
    />
  )
})
