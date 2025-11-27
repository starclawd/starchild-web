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
import { useVaultWallet } from 'store/vaults/hooks/useVaultWallet'
import VaultsConnectWalletModal from './components/VaultsConnectWalletModal'
import NormalWalletConnect from './components/NormalWalletConnect'
import CompactWalletConnect from './components/CompactWalletConnect'
import { vm } from 'pages/helper'
import { useUserInfo } from 'store/login/hooks'
import { getChainInfo } from 'constants/chainInfo'

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

  // Vault 钱包状态管理
  const { walletInfo, connectWallet, disconnect: vaultDisconnect, setNetwork } = useVaultWallet()

  // 获取 USDC 余额
  const { balance, isLoading: isLoadingBalance } = useUsdcBalanceOf(address as Address)

  // 同步钱包连接状态到 vaults store
  useEffect(() => {
    if (isConnected && address && chainId) {
      const chainInfo = getChainInfo(Number(chainId))
      const networkName = chainInfo?.name || `Chain ${chainId}`
      const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId
      connectWallet(address, networkName, numericChainId)
    } else if (!isConnected) {
      vaultDisconnect()
    }
  }, [isConnected, address, chainId, connectWallet, vaultDisconnect])

  // 同步网络切换
  useEffect(() => {
    if (isConnected && chainId) {
      const chainInfo = getChainInfo(Number(chainId))
      const networkName = chainInfo?.name || `Chain ${chainId}`
      const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId
      setNetwork(networkName, numericChainId)
    }
  }, [chainId, isConnected, setNetwork])

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
      vaultDisconnect() // 清除 vaults store 中的钱包状态
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
        <WalletConnectContainer>
          <ConnectButton as='button' onClick={handleConnect} $pending={isPending} $disabled={isPending}>
            {isPending ? <Trans>Connecting...</Trans> : <Trans>Connect Wallet</Trans>}
          </ConnectButton>
        </WalletConnectContainer>

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
          chainId={chainId || 1}
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
        chainId={chainId || 1}
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
