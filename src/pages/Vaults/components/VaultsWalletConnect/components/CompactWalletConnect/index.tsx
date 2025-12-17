import { memo } from 'react'
import styled, { css } from 'styled-components'
import Avatar from 'components/Avatar'
import { vm } from 'pages/helper'
import Divider from 'components/Divider'
import OperationSelector, { ColorMode as OperationColorMode } from '../OperationSelector'
import NetworkSelector, { ColorMode } from '../NetworkSelector'
import { useAppKitAccount } from '@reown/appkit/react'

interface CompactWalletConnectProps {
  address: string
  formattedAddress: string
  userAvatar?: string
  isCreateStrategy?: boolean
  onDisconnect: () => void
  onCopy: () => void
}

// 小巧模式样式
const WalletContainer = styled.div`
  position: relative;
  width: fit-content;
  background: ${({ theme }) => theme.black700};
  border-radius: 40px;
  padding: 4px 8px 4px 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
    `}
`

const WalletContent = styled.div<{ $isCreateStrategy: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;
  ${({ $isCreateStrategy }) =>
    $isCreateStrategy &&
    css`
      gap: 8px;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const AddressText = styled.span<{ $isCreateStrategy: boolean }>`
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
  ${({ $isCreateStrategy }) =>
    $isCreateStrategy &&
    css`
      margin-left: -4px;
    `}
`

const CompactWalletConnect = memo(
  ({
    address,
    formattedAddress,
    userAvatar,
    onDisconnect,
    onCopy,
    isCreateStrategy = false,
  }: CompactWalletConnectProps) => {
    const { isConnected } = useAppKitAccount()
    return (
      <WalletContainer>
        <WalletContent $isCreateStrategy={isCreateStrategy}>
          <Avatar size={isCreateStrategy ? 24 : 32} name={address || 'Wallet'} avatar={userAvatar} />
          {isConnected && <AddressText $isCreateStrategy={isCreateStrategy}>{formattedAddress}</AddressText>}
          <Divider vertical />
          <NetworkSelector colorMode={ColorMode.DARK} compactMode={true} />
          <Divider vertical />
          <OperationSelector
            isCreateStrategy={isCreateStrategy}
            onDisconnect={onDisconnect}
            onCopy={onCopy}
            colorMode={OperationColorMode.DARK}
          />
        </WalletContent>
      </WalletContainer>
    )
  },
)

CompactWalletConnect.displayName = 'CompactWalletConnect'

export default CompactWalletConnect
