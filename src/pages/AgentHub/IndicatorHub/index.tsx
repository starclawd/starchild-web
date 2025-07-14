import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useCallback, useMemo } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import AgentCardSection from '../components/AgentCardSection'
import { AGENT_HUB_TYPE, INDICATOR_HUB } from 'constants/agentHub'
import IndicatorRunAgentCard from './components/IndicatorRunAgentCard'
import {
  useAgentThreadInfoListAgents,
  useGetAgentThreadInfoList,
  useIsLoading,
  useAgentThreadInfoList,
  useIsLoadMoreLoading,
  useSearchString,
} from 'store/agenthub/hooks'
import StickySearchHeader from 'pages/AgentHub/components/StickySearchHeader'
import { debounce } from 'utils/common'

const IndicatorHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
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

export default memo(function IndicatorHub() {
  const indicatorHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [agentThreadInfoListAgents] = useAgentThreadInfoListAgents()
  const [isLoading] = useIsLoading()
  const [agentThreadInfoList, agentThreadInfoListTotal, agentThreadInfoListPage, agentThreadInfoListPageSize] =
    useAgentThreadInfoList()
  const getAgentThreadInfoList = useGetAgentThreadInfoList()
  const [isLoadMoreLoading] = useIsLoadMoreLoading()
  const [searchString, setSearchString] = useSearchString()

  // 初始化加载数据
  useEffect(() => {
    getAgentThreadInfoList({
      page: 1,
      pageSize: 20,
      filterType: AGENT_HUB_TYPE.INDICATOR,
    })
  }, [getAgentThreadInfoList])

  const debouncedSearch = useMemo(
    () =>
      debounce((filterString: string) => {
        getAgentThreadInfoList({
          page: 1,
          pageSize: 20,
          filterType: AGENT_HUB_TYPE.INDICATOR,
          filterString,
        })
      }, 500),
    [getAgentThreadInfoList],
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
  const hasLoadMore = agentThreadInfoListTotal > 0 && agentThreadInfoList.length < agentThreadInfoListTotal

  // 处理 load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreLoading) return

    if (!hasLoadMore) return

    await getAgentThreadInfoList({
      page: agentThreadInfoListPage + 1,
      pageSize: agentThreadInfoListPageSize,
      filterType: AGENT_HUB_TYPE.INDICATOR,
      filterString: searchString,
    })
  }, [
    isLoadMoreLoading,
    hasLoadMore,
    agentThreadInfoListPage,
    agentThreadInfoListPageSize,
    getAgentThreadInfoList,
    searchString,
  ])

  const handleRunAgent = useCallback(() => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }, [])

  return (
    <IndicatorHubWrapper ref={indicatorHubWrapperRef as any} className='scroll-style'>
      <StickySearchHeader onSearchChange={handleSearchChange} searchString={searchString} />
      <Content>
        <AgentCardSection
          category={INDICATOR_HUB}
          showViewMore={false}
          customAgents={agentThreadInfoListAgents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
          // runAgentCard={<IndicatorRunAgentCard onRunAgent={handleRunAgent} />}
          skeletonType='with-image'
        />
      </Content>
    </IndicatorHubWrapper>
  )
})
