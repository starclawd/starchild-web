import styled, { css } from 'styled-components'
import Icon from '../Icon'
import { useCallback } from 'react'
import { useBindWalletModalToggle } from 'store/application/hooks'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
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
  const toggleBindWalletModal = useBindWalletModalToggle()

  const handleWalletBind = useCallback(() => {
    toggleBindWalletModal()
  }, [toggleBindWalletModal])

  const handleEditWallet = useCallback(() => {
    toggleBindWalletModal()
  }, [toggleBindWalletModal])

  // 使用假的地址数据进行测试
  const addresses: string[] = []
  const addressCount = addresses.length

  // 如果没有地址，显示绑定按钮
  if (addressCount === 0) {
    return (
      <WalletWrapper>
        <Icon iconName='icon-chat-upload' onClick={handleWalletBind} />
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
            <ChainLabel>(BASE)</ChainLabel>
          </AddressWithLabel>
          <Icon iconName='icon-edit' onClick={handleEditWallet} />
          <Icon iconName='icon-chat-upload' onClick={handleWalletBind} />
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
            <ChainLabel>{index === 0 ? '(BASE)' : '(SOLANA)'}</ChainLabel>
          </AddressWithLabel>
          <Icon iconName='icon-edit' onClick={handleEditWallet} />
        </WalletItem>
      ))}
    </WalletWrapper>
  )
}
