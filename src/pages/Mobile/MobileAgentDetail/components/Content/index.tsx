import styled from 'styled-components'
import { useCallback, useState, useMemo, useEffect } from 'react'
import Pending from 'components/Pending'
import { vm } from 'pages/helper'
import ChatHistory from 'pages/AgentDetail/components/ChatHistory'
import AgentDescription from 'pages/AgentDetail/components/AgentDescription'
import Code from 'pages/AgentDetail/components/Code'
import {
  useAgentDetailData,
  useBacktestData,
  useIsGeneratingCode,
  useIsRunningBacktestAgent,
} from 'store/agentdetail/hooks'
import Thinking from 'pages/AgentDetail/components/Thinking'
import MobileHeader from '../../../components/MobileHeader'
import { useAgentDetailPolling } from 'pages/AgentDetail/components/hooks'
import BottomSheet from 'components/BottomSheet'
import { Trans } from '@lingui/react/macro'
import RightSection from '../RightSection'
import useParsedQueryString from 'hooks/useParsedQueryString'
import PullUpRefresh from 'components/PullUpRefresh'
import { useGetTriggerHistory } from 'store/myagent/hooks'

const MobileAgentDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ContentWrapper = styled.div<{ $isFromMyAgent: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - ${vm(44)});
  overflow: hidden;
  > .pending-wrapper {
    .icon-loading {
      font-size: 36px !important;
    }
  }
  /* padding-bottom: ${({ $isFromMyAgent }) => ($isFromMyAgent ? vm(120) : '0')}; */
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${vm(20)};
  width: 100%;
  height: 100%;
  padding: 0 ${vm(12)};
`

const ThinkingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 ${vm(12)} ${vm(12)};
  background-color: ${({ theme }) => theme.black700};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: ${vm(56)};
  padding: ${vm(20)} ${vm(8)} ${vm(8)};
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
`

export default function MobileAgentDetailContent({
  agentId,
  isFromMyAgent = false,
  callback,
  refreshRef,
}: {
  agentId: string
  isFromMyAgent?: boolean
  callback?: () => void
  refreshRef?: React.MutableRefObject<(() => Promise<void>) | null>
}) {
  const { from } = useParsedQueryString()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false)
  const [agentDetailData] = useAgentDetailData()
  const [backtestData] = useBacktestData()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 分页逻辑 - 只有在有agentId时才启用
  const shouldUsePagination = useMemo(() => {
    return !!agentDetailData?.id
  }, [agentDetailData?.id])

  const paginationResult = useGetTriggerHistory(shouldUsePagination ? agentDetailData?.id?.toString() || '' : '')

  const isRunningBacktestAgent = useIsRunningBacktestAgent(agentDetailData, backtestData)
  const { isLoading, getTaskDetail, getBackTestData } = useAgentDetailPolling({
    agentId,
    agentDetailData,
    backtestData,
  })
  const isGeneratingCode = useIsGeneratingCode(agentDetailData)
  const showThinking = useMemo(() => {
    // return true
    return isGeneratingCode || isRunningBacktestAgent
  }, [isGeneratingCode, isRunningBacktestAgent])

  const closeBottomSheet = useCallback(() => {
    setIsOpenBottomSheet(false)
  }, [])

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (shouldUsePagination && paginationResult.hasNextPage && !paginationResult.isLoadingMore) {
      await paginationResult.loadMoreTriggerHistory()
      setIsRefreshing(false)
    }
  }, [shouldUsePagination, paginationResult])

  useEffect(() => {
    if (showThinking) {
      setIsOpenBottomSheet(true)
    }
  }, [showThinking])

  // 设置刷新方法到父组件的ref
  useEffect(() => {
    if (refreshRef) {
      refreshRef.current = async () => {
        await getTaskDetail(false)
        await getBackTestData()
      }
    }

    return () => {
      if (refreshRef) {
        refreshRef.current = null
      }
    }
  }, [refreshRef, getTaskDetail, getBackTestData])

  return (
    <MobileAgentDetailWrapper>
      <MobileHeader
        hideMenu={false}
        showBackIcon={from === 'myagents' || from === 'insights'}
        backIconCallback={callback}
        title={<Trans>Agent description</Trans>}
        rightSection={
          <RightSection
            data={agentDetailData}
            isOpenBottomSheet={isOpenBottomSheet}
            setIsOpenBottomSheet={setIsOpenBottomSheet}
          />
        }
      />
      <ContentWrapper $isFromMyAgent={isFromMyAgent}>
        {isLoading ? (
          <Pending isFetching />
        ) : (
          <PullUpRefresh
            onRefresh={handleLoadMore}
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
            disabledPull={!shouldUsePagination || !paginationResult.hasNextPage}
            hasLoadMore={shouldUsePagination && paginationResult.hasNextPage}
            enableWheel={false} // 移动版禁用滚轮
            wheelThreshold={50}
          >
            <Content>
              <AgentDescription
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                agentDetailData={agentDetailData}
                showBackButton={false}
              />
              <ChatHistory
                agentDetailData={agentDetailData}
                backtestData={backtestData}
                paginationResult={paginationResult}
                shouldUsePagination={shouldUsePagination}
              />
            </Content>
          </PullUpRefresh>
        )}
        {/* {isFromMyAgent && <AiInput isFromMyAgent />} */}
      </ContentWrapper>
      <BottomSheet
        hideDragHandle
        hideClose={false}
        isOpen={isOpenBottomSheet}
        onClose={closeBottomSheet}
        rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})` }}
      >
        <ThinkingWrapper>
          <Header>
            <Trans>Thinking</Trans>
          </Header>
          {showThinking && (
            <Thinking isMobileThinkingModal agentDetailData={agentDetailData} backtestData={backtestData} />
          )}
          {!showThinking && <Code agentDetailData={agentDetailData} backtestData={backtestData} />}
        </ThinkingWrapper>
      </BottomSheet>
    </MobileAgentDetailWrapper>
  )
}
