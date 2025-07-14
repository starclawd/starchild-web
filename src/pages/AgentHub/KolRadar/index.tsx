import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useCallback } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import KolRadarSection from './components/KolRadarSection'
import { KOL_RADAR, AGENT_HUB_TYPE } from 'constants/agentHub'
import {
  useAgentThreadInfoListAgents,
  useGetAgentThreadInfoList,
  useIsLoading,
  useAgentThreadInfoList,
  useIsLoadMoreLoading,
} from 'store/agenthub/hooks'

const KolRadarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
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
    `
    gap: ${vm(16)};
  `}
`

export default memo(function KolRadar() {
  const kolRadarWrapperRef = useScrollbarClass<HTMLDivElement>()

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
      filterType: AGENT_HUB_TYPE.KOL_RADAR,
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
      filterType: AGENT_HUB_TYPE.KOL_RADAR,
    })
  }, [isLoadMoreLoading, hasLoadMore, agentThreadInfoListPage, agentThreadInfoListPageSize, getAgentThreadInfoList])

  return (
    <KolRadarWrapper ref={kolRadarWrapperRef as any} className='scroll-style'>
      <Content>
        <KolRadarSection
          category={KOL_RADAR}
          showViewMore={false}
          customAgents={agentThreadInfoListAgents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
        />
      </Content>
    </KolRadarWrapper>
  )
})
