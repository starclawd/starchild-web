import { memo } from 'react'
import styled from 'styled-components'
import Avatar from 'components/Avatar'
import Divider from 'components/Divider'
import OperationSelector, { ColorMode as OperationColorMode } from '../OperationSelector'
import NetworkSelector, { ColorMode } from '../NetworkSelector'
import { useAppKitAccount } from '@reown/appkit/react'
import { useTheme } from 'store/themecache/hooks'

interface CompactWalletConnectProps {
  address: string
  formattedAddress: string
  userAvatar?: string
  onDisconnect: () => void
  onCopy: () => void
}

// 小巧模式样式
const WalletContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const AddressText = styled.span`
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.black0};
`

const CompactWalletConnect = memo(
  ({ address, formattedAddress, userAvatar, onDisconnect, onCopy }: CompactWalletConnectProps) => {
    const { isConnected } = useAppKitAccount()
    const theme = useTheme()
    return (
      <WalletContainer>
        <NetworkSelector colorMode={ColorMode.DARK} />
        <Divider vertical color={theme.black700} />
        <UserInfo>
          <Avatar size={24} name={address || 'Wallet'} avatar={userAvatar} />
          {isConnected && <AddressText>{formattedAddress}</AddressText>}
        </UserInfo>
        <OperationSelector onDisconnect={onDisconnect} onCopy={onCopy} colorMode={OperationColorMode.DARK} />
      </WalletContainer>
    )
  },
)

CompactWalletConnect.displayName = 'CompactWalletConnect'

export default CompactWalletConnect
