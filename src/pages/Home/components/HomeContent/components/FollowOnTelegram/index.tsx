import { Trans } from '@lingui/react/macro'
import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import WalletAddress from '../WalletAddress'
import { HomeButton } from 'components/Button'
import { vm } from 'pages/helper'

const FollowOnTelegramWrapper = styled(ContentWrapper)`
  width: 480px;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(335)};
      gap: ${vm(16)};
    `}
`

const Text = styled.span`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  white-space: pre-line;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.18rem;
      line-height: 0.26rem;
    `}
`

const ButtonJoin = styled(HomeButton)`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(180)};
    `}
`

export default function FollowOnTelegram() {
  return (
    <FollowOnTelegramWrapper>
      <WalletAddress />
      <Text>
        <Trans>
          You have joined the waitlist.
          <br /> Soon, you will be notified. Watch for the signs.
        </Trans>
      </Text>
      <ButtonJoin>
        <Trans>Follow on Telegram</Trans>
      </ButtonJoin>
    </FollowOnTelegramWrapper>
  )
}
