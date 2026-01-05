import styled, { css } from 'styled-components'
import { memo, useState, useCallback } from 'react'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import DislikeModal from './components/DislikeModal'
import { AgentFeedbackProps, LoadingStates } from './types'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import useSubErrorInfo from 'hooks/useSubErrorInfo'

const FeedbackWrapper = styled.div`
  position: relative;
  bottom: 0;
  width: 100%;
  align-items: flex-end;

  .transition-wrapper {
    width: 100%;
  }
`

interface FeedbackContainerProps {
  $hasSelectedState: boolean
}

const FeedbackContainer = styled.div<FeedbackContainerProps>`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.black600};
  border-radius: 6px;
  overflow: hidden;
  transition: all ${ANI_DURATION}s;
  padding: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(6)};
      padding: ${vm(4)};
    `}
`

interface FeedbackButtonProps {
  $isSelected: boolean
  $isDisabled: boolean
  $type: 'like' | 'dislike'
}

const FeedbackButton = styled.div<FeedbackButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  color: ${({ theme }) => theme.black100};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  transition: all ${ANI_DURATION}s;
  flex: 1;
  position: relative;
  border-radius: 4px;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.black500};
    transition: all ${ANI_DURATION}s;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      padding: ${vm(4)};
      font-size: 0.14rem;
      line-height: 0.2rem;
      border-radius: ${vm(4)};

      i {
        font-size: 0.18rem;
      }
    `}

  /* Selected状态样式 */
  ${({ theme, $isSelected, $type }) =>
    $isSelected &&
    css`
      background: ${theme.black800};
      color: ${$type === 'like' ? theme.brand100 : theme.yellow200};

      i {
        color: ${$type === 'like' ? theme.brand100 : theme.yellow200};
      }
    `}

  /* Hover状态 */
  ${({ theme, $isDisabled, $isSelected }) =>
    !theme.isMobile &&
    !$isDisabled &&
    !$isSelected &&
    css`
      &:hover {
        background: ${theme.black800};
      }
    `}

  /* 移动端Active状态 */
  ${({ theme, $isDisabled, $isSelected }) =>
    theme.isMobile &&
    !$isDisabled &&
    !$isSelected &&
    css`
      &:active {
        background: ${theme.black800};
      }
    `}
`

const CountText = styled.span`
  color: ${({ theme }) => theme.black200};
`

const Feedback = memo(function Feedback({
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
  // 内部状态管理
  const [internalLoadingStates, setInternalLoadingStates] = useState<LoadingStates>({
    like: false,
    dislike: false,
  })
  const [isShowDislikeModal, setIsShowDislikeModal] = useState(false)
  const subErrorInfo = useSubErrorInfo()

  // 使用外部状态或内部状态
  const loadingStates = externalLoadingStates || internalLoadingStates

  // 状态更新函数
  const updateLoadingState = useCallback(
    (type: keyof LoadingStates, isLoading: boolean) => {
      if (externalLoadingStates && externalOnLoadingChange) {
        externalOnLoadingChange(type, isLoading)
      } else {
        setInternalLoadingStates((prev) => ({
          ...prev,
          [type]: isLoading,
        }))
      }
    },
    [externalLoadingStates, externalOnLoadingChange],
  )

  // 显示计数的条件
  const hasSelectedState = isLiked || isDisliked

  const handleLike = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (loadingStates.like || hasSelectedState || !onLike) return

      if (subErrorInfo()) {
        return
      }

      try {
        updateLoadingState('like', true)
        await onLike()
      } catch (error) {
        // 错误处理交由外部处理
      } finally {
        updateLoadingState('like', false)
      }
    },
    [subErrorInfo, loadingStates.like, hasSelectedState, onLike, updateLoadingState],
  )

  const handleDislike = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()

      if (isDisliked || hasSelectedState) return

      if (subErrorInfo()) {
        return
      }

      setIsShowDislikeModal(true)
    },
    [subErrorInfo, isDisliked, hasSelectedState],
  )

  return (
    <FeedbackWrapper className='feedback-wrapper'>
      <FeedbackContainer $hasSelectedState={!!hasSelectedState}>
        {/* Like按钮 */}
        <FeedbackButton $isSelected={!!isLiked} $isDisabled={!!hasSelectedState} $type='like' onClick={handleLike}>
          {loadingStates.like ? <Pending /> : <IconBase className={'icon-like'} />}
          <Trans>Like</Trans>
          <CountText>({likeCount || 0})</CountText>
        </FeedbackButton>

        {/* Dislike按钮 */}
        <FeedbackButton
          $isSelected={!!isDisliked}
          $isDisabled={!!hasSelectedState}
          $type='dislike'
          onClick={handleDislike}
        >
          <IconBase className={'icon-dislike'} />
          <Trans>Dislike</Trans>
          <CountText>({dislikeCount || 0})</CountText>
        </FeedbackButton>
      </FeedbackContainer>

      {/* Dislike模态框 */}
      {isShowDislikeModal && (
        <DislikeModal
          isShowDislikeModal={isShowDislikeModal}
          setIsShowDislikeModal={setIsShowDislikeModal}
          onLoadingChange={(loading: boolean) => updateLoadingState('dislike', loading)}
          onDislike={onDislike}
        />
      )}
    </FeedbackWrapper>
  )
})

export default Feedback
