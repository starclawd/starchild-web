import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useCallback } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import AutoBriefingSection from './components/AutoBriefingSection'
import { AGENT_HUB_TYPE, AUTO_BRIEFING } from 'constants/agentHub'
import {
  useAgentThreadInfoListAgents,
  useGetAgentThreadInfoList,
  useIsLoading,
  useAgentThreadInfoList,
  useIsLoadMoreLoading,
} from 'store/agenthub/hooks'

const AutoBriefingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
    `}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(16)};
    `}

  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.textL1};
    margin: 0;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(20)};
      `}
  }
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

export default memo(function AutoBriefing() {
  const autoBriefingWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [agentThreadInfoListAgents] = useAgentThreadInfoListAgents()
  const [isLoading] = useIsLoading()
  const [
    agentThreadInfoListAgentsList,
    agentThreadInfoListTotal,
    agentThreadInfoListPage,
    agentThreadInfoListPageSize,
  ] = useAgentThreadInfoList()
  const getAgentThreadInfoList = useGetAgentThreadInfoList()
  const [isLoadMoreLoading] = useIsLoadMoreLoading()

  useEffect(() => {
    getAgentThreadInfoList({
      page: 1,
      pageSize: 20,
      filterType: AGENT_HUB_TYPE.AUTO_BRIEFING,
    })
  }, [getAgentThreadInfoList])

  // 计算是否还有更多数据
  const hasLoadMore = agentThreadInfoListTotal > 0 && agentThreadInfoListAgentsList.length < agentThreadInfoListTotal

  // 处理 load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreLoading) return

    if (!hasLoadMore) return

    await getAgentThreadInfoList({
      page: agentThreadInfoListPage + 1,
      pageSize: agentThreadInfoListPageSize,
      filterType: AGENT_HUB_TYPE.AUTO_BRIEFING,
    })
  }, [isLoadMoreLoading, hasLoadMore, agentThreadInfoListPage, agentThreadInfoListPageSize, getAgentThreadInfoList])

  return (
    <AutoBriefingWrapper ref={autoBriefingWrapperRef as any} className='scroll-style'>
      <Content>
        <AutoBriefingSection
          category={{
            id: AUTO_BRIEFING.id,
            title: <Trans>{AUTO_BRIEFING.titleKey}</Trans>,
            description: <Trans>{AUTO_BRIEFING.descriptionKey}</Trans>,
            hasCustomComponent: AUTO_BRIEFING.hasCustomComponent,
          }}
          showViewMore={false}
          customAgents={agentThreadInfoListAgents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
        />
      </Content>
    </AutoBriefingWrapper>
  )
})
