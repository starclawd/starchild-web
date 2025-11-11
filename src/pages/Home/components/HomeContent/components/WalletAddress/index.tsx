import { Trans } from '@lingui/react/macro'
import Avatar from 'components/Avatar'
import { MOBILE_DESIGN_WIDTH } from 'constants/index'
import { useWindowSize } from 'hooks/useWindowSize'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { useUserInfo } from 'store/login/hooks'
import styled, { css } from 'styled-components'
import { formatAddress, getChainLabel } from 'utils'

const WalletAddressWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  width: 100%;
  height: 56px;
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.8);
  > span {
    display: flex;
    flex-direction: column;
    gap: 2px;
    span:first-child {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.textL3};
    }
    span:last-child {
      font-size: 13px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.textL1};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      height: auto;
      padding: ${vm(8)} ${vm(12)};
      border-radius: ${vm(12)};
      > span {
        gap: ${vm(2)};
        span:first-child {
          font-size: 0.12rem;
          line-height: 0.18rem;
        }
        span:last-child {
          font-size: 0.13rem;
          line-height: 0.2rem;
          word-break: break-all;
        }
      }
    `}
`

export default function WalletAddress() {
  const isMobile = useIsMobile()
  const { width } = useWindowSize()
  const [{ walletAddress, secondaryWalletAddress }] = useUserInfo()
  if (!walletAddress && !secondaryWalletAddress) return null
  return (
    <WalletAddressWrapper>
      <Avatar
        size={isMobile ? (32 / MOBILE_DESIGN_WIDTH) * (width || MOBILE_DESIGN_WIDTH) : 32}
        name={walletAddress || walletAddress || ''}
      />
      <span>
        <span>
          <Trans>Your wallet address</Trans>
        </span>
        <span>
          {walletAddress ? `${formatAddress(walletAddress)} (${getChainLabel(walletAddress)})` : ''}&nbsp;
          {secondaryWalletAddress
            ? `${formatAddress(secondaryWalletAddress)} (${getChainLabel(secondaryWalletAddress)})`
            : ''}
        </span>
      </span>
    </WalletAddressWrapper>
  )
}
