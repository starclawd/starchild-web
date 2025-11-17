import { memo, useState, useEffect, useCallback } from 'react'
import styled, { css, keyframes } from 'styled-components'
import {
  useMyAgentsOverviewListPaginated,
  usePrivateAgentSubscription,
  useListenNewTriggerNotification,
  useResetNewTrigger,
  useNewTriggerList,
} from 'store/myagent/hooks'
import EmptyOverview from './components/EmptyOverview'
import AgentOverviewCard from './components/AgentOverviewCard'
import Pending from 'components/Pending'
import PullUpRefresh from 'components/PullUpRefresh'
import { vm } from 'pages/helper'
import { Plural } from '@lingui/react/macro'
import ScrollPageContent from 'components/ScrollPageContent'

const MyAgentsOverviewPageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

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

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      margin: 0 ${vm(8)};
    `}
`

function MyAgentsOverview() {
  const {
    agents: myAgentsOverviewList,
    loadFirstPage,
    loadMoreAgents,
    hasNextPage,
    isLoading,
    isLoadingMore,
    reset,
  } = useMyAgentsOverviewListPaginated()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isButtonExiting, setIsButtonExiting] = useState(false)

  // 获取newTriggerList状态
  const [newTriggerList] = useNewTriggerList()

  // WebSocket订阅相关
  const { subscribe, unsubscribe, isOpen } = usePrivateAgentSubscription()

  // 监听新trigger通知
  useListenNewTriggerNotification()

  // 重置newTrigger的hook
  const resetNewTrigger = useResetNewTrigger()

  // 组件挂载时发起订阅
  useEffect(() => {
    if (isOpen) {
      subscribe()
    }

    // 组件卸载时取消订阅
    return () => {
      unsubscribe()
    }
  }, [subscribe, unsubscribe, isOpen])

  // 处理加载更多
  const handleLoadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore) {
      await loadMoreAgents()
    }
    setIsRefreshing(false)
  }, [hasNextPage, isLoadingMore, loadMoreAgents, setIsRefreshing])

  // 处理显示新Posts按钮点击
  const handleShowNewPosts = useCallback(async () => {
    // 开始退出动画
    setIsButtonExiting(true)

    // 等待动画完成后执行逻辑
    setTimeout(async () => {
      // 重置newTriggerList
      resetNewTrigger()
      // 重新加载第一页数据
      reset()
      await loadFirstPage()
      // 重置按钮状态
      setIsButtonExiting(false)
    }, 300) // 动画时长 0.3s
  }, [resetNewTrigger, reset, loadFirstPage])

  if (isLoading) {
    return (
      <MyAgentsOverviewPageWrapper>
        <Pending isFetching={isLoading} />
      </MyAgentsOverviewPageWrapper>
    )
  }

  // If no subscribed agents, show empty state
  if (!myAgentsOverviewList || myAgentsOverviewList.length === 0) {
    return (
      <MyAgentsOverviewPageWrapper>
        <ScrollPageContent>
          <EmptyOverview />
        </ScrollPageContent>
      </MyAgentsOverviewPageWrapper>
    )
  }

  // Render the overview list of subscribed agents
  return (
    <MyAgentsOverviewPageWrapper>
      {/* 如果有新的trigger且按钮未在退出状态，显示悬浮按钮 */}
      {newTriggerList.length > 0 && (
        <NotificationButton $isExiting={isButtonExiting} onClick={handleShowNewPosts}>
          <Plural value={newTriggerList.length} one='Show # post' other='Show # posts' />
        </NotificationButton>
      )}
      <ScrollPageContent>
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
            {myAgentsOverviewList.map((agent) => (
              <AgentOverviewCard
                key={`${agent.task_id}-${agent.trigger_history[0].id}`}
                data={agent}
                fromPage='myagents'
              />
            ))}
          </AgentCardsWrapper>
        </PullUpRefresh>
      </ScrollPageContent>
    </MyAgentsOverviewPageWrapper>
  )
}

export default memo(MyAgentsOverview)
