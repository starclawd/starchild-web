import { memo, useState, useEffect, useCallback } from 'react'
import AgentTable from '../AgentTableList/components/AgentTable'
import { convertApiTaskListToAgentInfoList } from 'store/agenthub/utils'
import { AgentInfo, ListViewSortingColumn, ListViewSortingOrder } from 'store/agenthub/agenthub'
import { useLazyGetAgentMarketplaceListViewInfoListQuery } from 'api/agentHub'
import { subscriptionEventTarget } from 'store/agenthub/hooks/useSubscription'

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
  // 本地状态管理
  const [currentAgentList, setCurrentAgentList] = useState<AgentInfo[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 监听订阅状态变化事件
  const subscriptionEventHandler = useCallback((event: Event) => {
    const customEvent = event as CustomEvent
    const { type, agentId } = customEvent.detail

    setCurrentAgentList((prevList) =>
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

  // API hook
  const [triggerGetAgentMarketplaceListViewInfoList] = useLazyGetAgentMarketplaceListViewInfoListQuery()

  // 计算分页相关状态
  const pageSize = 20
  const hasNextPage = currentAgentList.length < total
  const isLoadMoreLoading = isLoading && page > 1

  // 获取数据的函数
  const fetchData = useCallback(
    async (pageNum: number, resetData: boolean = false) => {
      try {
        setIsLoading(true)

        const response = await triggerGetAgentMarketplaceListViewInfoList({
          page: pageNum,
          pageSize,
          searchStr: showSearchBar ? searchString : '',
          category,
          sortingColumn,
          sortingOrder,
        })

        if (response.isSuccess) {
          const data = response.data.data
          const newAgents = convertApiTaskListToAgentInfoList(data?.tasks || [])
          const pagination = data?.pagination || {}

          if (resetData) {
            setCurrentAgentList(newAgents)
          } else {
            setCurrentAgentList((prev) => [...prev, ...newAgents])
          }

          setTotal(pagination?.total_count || 0)
        }
      } catch (error) {
        console.error('Failed to fetch agent marketplace list view info:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [
      category,
      sortingColumn,
      sortingOrder,
      triggerGetAgentMarketplaceListViewInfoList,
      pageSize,
      showSearchBar,
      searchString,
    ],
  )

  // 监听参数变化，重置page并重新获取数据
  useEffect(() => {
    setPage(1)
    fetchData(1, true)
  }, [searchString, category, sortingColumn, sortingOrder, fetchData])

  // 注册和注销订阅事件监听器
  useEffect(() => {
    subscriptionEventTarget.addEventListener('agentSubscriptionChange', subscriptionEventHandler)

    return () => {
      subscriptionEventTarget.removeEventListener('agentSubscriptionChange', subscriptionEventHandler)
    }
  }, [subscriptionEventHandler])

  // 加载更多数据
  const handleLoadMore = useCallback(async () => {
    if (hasNextPage && !isLoading) {
      const nextPage = page + 1
      setPage(nextPage)
      await fetchData(nextPage, false)
    }
  }, [page, hasNextPage, isLoading, fetchData])

  return (
    <AgentTable
      agents={currentAgentList}
      isLoading={isLoading && page === 1}
      hasLoadMore={hasNextPage}
      isLoadMoreLoading={isLoadMoreLoading}
      onLoadMore={handleLoadMore}
    />
  )
})
