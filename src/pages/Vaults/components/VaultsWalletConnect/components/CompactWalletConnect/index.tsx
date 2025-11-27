import { memo, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import NetworkIcon from 'components/NetworkIcon'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { vm } from 'pages/helper'
import Divider from 'components/Divider'

interface CompactWalletConnectProps {
  address: string
  formattedAddress: string
  chainId: string | number
  userAvatar?: string
  onNetworkSwitch: () => void
  onDisconnect: () => void
}

// 小巧模式样式
const WalletContainer = styled.div`
  position: relative;
  width: fit-content;
  background: ${({ theme }) => theme.black700};
  border-radius: 12px;
  padding: 12px 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
    `}
`

const WalletContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const AddressText = styled.span`
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
`

const NetworkInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`

const RotatedIcon = styled(IconBase)`
  transform: rotate(90deg);
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
  margin-left: 4px;
`

const DropdownToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;

  .icon-chat-expand {
    font-size: 16px;
    color: ${({ theme }) => theme.textL2};
    transition: transform 0.2s ease;
  }

  &:hover .icon-chat-expand {
    color: ${({ theme }) => theme.textL1};
  }

  .icon-chat-expand {
    transform: rotate(90deg);
  }

  &.open .icon-chat-expand {
    transform: rotate(-90deg);
  }
`

const DropdownMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 16px;
  background: ${({ theme }) => theme.bgL1};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transform: ${({ $show }) => ($show ? 'translateY(0)' : 'translateY(-8px)')};
  transition: all 0.2s ease;
  min-width: 120px;
`

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.textL1};
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.bgL2};
    color: ${({ theme }) => theme.textL1};
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:only-child {
    border-radius: 8px;
  }
`

const CompactWalletConnect = memo(
  ({ address, formattedAddress, chainId, userAvatar, onNetworkSwitch, onDisconnect }: CompactWalletConnectProps) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // 处理点击外部关闭下拉菜单
    useOnClickOutside(dropdownRef.current, () => {
      setShowDropdown(false)
    })

    const handleDropdownToggle = () => {
      setShowDropdown(!showDropdown)
    }

    const handleDropdownDisconnect = () => {
      setShowDropdown(false)
      onDisconnect()
    }

    return (
      <div ref={dropdownRef}>
        <WalletContainer>
          <WalletContent>
            <Avatar size={32} name={address || 'Wallet'} avatar={userAvatar} />
            <AddressText>{formattedAddress}</AddressText>
            <Divider vertical />
            <NetworkInfo onClick={onNetworkSwitch}>
              <NetworkIcon networkId={String(chainId) || '1'} size={18} />
              <RotatedIcon className='icon-chat-expand' />
            </NetworkInfo>
            <Divider vertical />
            <DropdownToggle onClick={handleDropdownToggle} className={showDropdown ? 'open' : ''}>
              <IconBase className='icon-chat-expand' />
            </DropdownToggle>
          </WalletContent>

          <DropdownMenu $show={showDropdown}>
            <DropdownItem onClick={handleDropdownDisconnect}>
              <Trans>Disconnect</Trans>
            </DropdownItem>
          </DropdownMenu>
        </WalletContainer>
      </div>
    )
  },
)

CompactWalletConnect.displayName = 'CompactWalletConnect'

export default CompactWalletConnect
