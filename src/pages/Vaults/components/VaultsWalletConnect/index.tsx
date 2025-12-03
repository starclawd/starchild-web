import { memo, useMemo, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import { useDisconnect } from '@reown/appkit/react'
import { Address } from 'viem'
import { useUsdcBalanceOf } from 'hooks/contract/useUsdcContract'
import { ButtonCommon } from 'components/Button'
import { formatUnits } from 'viem'
import { useFetchMyVaultStatsData } from 'store/vaults/hooks/useVaultData'
import VaultsConnectWalletModal from './components/VaultsConnectWalletModal'
import NormalWalletConnect from './components/NormalWalletConnect'
import CompactWalletConnect from './components/CompactWalletConnect'
import { vm } from 'pages/helper'
import { useUserInfo } from 'store/login/hooks'
import { CHAIN_ID, getChainInfo } from 'constants/chainInfo'
import Avatar from 'components/Avatar'
import NetworkSelector from './components/NetworkSelector'

// 组件模式类型定义
type WalletConnectMode = 'normal' | 'compact'

// 组件属性接口
interface VaultsWalletConnectProps {
  mode?: WalletConnectMode
}

// 连接钱包按钮样式
const WalletConnectContainer = styled.div`
  background: ${({ theme }) => theme.black700};
  border-radius: 12px;
  padding: 12px 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
    `}
`

const ConnectButton = styled(ButtonCommon)`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
`

// Normal 模式的钱包连接容器
const NormalWalletConnectContainer = styled.div`
  background: ${({ theme }) => theme.brand100};
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
      gap: ${vm(16)};
      border-radius: ${vm(12)};
    `}
`

const NormalContentSection = styled.div`
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

const NormalWalletTitle = styled.h3`
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

const NormalWalletSubtitle = styled.p`
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

const NormalConnectButton = styled(ButtonCommon)`
  background: ${({ theme }) => theme.black};
  color: ${({ theme }) => theme.brand100};
  padding: 8px 12px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  border-radius: 30px;
  width: fit-content;
  height: 28px;

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

const VaultsWalletConnect = memo(({ mode = 'normal' }: VaultsWalletConnectProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { open, close } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const { connect, isPending } = useAppKitWallet({
    onError(error) {
      console.error('钱包连接错误:', error)
    },
  })
  const { disconnect } = useDisconnect()
  const [{ userName, userAvatar }] = useUserInfo()

  // 获取 USDC 余额
  const { balance, isLoading: isLoadingBalance } = useUsdcBalanceOf(address as Address)

  // MyVaultStats 数据管理
  const { clearMyVaultStats } = useFetchMyVaultStatsData()

  // 同步网络切换

  // 格式化地址显示
  const formattedAddress = useMemo(() => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  // 格式化 USDC 余额
  const formattedBalance = useMemo(() => {
    if (!balance) return '0.00'
    try {
      // USDC 通常是 6 位小数
      const formattedValue = formatUnits(balance, 6)
      const numValue = parseFloat(formattedValue)

      // 如果余额大于 10000，显示 K 格式
      if (numValue >= 10000) {
        return `${(numValue / 1000).toFixed(1)}K`
      }

      // 如果余额大于 1000，显示到小数点后 1 位
      if (numValue >= 1000) {
        return numValue.toFixed(1)
      }

      return numValue.toFixed(2)
    } catch (error) {
      console.error('格式化余额失败:', error)
      return '0.00'
    }
  }, [balance])

  const handleConnect = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConnectSuccess = (result?: any) => {
    console.log('钱包连接成功:', result)
    setIsModalOpen(false)
  }

  const handleConnectError = (error: Error) => {
    console.error('钱包连接失败:', error)
    setIsModalOpen(false)
  }

  const handleDisconnect = async () => {
    try {
      await disconnect({ namespace: 'eip155' })
      await disconnect({ namespace: 'solana' })
      clearMyVaultStats() // 清除 MyVaultStats 数据
    } catch (error) {
      console.error('断开钱包失败:', error)
    }
  }

  const handleNetworkSwitch = () => {
    try {
      open({ view: 'Networks' })
    } catch (error) {
      console.error('切换网络失败:', error)
    }
  }

  // 未连接钱包时的UI
  if (!isConnected) {
    return (
      <>
        {mode === 'compact' ? (
          <WalletConnectContainer>
            <ConnectButton as='button' onClick={handleConnect} $pending={isPending} $disabled={isPending}>
              {isPending ? <Trans>Connecting...</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectButton>
          </WalletConnectContainer>
        ) : (
          <NormalWalletConnectContainer>
            {userAvatar ? <Avatar size={40} name={address || 'Wallet'} avatar={userAvatar} /> : <DefaultWalletIcon />}
            <NormalContentSection>
              <NormalWalletTitle>
                <Trans>My wallet</Trans>
              </NormalWalletTitle>
              <NormalWalletSubtitle>
                <Trans>Use Vaults with Starchild AI</Trans>
              </NormalWalletSubtitle>
            </NormalContentSection>
            <NetworkSelector />
            <NormalConnectButton as='button' onClick={handleConnect} $pending={isPending} $disabled={isPending}>
              {isPending ? <Trans>Connecting...</Trans> : <Trans>Connect wallet</Trans>}
            </NormalConnectButton>
          </NormalWalletConnectContainer>
        )}

        <VaultsConnectWalletModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleConnectSuccess}
          onError={handleConnectError}
        />
      </>
    )
  }

  // 根据模式渲染不同的组件
  if (mode === 'compact') {
    return (
      <>
        <CompactWalletConnect
          address={address || ''}
          userAvatar={userAvatar}
          formattedAddress={formattedAddress}
          chainId={chainId || CHAIN_ID.BASE}
          onNetworkSwitch={handleNetworkSwitch}
          onDisconnect={handleDisconnect}
        />

        <VaultsConnectWalletModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleConnectSuccess}
          onError={handleConnectError}
        />
      </>
    )
  }

  return (
    <>
      <NormalWalletConnect
        address={address || ''}
        chainId={chainId || CHAIN_ID.BASE}
        formattedAddress={formattedAddress}
        formattedBalance={formattedBalance}
        isLoadingBalance={isLoadingBalance}
        userAvatar={userAvatar}
        onNetworkSwitch={handleNetworkSwitch}
        onDisconnect={handleDisconnect}
      />

      <VaultsConnectWalletModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleConnectSuccess}
        onError={handleConnectError}
      />
    </>
  )
})

VaultsWalletConnect.displayName = 'VaultsWalletConnect'

export default VaultsWalletConnect
