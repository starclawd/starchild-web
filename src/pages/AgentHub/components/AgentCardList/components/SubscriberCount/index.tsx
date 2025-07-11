import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { formatNumber } from 'utils/format'

const SubscriberCountContainer = styled.div<{ $subscribed: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${({ theme, $subscribed }) => ($subscribed ? theme.blue100 : theme.textL3)};
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  i {
    font-size: 18px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.bgL2};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
      gap: ${vm(2)};
      padding: ${vm(3)} ${vm(6)};
      border-radius: ${vm(3)};
    `}
`

interface SubscriberCountProps {
  subscriberCount: number
  subscribed?: boolean
  onClick?: () => void
}

export default memo(function SubscriberCount({ subscriberCount, subscribed = false, onClick }: SubscriberCountProps) {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onClick?.()
  }

  return (
    <SubscriberCountContainer $subscribed={subscribed} onClick={handleClick}>
      <IconBase className='icon-chat-noti-enable' />
      {formatNumber(subscriberCount)}
    </SubscriberCountContainer>
  )
})
