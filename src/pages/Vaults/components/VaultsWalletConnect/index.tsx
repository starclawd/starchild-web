import { memo, useMemo, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import { useDisconnect } from '@reown/appkit/react'
import { Address } from 'viem'
import { useUsdcBalanceOf } from 'hooks/contract/useUsdcContract'
import { ButtonCommon, ButtonBorder } from 'components/Button'
import NetworkIcon, { getNetworkName } from 'components/NetworkIcon'
import Avatar from 'components/Avatar'
import { formatUnits } from 'viem'
import { useVaultWallet } from 'store/vaults/hooks/useVaultWallet'
import VaultsConnectWalletModal from './components/VaultsConnectWalletModal'
import { vm } from 'pages/helper'
import { useUserInfo } from 'store/login/hooks'

const WalletConnectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.black700};
  border-radius: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
      flex-direction: column;
      gap: ${vm(8)};
    `}
`

const ConnectedWalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 8px;
      padding: 12px;
    `}
`

const WalletInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`

const AddressText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
  font-family: monospace;
`

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const AddressNetworkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const WalletAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const BalanceText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL2};
`

const NetworkInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      justify-content: center;
    `}
`

const VerticalDivider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.lineDark8};
`

const DisconnectButton = styled(ButtonBorder)`
  min-width: auto;
  padding: 8px 16px;
  height: auto;
  font-size: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `}
`

const ConnectButton = styled(ButtonCommon)`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    width: 100%;
  `}
`

const VaultsWalletConnect = memo(() => {
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
      const networkName = getNetworkName(chainId.toString())
      const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId
      connectWallet(address, networkName, numericChainId)
    } else if (!isConnected) {
      vaultDisconnect()
    }
  }, [isConnected, address, chainId, connectWallet, vaultDisconnect])

  // 同步网络切换
  useEffect(() => {
    console.log('chainId', isConnected, chainId)
    if (isConnected && chainId) {
      const networkName = getNetworkName(chainId.toString())
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

  return (
    <>
      <WalletConnectContainer>
        <ConnectedWalletInfo>
          <Avatar size={40} name={address || 'Wallet'} avatar={userAvatar} />

          <WalletInfoContent>
            <AddressNetworkRow>
              <WalletAddress>
                <AddressText>{formattedAddress}</AddressText>
              </WalletAddress>

              <VerticalDivider />

              <NetworkInfo onClick={handleNetworkSwitch}>
                <NetworkIcon networkId={String(chainId) || '1'} size={16} />
              </NetworkInfo>
            </AddressNetworkRow>

            <BalanceContainer>
              <BalanceText>
                <Trans>Available:</Trans> {isLoadingBalance ? <Trans>Loading...</Trans> : `${formattedBalance} USDC`}
              </BalanceText>
            </BalanceContainer>
          </WalletInfoContent>
        </ConnectedWalletInfo>

        <DisconnectButton as='button' onClick={handleDisconnect}>
          <Trans>Disconnect</Trans>
        </DisconnectButton>
      </WalletConnectContainer>

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
