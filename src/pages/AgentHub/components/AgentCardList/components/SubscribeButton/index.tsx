import { memo, useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import Pending from 'components/Pending'

const StyledButton = styled(ButtonCommon)<{
  $isSubscribed: boolean
  $size: 'large' | 'medium'
  $width?: string
}>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: ${({ $width }) => $width || '100%'};
  color: ${({ theme, $isSubscribed }) => ($isSubscribed ? theme.textL2 : theme.textL1)};
  background: ${({ theme, $isSubscribed }) => ($isSubscribed ? theme.bgT30 : theme.brand200)};

  .pending-wrapper {
    .icon-loading {
      color: ${({ theme }) => theme.textL1};
    }
  }

  ${({ $size }) =>
    $size === 'large'
      ? css`
          height: 60px;
          font-size: 16px;
          padding: 0 12px;
          .icon-subscription,
          .icon-chat-noti-enable {
            font-size: 24px;
          }
        `
      : css`
          height: 40px;
          font-size: 14px;
          padding: 0 12px;
          .icon-subscription,
          .icon-chat-noti-enable {
            font-size: 18px;
          }
        `}

  &:hover {
    opacity: 0.7;
  }

  ${({ theme, $size }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
      ${$size === 'large'
        ? css`
            height: ${vm(60)};
            font-size: 0.16rem;
            padding: 0 ${vm(12)};
            .icon-subscription,
            .icon-chat-noti-enable {
              font-size: 0.24rem;
            }
          `
        : css`
            height: ${vm(40)};
            font-size: 0.14rem;
            padding: 0 ${vm(12)};
            .icon-subscription,
            .icon-chat-noti-enable {
              font-size: 0.18rem;
            }
          `}
    `}
`

interface SubscribeButtonProps {
  isSubscribed: boolean
  onClick: () => void
  size?: 'large' | 'medium'
  width?: string
  className?: string
  disabled?: boolean
  pending?: boolean
}

export default memo(function SubscribeButton({
  isSubscribed,
  onClick,
  size = 'large',
  width,
  className,
  disabled,
  pending,
}: SubscribeButtonProps) {
  const iconClass = useMemo(() => {
    return isSubscribed ? 'icon-chat-noti-enable' : 'icon-subscription'
  }, [isSubscribed])

  const buttonText = useMemo(() => {
    return isSubscribed ? t`Unsubscribe` : t`Subscribe`
  }, [isSubscribed])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onClick()
    },
    [onClick],
  )

  return (
    <StyledButton
      $isSubscribed={isSubscribed}
      $size={size}
      $width={width}
      onClick={handleClick}
      className={className}
      $disabled={disabled}
    >
      {pending ? (
        <Pending />
      ) : (
        <>
          <IconBase className={iconClass} />
          <Trans>{buttonText}</Trans>
        </>
      )}
    </StyledButton>
  )
})
