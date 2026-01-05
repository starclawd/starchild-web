import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { formatNumber } from 'utils/format'
import { useIsLogin } from 'store/login/hooks'
import { ANI_DURATION } from 'constants/index'
import Tooltip from 'components/Tooltip'
import { Trans } from '@lingui/react/macro'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const SubscriberCountContainer = styled.div<{ $subscribed: boolean; $readOnly: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme, $subscribed }) => ($subscribed ? theme.brand100 : theme.black200)};
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
              background-color: ${theme.black600};
            }
          `}
        `
      : css`
          ${!$readOnly &&
          css`
            &:hover {
              background-color: ${theme.black600};
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
  const [, setCurrentRouter] = useCurrentRouter()

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (readOnly) {
      return
    }

    if (!isLogin) {
      setCurrentRouter(`${ROUTER.HOME}?login=1`)
      return
    }

    if (isSelfAgent) {
      return
    }

    onClick?.()
  }

  return (
    <Tooltip
      placement='top'
      content={isSelfAgent ? <Trans>You cannot subscribe to the agent created by yourself.</Trans> : ''}
    >
      <SubscriberCountContainer $subscribed={subscribed && !isSelfAgent} $readOnly={readOnly} onClick={handleClick}>
        <IconBase className='icon-subscription' />
        {formatNumber(subscriberCount)}
      </SubscriberCountContainer>
    </Tooltip>
  )
})
