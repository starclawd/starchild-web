import styled, { css } from 'styled-components'
import { memo, useEffect, useCallback, useMemo } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import AgentCardSection from '../AgentCardSection'
import StickySearchHeader from '../StickySearchHeader'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import {
  useAgentInfoListAgents,
  useGetAgentInfoList,
  useIsLoading,
  useAgentInfoList,
  useIsLoadMoreLoading,
  useSearchString,
} from 'store/agenthub/hooks'
import { debounce } from 'utils/common'
import { Trans } from '@lingui/react/macro'

const AgentHubPageWrapper = styled.div`
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
      padding: ${vm(16)};
    `}
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      margin-bottom: ${vm(24)};
    `}
`

const Title = styled.h1`
  font-size: 36px;
  line-height: 44px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(32)};
    `}
`

const Description = styled.p`
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL3};
  margin: 0;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
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

interface AgentHubPageProps {
  category: any // 传入的分类常量
  filterType: AGENT_HUB_TYPE // 对应的过滤类型
  skeletonType?: 'default' | 'with-image' // 骨架屏类型
  runAgentCard?: React.ReactNode // 运行 agent 卡片
  onRunAgent?: () => void // 运行 agent 的回调
}

export default memo(function AgentHubPage({
  category,
  filterType,
  skeletonType = 'default',
  runAgentCard,
  onRunAgent,
}: AgentHubPageProps) {
  const agentHubPageWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [agentInfoListAgents] = useAgentInfoListAgents()
  const [isLoading] = useIsLoading()
  const [
    agentThreadInfoListAgentsList,
    agentThreadInfoListTotal,
    agentThreadInfoListPage,
    agentThreadInfoListPageSize,
  ] = useAgentInfoList()
  const getAgentInfoList = useGetAgentInfoList()
  const [isLoadMoreLoading] = useIsLoadMoreLoading()
  const [searchString, setSearchString] = useSearchString()

  // 初始化加载数据
  useEffect(() => {
    getAgentInfoList({
      page: 1,
      pageSize: 20,
      filterType,
      filterString: searchString,
    })
  }, [getAgentInfoList, filterType, searchString])

  // 搜索防抖处理
  const debouncedSearch = useMemo(
    () =>
      debounce((filterString: string) => {
        getAgentInfoList({
          page: 1,
          pageSize: 20,
          filterType,
          filterString,
        })
      }, 500),
    [getAgentInfoList, filterType],
  )

  useEffect(() => {
    debouncedSearch(searchString)
  }, [searchString, debouncedSearch])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchString(value)
    },
    [setSearchString],
  )

  // 计算是否还有更多数据
  const hasLoadMore = agentThreadInfoListTotal > 0 && agentThreadInfoListAgentsList.length < agentThreadInfoListTotal

  // 处理 load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreLoading) return

    if (!hasLoadMore) return

    await getAgentInfoList({
      page: agentThreadInfoListPage + 1,
      pageSize: agentThreadInfoListPageSize,
      filterType,
      filterString: searchString,
    })
  }, [
    isLoadMoreLoading,
    hasLoadMore,
    agentThreadInfoListPage,
    agentThreadInfoListPageSize,
    getAgentInfoList,
    filterType,
    searchString,
  ])

  return (
    <AgentHubPageWrapper ref={agentHubPageWrapperRef as any} className='scroll-style'>
      <Header>
        <Title>
          <Trans>{category.titleKey}</Trans>
        </Title>
        {category.descriptionKey && (
          <Description>
            <Trans>{category.descriptionKey}</Trans>
          </Description>
        )}
      </Header>
      <StickySearchHeader onSearchChange={handleSearchChange} searchString={searchString} />
      <Content>
        <AgentCardSection
          category={category}
          isSectionMode={false}
          showViewMore={false}
          customAgents={agentInfoListAgents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
          runAgentCard={runAgentCard}
          skeletonType={skeletonType}
        />
      </Content>
    </AgentHubPageWrapper>
  )
})
