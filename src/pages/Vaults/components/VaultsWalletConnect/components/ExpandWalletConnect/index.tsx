import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { Address } from 'viem'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import NetworkIcon from 'components/NetworkIcon'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import Divider from 'components/Divider'
import { vm } from 'pages/helper'
import { CHAIN_ID } from 'constants/chainInfo'
import NetworkSelector, { ColorMode } from '../NetworkSelector'
import OperationSelector, { ColorMode as OperationColorMode } from '../OperationSelector'
import { useTheme } from 'store/themecache/hooks'

interface NormalWalletConnectProps {
  address: string
  formattedAddress: string
  formattedBalance: string
  isLoadingBalance: boolean
  userAvatar?: string
  onDisconnect: () => void
  onCopy: () => void
  isConnected: boolean
  isPending: boolean
  onConnect: () => void
}

// 普通模式样式
const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  background: ${({ theme }) => theme.brand100};
  padding: 16px;
  width: 100%;
  border-radius: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
    `}
`

const WalletTitle = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.black1000};

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
  gap: 2px;
  flex: 1;
`

const AddressRow = styled.div`
  display: flex;
`

const AddressText = styled.span`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.black1000};
`

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const BalanceText = styled.span`
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black1000};
`

const BalanceLabel = styled.span`
  font-weight: 400;
`

// 未连接时的样式组件
const UnconnectedContainer = styled.div`
  background: ${({ theme }) => theme.brand100};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  gap: 12px;
  border-radius: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
      border-radius: ${vm(12)};
    `}
`

// 左侧内容容器
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

// 右侧内容容器
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const UnconnectedContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const UnconnectedWalletTitle = styled.h3`
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.black1000};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
    `}
`

const UnconnectedWalletSubtitle = styled.p`
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.black1000};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
    `}
`

const ConnectButton = styled(ButtonCommon)`
  background: ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.black1000};
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  width: fit-content;
  height: 28px;
  background-color: transparent;
  padding: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(24)};
      font-size: ${vm(14)};
      border-radius: ${vm(24)};
      min-width: ${vm(140)};
    `}
`

// 默认钱包图标
const DefaultWalletIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
    `}
`

const NormalWalletConnect = memo(
  ({
    address,
    formattedAddress,
    formattedBalance,
    isLoadingBalance,
    userAvatar,
    onDisconnect,
    onCopy,
    isConnected,
    isPending,
    onConnect,
  }: NormalWalletConnectProps) => {
    const theme = useTheme()
    // 未连接钱包时的UI
    if (!isConnected) {
      return (
        <UnconnectedContainer>
          <LeftSection>
            {userAvatar ? <Avatar size={40} name={address || 'Wallet'} avatar={userAvatar} /> : <DefaultWalletIcon />}
            <UnconnectedContentSection>
              <UnconnectedWalletTitle>
                <Trans>My wallet</Trans>
              </UnconnectedWalletTitle>
              <UnconnectedWalletSubtitle>
                <Trans>Use Vaults with Starchild AI</Trans>
              </UnconnectedWalletSubtitle>
            </UnconnectedContentSection>
          </LeftSection>
          <RightSection>
            <NetworkSelector />
            <ConnectButton as='button' onClick={onConnect} $pending={isPending} $disabled={isPending}>
              {isPending ? <Trans>Connecting...</Trans> : <Trans>Connect wallet</Trans>}
            </ConnectButton>
          </RightSection>
        </UnconnectedContainer>
      )
    }

    // 已连接钱包时的UI
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

          <NetworkSelector colorMode={ColorMode.BRAND} />
          <Divider vertical color={theme.black700} />
          <OperationSelector
            expandMode={true}
            onDisconnect={onDisconnect}
            onCopy={onCopy}
            colorMode={OperationColorMode.BRAND}
          />
        </WalletContent>
      </WalletContainer>
    )
  },
)

NormalWalletConnect.displayName = 'NormalWalletConnect'

export default NormalWalletConnect
