import styled, { css } from 'styled-components'
import { memo, useMemo, useState } from 'react'
import { vm } from 'pages/helper'
import Copy from './components/Copy'
import Like from './components/Like'
import Dislike from './components/Dislike'
import Refresh from './components/Refresh'
import { AgentFeedbackProps, LoadingStates } from './types'

const FeedbackWrapper = styled.div`
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

const Feedback = memo(function Feedback({
  responseContentRef,
  config = {
    copy: true,
    like: true,
    dislike: true,
    refresh: true,
  },
  loadingStates: externalLoadingStates,
  isLiked,
  isDisliked,
  dislikeReason,
  onLike,
  onDislike,
  onRefresh,
}: AgentFeedbackProps) {
  // 内部状态管理 - 当外部没有传入loadingStates时使用
  const [internalLoadingStates, setInternalLoadingStates] = useState<LoadingStates>({
    like: false,
    dislike: false,
    refresh: false,
  })

  // 使用外部状态或内部状态
  const loadingStates = externalLoadingStates || internalLoadingStates

  // 状态更新函数 - 只在使用内部状态时生效
  const updateLoadingState = (type: keyof LoadingStates, isLoading: boolean) => {
    if (!externalLoadingStates) {
      setInternalLoadingStates((prev) => ({
        ...prev,
        [type]: isLoading,
      }))
    }
  }

  // 计算禁用状态 - 当有任一操作在进行时，其他操作应被禁用
  const isAnyLoading = Object.values(loadingStates).some(Boolean)
  const isLikeDisabled = isAnyLoading && !loadingStates.like
  const isDislikeDisabled = isAnyLoading && !loadingStates.dislike
  const isRefreshDisabled = isAnyLoading && !loadingStates.refresh
  return (
    <FeedbackWrapper className='feedback-wrapper'>
      <OperatorContent>
        <LeftWrapper>
          {config.copy && <Copy responseContentRef={responseContentRef} />}
          {config.like && !isDisliked && (
            <Like
              isLiked={isLiked}
              isDisabled={isLikeDisabled || isLiked}
              onLoadingChange={(loading: boolean) => updateLoadingState('like', loading)}
              onLike={onLike}
            />
          )}
          {config.dislike && !isLiked && (
            <Dislike
              isDisliked={isDisliked}
              dislikeReason={dislikeReason}
              isDisabled={isDislikeDisabled || isDisliked}
              onLoadingChange={(loading: boolean) => updateLoadingState('dislike', loading)}
              onDislike={onDislike}
            />
          )}
        </LeftWrapper>
        <RightWrapper>
          {config.refresh && (
            <Refresh
              isDisabled={isRefreshDisabled}
              onLoadingChange={(loading: boolean) => updateLoadingState('refresh', loading)}
              onRefresh={onRefresh}
            />
          )}
        </RightWrapper>
      </OperatorContent>
    </FeedbackWrapper>
  )
})

export default Feedback
