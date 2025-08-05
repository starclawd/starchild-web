import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { formatNumber } from 'utils/format'
import { useIsLogin } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import { ANI_DURATION } from 'constants/index'
import { CommonTooltip } from 'components/Tooltip'
import { Trans } from '@lingui/react/macro'
import { useCurrentRouter } from 'store/application/hooks'

const SubscriberCountContainer = styled.div<{ $subscribed: boolean; $readOnly: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme, $subscribed }) => ($subscribed ? theme.blue100 : theme.textL3)};
  padding: 4px 8px;
  border-radius: 4px;
  cursor: ${({ $readOnly }) => ($readOnly ? 'default' : 'pointer')};
  transition: background-color ${ANI_DURATION}s ease;

  i {
    font-size: 18px;
  }

  ${({ theme, $readOnly }) =>
    theme.isMobile
      ? css`
          font-size: 0.12rem;
          gap: ${vm(2)};
          padding: ${vm(3)} ${vm(6)};
          border-radius: ${vm(3)};
          ${!$readOnly &&
          css`
            &:active {
              background-color: ${theme.bgT30};
            }
          `}
        `
      : css`
          ${!$readOnly &&
          css`
            &:hover {
              background-color: ${theme.bgT30};
            }
          `}
        `}
`

interface SubscriberCountProps {
  subscriberCount: number
  subscribed?: boolean
  isSelfAgent?: boolean
  readOnly?: boolean
  onClick?: () => void
}

export default memo(function SubscriberCount({
  subscriberCount,
  subscribed = false,
  isSelfAgent = false,
  readOnly = false,
  onClick,
}: SubscriberCountProps) {
  const isLogin = useIsLogin()
  const [currentRouter] = useCurrentRouter()

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (readOnly) {
      return
    }

    if (!isLogin) {
      window.location.href = getTgLoginUrl(currentRouter)
      return
    }

    if (isSelfAgent) {
      return
    }

    onClick?.()
  }

  return (
    <CommonTooltip
      placement='top'
      content={isSelfAgent ? <Trans>You cannot subscribe to the agent created by yourself.</Trans> : ''}
    >
      <SubscriberCountContainer $subscribed={subscribed} $readOnly={readOnly} onClick={handleClick}>
        <IconBase className='icon-subscription' />
        {formatNumber(subscriberCount)}
      </SubscriberCountContainer>
    </CommonTooltip>
  )
})
