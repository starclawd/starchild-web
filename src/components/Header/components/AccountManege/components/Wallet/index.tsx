import styled, { css } from 'styled-components'
import Icon from '../Icon'
import { useUserInfo } from 'store/login/hooks'
import { useCallback } from 'react'
import { useBindWalletModalToggle } from 'store/application/hooks'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const ChainLabel = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.16rem;
    `}
`

const AddressWithLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 0.02rem;
    `}
`

/**
 * 格式化钱包地址显示
 * @param address - 完整的钱包地址
 * @returns 格式化后的地址（前6位...后4位）
 */
const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function Wallet() {
  const [{ evmAddress, solanaAddress }] = useUserInfo()
  const toggleBindWalletModal = useBindWalletModalToggle()

  const handleWalletBind = useCallback(() => {
    toggleBindWalletModal()
  }, [toggleBindWalletModal])

  const handleEditWallet = useCallback(() => {
    toggleBindWalletModal()
  }, [toggleBindWalletModal])

  // 如果两个地址都为空，显示绑定按钮
  if (!evmAddress && !solanaAddress) {
    return (
      <WalletWrapper>
        <Icon iconName='icon-chat-upload' onClick={handleWalletBind} />
      </WalletWrapper>
    )
  }

  return (
    <WalletWrapper>
      {/* EVM 地址 */}
      <WalletItem>
        {evmAddress ? (
          <AddressWithLabel>
            <Address>{formatAddress(evmAddress)}</Address>
            <ChainLabel>(BASE)</ChainLabel>
          </AddressWithLabel>
        ) : (
          <AddressWithLabel>
            <Address>-</Address>
            <ChainLabel>(BASE)</ChainLabel>
          </AddressWithLabel>
        )}
        <Icon iconName='icon-chat-upload' onClick={handleEditWallet} />
      </WalletItem>

      {/* Solana 地址 */}
      <WalletItem>
        {solanaAddress ? (
          <AddressWithLabel>
            <Address>{formatAddress(solanaAddress)}</Address>
            <ChainLabel>(SOLANA)</ChainLabel>
          </AddressWithLabel>
        ) : (
          <AddressWithLabel>
            <Address>-</Address>
            <ChainLabel>(SOLANA)</ChainLabel>
          </AddressWithLabel>
        )}
        <Icon iconName='icon-chat-upload' onClick={handleEditWallet} />
      </WalletItem>
    </WalletWrapper>
  )
}
