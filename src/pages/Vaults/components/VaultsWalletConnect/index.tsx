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
import NormalWalletConnect from './components/NormalWalletConnect'
import CompactWalletConnect from './components/CompactWalletConnect'
import { vm } from 'pages/helper'
import { useUserInfo } from 'store/login/hooks'
import { CHAIN_ID } from 'constants/chainInfo'
import Avatar from 'components/Avatar'
import NetworkSelector from './components/NetworkSelector'
import { useConnectWalletModalToggle } from 'store/application/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'

// 组件模式类型定义
type WalletConnectMode = 'normal' | 'compact'

// 组件属性接口
interface VaultsWalletConnectProps {
  mode?: WalletConnectMode
  isCreateStrategy?: boolean
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

const VaultsWalletConnect = memo(({ mode = 'normal', isCreateStrategy = false }: VaultsWalletConnectProps) => {
  const { address, isConnected } = useAppKitAccount()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const { isPending } = useAppKitWallet({
    onError(error) {
      console.error('钱包连接错误:', error)
    },
  })
  const { disconnect } = useDisconnect()
  const [{ userAvatar }] = useUserInfo()
  const toast = useToast()
  const theme = useTheme()

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

  const handleDisconnect = async () => {
    try {
      await disconnect({ namespace: 'eip155' })
      await disconnect({ namespace: 'solana' })
      clearMyVaultStats() // 清除 MyVaultStats 数据
    } catch (error) {
      console.error('断开钱包失败:', error)
    }
  }

  const handleCopy = async () => {
    if (!address) {
      toast({
        title: <Trans>Copy failed</Trans>,
        description: <Trans>No address available</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-copy',
        iconTheme: theme.red100,
        autoClose: 2000,
      })
      return
    }

    try {
      await navigator.clipboard.writeText(address)
      toast({
        title: <Trans>Address copied</Trans>,
        description: address,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-copy',
        iconTheme: theme.jade10,
        autoClose: 2000,
      })
    } catch (error) {
      console.error('复制失败:', error)
      // 降级处理：使用传统方法
      try {
        const textarea = document.createElement('textarea')
        textarea.value = address
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)

        toast({
          title: <Trans>Address copied</Trans>,
          description: address,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-copy',
          iconTheme: theme.jade10,
          autoClose: 2000,
        })
      } catch (fallbackError) {
        console.error('降级复制也失败:', fallbackError)
        toast({
          title: <Trans>Copy failed</Trans>,
          description: <Trans>Unable to copy address</Trans>,
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-chat-copy',
          iconTheme: theme.red100,
          autoClose: 2000,
        })
      }
    }
  }

  // 根据模式渲染不同的组件
  if (mode === 'compact') {
    return (
      <CompactWalletConnect
        isCreateStrategy={isCreateStrategy}
        address={address || ''}
        userAvatar={userAvatar}
        formattedAddress={formattedAddress}
        onDisconnect={handleDisconnect}
        onCopy={handleCopy}
      />
    )
  }

  // Normal 模式（包含连接和未连接状态）
  return (
    <NormalWalletConnect
      address={address || ''}
      formattedAddress={formattedAddress}
      formattedBalance={formattedBalance}
      isLoadingBalance={isLoadingBalance}
      userAvatar={userAvatar}
      onDisconnect={handleDisconnect}
      onCopy={handleCopy}
      isConnected={isConnected}
      isPending={isPending}
      onConnect={toggleConnectWalletModal}
    />
  )
})

VaultsWalletConnect.displayName = 'VaultsWalletConnect'

export default VaultsWalletConnect
