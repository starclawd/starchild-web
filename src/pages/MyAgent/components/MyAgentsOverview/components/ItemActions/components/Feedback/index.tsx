import styled, { css } from 'styled-components'
import { memo, useState } from 'react'
import { vm } from 'pages/helper'
import Like from './components/Like'
import Dislike from './components/Dislike'
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
  gap: 8px;
  width: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const Feedback = memo(function Feedback({
  config = {
    like: true,
    dislike: true,
  },
  loadingStates: externalLoadingStates,
  isLiked,
  isDisliked,
  dislikeReason,
  likeCount,
  dislikeCount,
  onLike,
  onDislike,
  onLoadingChange: externalOnLoadingChange,
}: AgentFeedbackProps) {
  // 内部状态管理 - 当外部没有传入loadingStates时使用
  const [internalLoadingStates, setInternalLoadingStates] = useState<LoadingStates>({
    like: false,
    dislike: false,
  })

  // 使用外部状态或内部状态
  const loadingStates = externalLoadingStates || internalLoadingStates

  // 状态更新函数 - 处理内部状态或通知外部状态变化
  const updateLoadingState = (type: keyof LoadingStates, isLoading: boolean) => {
    if (externalLoadingStates && externalOnLoadingChange) {
      // 使用外部状态时，通知父组件状态变化
      externalOnLoadingChange(type, isLoading)
    } else {
      // 使用内部状态时，直接更新内部状态
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
  return (
    <FeedbackWrapper className='feedback-wrapper'>
      <OperatorContent>
        {config.like && !isDisliked && (
          <Like
            isLiked={isLiked}
            likeCount={likeCount}
            isDisabled={isLikeDisabled || isLiked}
            onLoadingChange={(loading: boolean) => updateLoadingState('like', loading)}
            onLike={onLike}
          />
        )}
        {config.dislike && !isLiked && (
          <Dislike
            isDisliked={isDisliked}
            dislikeReason={dislikeReason}
            dislikeCount={dislikeCount}
            isDisabled={isDislikeDisabled || isDisliked}
            onLoadingChange={(loading: boolean) => updateLoadingState('dislike', loading)}
            onDislike={onDislike}
          />
        )}
      </OperatorContent>
    </FeedbackWrapper>
  )
})

export default Feedback
