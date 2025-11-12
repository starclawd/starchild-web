import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { DislikeProps } from '../../types'
import DislikeModal from '../DislikeModal'
import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

interface DislikeWrapperProps {
  $isBadFeedback?: boolean
}

const DislikeWrapper = styled.div<DislikeWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }

  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.ruby50};
  }

  .icon-chat-dislike-fill {
    color: ${({ theme }) => theme.ruby50};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          min-width: ${vm(32)};
          height: ${vm(32)};
          padding: 0 ${vm(7)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          border-radius: ${vm(44)};
          i {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.12rem;
            font-weight: 400;
            line-height: 0.18rem;
          }
          &:active {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `
      : css`
          &:hover {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `}

  ${({ theme, $isBadFeedback }) =>
    $isBadFeedback &&
    css`
      gap: 4px;
      border: 1px solid ${theme.bgT30};
      border-radius: 32px;
      cursor: default;

      i {
        color: ${theme.red100};
      }
      span {
        color: ${theme.red100};
      }

      ${theme.isMobile &&
      css`
        gap: ${vm(4)};
        border-radius: ${vm(32)};
      `}
    `}
`

const Dislike = memo(function Dislike({
  isDisliked,
  dislikeReason,
  isDisabled,
  onLoadingChange,
  onDislike,
}: DislikeProps) {
  const [isShowDislikeModal, setIsShowDislikeModal] = useState(false)

  const disliseReasonMap = useMemo(() => {
    const data = {
      Inaccurate: <Trans>Inaccurate</Trans>,
      Offensive: <Trans>Offensive</Trans>,
      Useless: <Trans>Useless</Trans>,
    }
    return data[dislikeReason as keyof typeof data] || <Trans>Other</Trans>
  }, [dislikeReason])

  const handleDislike = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (isDisliked || isDisabled) return
      setIsShowDislikeModal(true)
    },
    [isDisliked, isDisabled],
  )

  return (
    <>
      <DislikeWrapper $isBadFeedback={isDisliked} onClick={handleDislike}>
        <IconBase className={!isDisliked ? 'icon-chat-dislike' : 'icon-chat-dislike-fill'} />
        {isDisliked && <span>{disliseReasonMap}</span>}
      </DislikeWrapper>

      {isShowDislikeModal && (
        <DislikeModal
          isShowDislikeModal={isShowDislikeModal}
          setIsShowDislikeModal={setIsShowDislikeModal}
          onLoadingChange={onLoadingChange}
          onDislike={onDislike}
        />
      )}
    </>
  )
})

export default Dislike
