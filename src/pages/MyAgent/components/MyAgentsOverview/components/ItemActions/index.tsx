import styled, { css } from 'styled-components'
import { memo, useMemo, useState } from 'react'
import { vm } from 'pages/helper'
import Copy from './components/Copy'
import Feedback from './components/Feedback'
import Refresh from './components/Refresh'
import { AgentTriggerItemActionsProps, FeedbackLoadingStates, RefreshLoadingState } from './types'

const ActionsWrapper = styled.div`
  position: relative;
  bottom: 0;
  width: 100%;
  align-items: flex-end;

  .transition-wrapper {
    width: 100%;
  }
`

const OperatorContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const ItemActions = memo(function ItemActions({
  responseContentRef,
  config = {
    copy: false,
    like: false,
    dislike: false,
    refresh: false,
  },
  feedbackLoadingStates: externalFeedbackLoadingStates,
  refreshLoadingState: externalRefreshLoadingState,
  isLiked,
  isDisliked,
  dislikeReason,
  likeCount,
  dislikeCount,
  onLike,
  onDislike,
  onRefresh,
}: AgentTriggerItemActionsProps) {
  // 内部状态管理 - Feedback组件的loading状态
  const [internalFeedbackLoadingStates, setInternalFeedbackLoadingStates] = useState<FeedbackLoadingStates>({
    like: false,
    dislike: false,
  })

  // 内部状态管理 - Refresh组件的loading状态
  const [internalRefreshLoadingState, setInternalRefreshLoadingState] = useState<RefreshLoadingState>({
    refresh: false,
  })

  // 使用外部状态或内部状态
  const feedbackLoadingStates = externalFeedbackLoadingStates || internalFeedbackLoadingStates
  const refreshLoadingState = externalRefreshLoadingState || internalRefreshLoadingState

  // Feedback状态更新函数
  const updateFeedbackLoadingState = (type: keyof FeedbackLoadingStates, isLoading: boolean) => {
    if (!externalFeedbackLoadingStates) {
      setInternalFeedbackLoadingStates((prev: FeedbackLoadingStates) => ({
        ...prev,
        [type]: isLoading,
      }))
    }
  }

  // Refresh状态更新函数
  const updateRefreshLoadingState = (isLoading: boolean) => {
    if (!externalRefreshLoadingState) {
      setInternalRefreshLoadingState({
        refresh: isLoading,
      })
    }
  }

  // 计算禁用状态
  const isFeedbackLoading = Object.values(feedbackLoadingStates).some(Boolean)
  const isRefreshLoading = refreshLoadingState.refresh

  // 当有任一操作在进行时，refresh应被禁用
  const isAnyLoading = isFeedbackLoading || isRefreshLoading
  const isRefreshDisabled = isAnyLoading && !isRefreshLoading

  return (
    <ActionsWrapper className='agent-trigger-item-actions-wrapper'>
      <OperatorContent>
        <LeftWrapper>
          {config.copy && <Copy responseContentRef={responseContentRef} />}
          {(config.like || config.dislike) && (
            <Feedback
              config={{
                like: config.like,
                dislike: config.dislike,
              }}
              loadingStates={feedbackLoadingStates}
              isLiked={isLiked}
              isDisliked={isDisliked}
              dislikeReason={dislikeReason}
              likeCount={likeCount}
              dislikeCount={dislikeCount}
              onLike={onLike}
              onDislike={onDislike}
              onLoadingChange={updateFeedbackLoadingState}
            />
          )}
        </LeftWrapper>
        <RightWrapper>
          {config.refresh && (
            <Refresh isDisabled={isRefreshDisabled} onLoadingChange={updateRefreshLoadingState} onRefresh={onRefresh} />
          )}
        </RightWrapper>
      </OperatorContent>
    </ActionsWrapper>
  )
})

export default ItemActions
