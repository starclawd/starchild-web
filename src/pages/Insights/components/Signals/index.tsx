import { memo, useState, useEffect, useCallback } from 'react'
import styled, { css, keyframes } from 'styled-components'
import Pending from 'components/Pending'
import ScrollPageContent from 'components/ScrollPageContent'
import PullUpRefresh from 'components/PullUpRefresh'
import { vm } from 'pages/helper'
import { Plural } from '@lingui/react/macro'
import EmptyOverview from 'pages/MyAgent/components/MyAgentsOverview/components/EmptyOverview'
import AgentOverviewCard from 'pages/MyAgent/components/MyAgentsOverview/components/AgentOverviewCard'
import {
  useGetSystemSignalAgents,
  useListenNewTriggerSystemSignalNotification,
  useNewTriggerSystemSignalsHistoryList,
  useResetNewTriggerSystemSignalsHistoryList,
  useSystemSignalOverviewListPaginated,
} from 'store/insights/hooks/useSystemSignalHooks'
import { useInsightsSubscription } from 'store/insights/hooks'
import { SIGNAL_SUB_ID, SIGNAL_UNSUB_ID } from 'store/websocket/websocket'
import NoData from 'components/NoData'

const SignalsPageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .signals-page-content {
    padding-top: 0;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      overflow-y: auto;
    `}
`

// 从页面中间上方滑入的动画
const slideInFromCenter = keyframes`
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`

// 向页面上方滑出的动画
const slideOutToTop = keyframes`
  from {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
`

const NotificationButton = styled.button<{ $isExiting?: boolean }>`
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: fit-content;

  background-color: ${({ theme }) => theme.black800};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  box-shadow: 0 4px 4px ${({ theme }) => theme.systemShadow};

  color: ${({ theme }) => theme.brand100};
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;

  padding: 8px 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  animation: ${({ $isExiting }) => ($isExiting ? slideOutToTop : slideInFromCenter)} 0.3s ease-out;

  &:hover {
    background-color: ${({ theme }) => theme.bgT20};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      top: ${vm(8)};
      font-size: 0.13rem;
      line-height: 0.2rem;
      padding: ${vm(8)} ${vm(24)};
    `}
`

const AgentCardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding-top: 0;
    `}
`

function SystemSignalOverview() {
  const {
    signals: systemSignalOverviewList,
    loadFirstPage,
    loadMoreSignals,
    hasNextPage,
    isLoading,
    isLoadingMore,
    reset,
  } = useSystemSignalOverviewListPaginated()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isButtonExiting, setIsButtonExiting] = useState(false)

  // 获取newTriggerList状态
  const [newTriggerList] = useNewTriggerSystemSignalsHistoryList()
  const triggerGetSystemSignalAgents = useGetSystemSignalAgents()

  // WebSocket订阅相关
  const { subscribe, unsubscribe, isOpen } = useInsightsSubscription({ handleMessage: false })

  // 监听新trigger通知
  useListenNewTriggerSystemSignalNotification()

  // 重置newTrigger的hook
  const resetNewTriggerSystemSignalHistoryList = useResetNewTriggerSystemSignalsHistoryList()

  // 组件挂载时发起订阅
  useEffect(() => {
    if (isOpen) {
      subscribe('all-agents-notification', SIGNAL_SUB_ID)
    }

    // 组件卸载时取消订阅
    return () => {
      unsubscribe('all-agents-notification', SIGNAL_UNSUB_ID)
    }
  }, [subscribe, unsubscribe, isOpen])

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore) {
      await loadMoreSignals()
    }
    setIsRefreshing(false)
  }, [hasNextPage, isLoadingMore, loadMoreSignals, setIsRefreshing])

  // 处理显示新Posts按钮点击
  const handleShowNewPosts = useCallback(async () => {
    // 开始退出动画
    setIsButtonExiting(true)

    // 等待动画完成后执行逻辑
    setTimeout(async () => {
      // 重置newTriggerList
      resetNewTriggerSystemSignalHistoryList()
      // 重新加载第一页数据
      reset()
      await loadFirstPage()
      // 重新加载侧边栏all agents列表
      await triggerGetSystemSignalAgents()
      // 重置按钮状态
      setIsButtonExiting(false)
    }, 300) // 动画时长 0.3s
  }, [resetNewTriggerSystemSignalHistoryList, reset, loadFirstPage, triggerGetSystemSignalAgents])

  if (isLoading) {
    return (
      <SignalsPageWrapper>
        <Pending isFetching={isLoading} />
      </SignalsPageWrapper>
    )
  }

  // If no subscribed agents, show empty state
  if (!systemSignalOverviewList || systemSignalOverviewList.length === 0) {
    return (
      <SignalsPageWrapper>
        <NoData />
      </SignalsPageWrapper>
    )
  }

  // Render the overview list of subscribed agents
  return (
    <SignalsPageWrapper>
      {/* 如果有新的trigger且按钮未在退出状态，显示悬浮按钮 */}
      {newTriggerList.length > 0 && (
        <NotificationButton $isExiting={isButtonExiting} onClick={handleShowNewPosts}>
          <Plural value={newTriggerList.length} one='Show # post' other='Show # posts' />
        </NotificationButton>
      )}

      <ScrollPageContent className='signals-page-content'>
        <PullUpRefresh
          onRefresh={handleLoadMore}
          isRefreshing={isRefreshing}
          setIsRefreshing={setIsRefreshing}
          disabledPull={!hasNextPage}
          hasLoadMore={hasNextPage}
          enableWheel={true}
          wheelThreshold={50}
        >
          <AgentCardsWrapper>
            {systemSignalOverviewList.map((signal) => (
              <AgentOverviewCard
                key={`${signal.task_id}-${signal.trigger_history[0].id}`}
                data={signal}
                fromPage='insights'
              />
            ))}
          </AgentCardsWrapper>
        </PullUpRefresh>
      </ScrollPageContent>
    </SignalsPageWrapper>
  )
}

export default memo(SystemSignalOverview)
