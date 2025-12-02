import styled, { css } from 'styled-components'
import { ContentWrapper } from '../../styles'
import { Trans } from '@lingui/react/macro'
import { HomeButton } from 'components/Button'
import { useAppKit } from '@reown/appkit/react'
import { useCallback } from 'react'
import { vm } from 'pages/helper'

const ConnectWalletWrapper = styled(ContentWrapper)`
  width: 480px;
  gap: 32px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(335)};
      gap: ${vm(32)};
    `}
`

const Info = styled.div`
  width: 250px;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(222)};
      font-size: 0.16rem;
      line-height: 0.24rem;
    `}
`

const ConnectButton = styled(HomeButton)``

export default function ConnectWallet() {
  const { open } = useAppKit()
  const openWallet = useCallback(() => {
    open({
      view: 'Connect',
    })
  }, [open])
  return (
    <ConnectWalletWrapper>
      <Info>
        <Trans>Unidentified user detected. Connect wallet to gain access.</Trans>
      </Info>
      <ConnectButton onClick={openWallet}>
        <Trans>Connect Wallet</Trans>
      </ConnectButton>
    </ConnectWalletWrapper>
  )
}
