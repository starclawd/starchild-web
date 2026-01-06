import styled, { css } from 'styled-components'
import { useCallback } from 'react'
import { useOpenBindWalletModal } from 'store/application/hooks'
import { useUserInfo } from 'store/login/hooks'
import { useDisconnect } from '@reown/appkit/react'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  .icon-menu-chat,
  .icon-edit {
    cursor: pointer;
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black200};
    &:hover {
      color: ${({ theme }) => theme.black0};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 0.08rem;
    `}
`

const WalletItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 0.08rem;
    `}
`

const Address = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const ChainLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const AddressWithLabel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 0.02rem;
    `}
`

export default function Wallet() {
  const openBindWalletModal = useOpenBindWalletModal()
  const [{ walletAddress, secondaryWalletAddress }] = useUserInfo()
  const { disconnect } = useDisconnect()

  const formatAddress = useCallback((address: string): string => {
    if (!address || address.length < 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  const getChainLabel = useCallback((address: string): string => {
    return address.startsWith('0x') ? 'EVM' : 'SOLANA'
  }, [])

  const disconnectWallet = useCallback(async () => {
    await disconnect()
  }, [disconnect])

  const handleWalletBind = useCallback(async () => {
    await disconnectWallet()
    openBindWalletModal()
  }, [openBindWalletModal, disconnectWallet])

  const handleEditWallet = useCallback(
    async (address: string) => {
      await disconnectWallet()
      openBindWalletModal(address)
    },
    [openBindWalletModal, disconnectWallet],
  )

  // 过滤掉空字符串的地址
  const addresses: string[] = [walletAddress, secondaryWalletAddress].filter(
    (address) => address && address.trim() !== '',
  )
  const addressCount = addresses.length

  // 如果没有地址，显示绑定按钮
  if (addressCount === 0) {
    return (
      <WalletWrapper>
        <IconBase className='icon-menu-chat' onClick={handleWalletBind} />
      </WalletWrapper>
    )
  }

  // 如果只有一个地址
  if (addressCount === 1) {
    return (
      <WalletWrapper>
        <WalletItem>
          <AddressWithLabel>
            <Address>{formatAddress(addresses[0])}</Address>
            <ChainLabel>({getChainLabel(addresses[0])})</ChainLabel>
          </AddressWithLabel>
          <IconBase className='icon-edit' onClick={() => handleEditWallet(addresses[0])} />
          <IconBase className='icon-menu-chat' onClick={handleWalletBind} />
        </WalletItem>
      </WalletWrapper>
    )
  }

  // 如果有两个地址
  return (
    <WalletWrapper>
      {addresses.map((address, index) => (
        <WalletItem key={index}>
          <AddressWithLabel>
            <Address>{formatAddress(address)}</Address>
            <ChainLabel>({getChainLabel(address)})</ChainLabel>
          </AddressWithLabel>
          <IconBase className='icon-edit' onClick={() => handleEditWallet(address)} />
        </WalletItem>
      ))}
    </WalletWrapper>
  )
}
