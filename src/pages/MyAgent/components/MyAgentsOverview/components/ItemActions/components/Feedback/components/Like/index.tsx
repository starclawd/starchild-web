import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { LikeProps } from '../../types'

interface LikeWrapperProps {
  $isGoodFeedback?: boolean
  $isDisabled?: boolean
}

const LikeWrapper = styled.div<LikeWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ theme }) => theme.textL2};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  min-width: 32px;
  height: 32px;
  padding: 0 7px;
  border-radius: 44px;
  transition: all ${ANI_DURATION}s;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }

  .icon-chat-like-fill {
    color: ${({ theme }) => theme.jade10};
  }

  ${({ theme, $isGoodFeedback, $isDisabled }) =>
    theme.isMobile
      ? css`
          gap: ${vm(4)};
          min-width: ${vm(32)};
          height: ${vm(32)};
          padding: 0 ${vm(7)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          border-radius: ${vm(44)};
          i {
            font-size: 0.18rem;
          }
          &:active {
            background-color: ${!$isDisabled ? theme.bgT30 : 'transparent'};
          }
        `
      : css`
          cursor: ${$isDisabled ? 'not-allowed' : 'pointer'};
          &:hover {
            background-color: ${!$isDisabled ? theme.bgT30 : 'transparent'};
          }
        `}
`

const CountText = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const Like = memo(function Like({ isLiked, likeCount, isDisabled, onLoadingChange, onLike }: LikeProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()

      if (isLoading || isLiked || isDisabled || !onLike) return

      try {
        setIsLoading(true)
        onLoadingChange?.(true)
        await onLike()
      } catch (error) {
        // 错误处理交由外部处理
      } finally {
        setIsLoading(false)
        onLoadingChange?.(false)
      }
    },
    [isLoading, isLiked, isDisabled, onLike, onLoadingChange],
  )

  // 显示计数的条件：有计数且大于0，或者已点赞
  const showCount = (likeCount !== undefined && likeCount > 0) || isLiked

  return (
    <LikeWrapper $isGoodFeedback={isLiked} $isDisabled={isDisabled || isLiked} onClick={handleLike}>
      {isLoading ? <Pending /> : <IconBase className={!isLiked ? 'icon-chat-like' : 'icon-chat-like-fill'} />}
      {showCount && <CountText>{likeCount || 0}</CountText>}
    </LikeWrapper>
  )
})

export default Like
