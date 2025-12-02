import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { Address } from 'viem'
import { ButtonBorder } from 'components/Button'
import NetworkIcon from 'components/NetworkIcon'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import Divider from 'components/Divider'
import { vm } from 'pages/helper'
import { CHAIN_ID } from 'constants/chainInfo'

interface NormalWalletConnectProps {
  address: string
  chainId: string | number
  formattedAddress: string
  formattedBalance: string
  isLoadingBalance: boolean
  userAvatar?: string
  onNetworkSwitch: () => void
  onDisconnect: () => void
}

// 普通模式样式
const WalletContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.black700};
  border-radius: 12px;
  padding: 12px 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
    `}
`

const WalletTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL3};
  line-height: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
      margin-bottom: ${vm(16)};
    `}
`

const WalletContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const AddressText = styled.span`
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
`

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const BalanceText = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};
`

const BalanceLabel = styled.span`
  color: ${({ theme }) => theme.textL4};
`

const RotatedIcon = styled(IconBase)`
  transform: rotate(90deg);
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
  margin-left: 4px;
`

const NetworkInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`

const DisconnectButton = styled(ButtonBorder)`
  width: fit-content;
  padding: 8px 12px;
  height: 30px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL2};
`

const NormalWalletConnect = memo(
  ({
    address,
    chainId,
    formattedAddress,
    formattedBalance,
    isLoadingBalance,
    userAvatar,
    onNetworkSwitch,
    onDisconnect,
  }: NormalWalletConnectProps) => {
    return (
      <WalletContainer>
        <WalletTitle>
          <Trans>My Wallet</Trans>
        </WalletTitle>

        <WalletContent>
          <WalletInfo>
            <Avatar size={40} name={address || 'Wallet'} avatar={userAvatar} />

            <InfoContent>
              <AddressRow>
                <AddressText>{formattedAddress}</AddressText>
                <Divider vertical />
                <NetworkInfo onClick={onNetworkSwitch}>
                  <NetworkIcon networkId={String(chainId) || String(CHAIN_ID.BASE)} size={18} />
                  <RotatedIcon className='icon-chat-expand' />
                </NetworkInfo>
              </AddressRow>

              <BalanceContainer>
                <BalanceText>
                  <BalanceLabel>
                    <Trans>Available:</Trans>
                  </BalanceLabel>{' '}
                  {isLoadingBalance ? <Trans>Loading...</Trans> : `${formattedBalance} USDC`}
                </BalanceText>
              </BalanceContainer>
            </InfoContent>
          </WalletInfo>

          <DisconnectButton onClick={onDisconnect}>
            <Trans>Disconnect</Trans>
          </DisconnectButton>
        </WalletContent>
      </WalletContainer>
    )
  },
)

NormalWalletConnect.displayName = 'NormalWalletConnect'

export default NormalWalletConnect
