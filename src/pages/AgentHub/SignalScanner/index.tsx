import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useEffect, useCallback } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import SignalScannerSection from './components/SignalScannerSection'
import { AGENT_HUB_TYPE, SIGNAL_SCANNER } from 'constants/agentHub'
import {
  useAgentThreadInfoListAgents,
  useGetAgentThreadInfoList,
  useIsLoading,
  useAgentThreadInfoList,
  useIsLoadMoreLoading,
} from 'store/agenthub/hooks'

const SignalScannerWrapper = styled.div`
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

export default memo(function SignalScanner() {
  const signalScannerWrapperRef = useScrollbarClass<HTMLDivElement>()

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
      filterType: AGENT_HUB_TYPE.SIGNAL_SCANNER,
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
      filterType: AGENT_HUB_TYPE.SIGNAL_SCANNER,
    })
  }, [isLoadMoreLoading, hasLoadMore, agentThreadInfoListPage, agentThreadInfoListPageSize, getAgentThreadInfoList])

  return (
    <SignalScannerWrapper ref={signalScannerWrapperRef as any} className='scroll-style'>
      <Content>
        <SignalScannerSection
          category={{
            id: SIGNAL_SCANNER.id,
            title: <Trans>{SIGNAL_SCANNER.titleKey}</Trans>,
            description: <Trans>{SIGNAL_SCANNER.descriptionKey}</Trans>,
            hasCustomComponent: SIGNAL_SCANNER.hasCustomComponent,
          }}
          showViewMore={false}
          customAgents={agentThreadInfoListAgents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
        />
      </Content>
    </SignalScannerWrapper>
  )
})
