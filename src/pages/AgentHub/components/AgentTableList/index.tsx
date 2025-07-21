import styled, { css } from 'styled-components'
import { memo, useEffect, useCallback, useRef } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import {
  useGetAgentInfoList,
  useIsLoading,
  useAgentInfoList,
  useIsLoadMoreLoading,
  useCategorySearchTag,
} from 'store/agenthub/hooks'
import { useIsMobile } from 'store/application/hooks'
import AgentTable from './components/AgentTable'

const AgentHubPageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 20px;
  gap: 40px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0;
      gap: ${vm(0)};
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

interface AgentTableListPageProps {
  initialTag: string // 初始标签（kolId, tokenId）
  filterType: AGENT_HUB_TYPE // 过滤类型
}

export default memo(function AgentTableListPage({ initialTag, filterType }: AgentTableListPageProps) {
  const agentHubPageWrapperRef = useScrollbarClass<HTMLDivElement>()
  const isInitializedRef = useRef(false)
  const isMobile = useIsMobile()
  const [isLoading] = useIsLoading()
  const [agentInfoList, agentInfoListTotal, agentInfoListPage, agentInfoListPageSize] = useAgentInfoList()
  const getAgentInfoList = useGetAgentInfoList()
  const [isLoadMoreLoading] = useIsLoadMoreLoading()
  const [searchTag, setSearchTag] = useCategorySearchTag()

  // 根据搜索状态决定使用哪个列表
  const currentAgentsList = agentInfoList
  const currentTotal = agentInfoListTotal
  const currentPage = agentInfoListPage
  const currentPageSize = agentInfoListPageSize

  const loadData = useCallback(
    (filterString: string, tagString?: string) => {
      // 使用普通列表接口
      getAgentInfoList({
        page: 1,
        pageSize: agentInfoListPageSize,
        filterType,
        tag: tagString,
      })
    },
    [getAgentInfoList, agentInfoListPageSize, filterType],
  )

  // 初始化和搜索条件变化处理
  useEffect(() => {
    if (!isInitializedRef.current) {
      // 初始化：清空搜索标签并加载数据
      isInitializedRef.current = true
      setSearchTag(initialTag || '')
      loadData('', initialTag || '')
    }
  }, [loadData, setSearchTag, initialTag])

  // 计算是否还有更多数据 - 搜索状态下不支持分页
  const hasLoadMore = currentTotal > 0 && currentAgentsList.length < currentTotal

  // 处理 load more - 搜索状态下不会调用
  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreLoading) return

    if (!hasLoadMore) return
    await getAgentInfoList({
      page: currentPage + 1,
      pageSize: currentPageSize,
      filterType,
      tag: initialTag,
    })
  }, [isLoadMoreLoading, hasLoadMore, currentPage, currentPageSize, getAgentInfoList, initialTag, filterType])

  return (
    <AgentHubPageWrapper ref={agentHubPageWrapperRef as any} className='scroll-style'>
      <Content>
        <AgentTable
          agents={currentAgentsList}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasLoadMore={hasLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
        />
      </Content>
    </AgentHubPageWrapper>
  )
})
