/**
 * 钱包连接分组组件
 * 包含EVM和Solana钱包的连接选项
 */
import { memo, useCallback, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { vm } from 'pages/helper'
import { useWalletLogin } from 'store/login/hooks/useWalletLogin'
import { useWalletBind } from 'store/home/hooks/useWalletBind'
import { useIsMobile } from 'store/application/hooks'

// 导入图标资源
import metamaskIcon from 'assets/media/metamask.png'
import phantomIcon from 'assets/media/phantom.png'
import walletConnectIcon from 'assets/media/wallet_connect.png'
import coinbaseIcon from 'assets/media/coinbase.png'
import okxIcon from 'assets/media/okx.png'
import { useSolanaWalletManagement } from 'store/home/hooks/useSolanaWalletManagement'
import { useEVMWalletManagement } from 'store/home/hooks/useEVMWalletManagement'
import { handleSignature } from 'utils'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useAppKitNetwork, useDisconnect } from '@reown/appkit/react'
import { solana } from '@reown/appkit/networks'
import Pending from 'components/Pending'
import { useIsGetAuthToken } from 'store/login/hooks'

// 钱包类型定义
type WalletType = 'metamask' | 'phantom' | 'walletConnect' | 'coinbase' | 'okx'
type ChainType = 'evm' | 'solana'

// 钱包按钮配置
interface WalletButtonConfig {
  id: string
  name: string
  icon: string
  walletType: WalletType
  chainType: ChainType
  hideOnMobile?: boolean
}

// 钱包分组配置
interface WalletGroupConfig {
  title: string
  wallets: WalletButtonConfig[]
}

interface ChainConnectProps {
  className?: string
  oldWalletAddress?: string
  onSuccess?: (result?: any) => void
  onError?: (error: Error) => void
}

// 登录按钮
const ConnectButton = styled(ButtonCommon)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc((100% - 4px) / 2);
  height: 40px;
  padding: 11px;
  background: ${({ theme, $disabled }) => ($disabled ? theme.black800 : theme.black700)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 4px;

  &:hover {
    opacity: 0.7;
  }
`

// 按钮图标
const ButtonIcon = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
      width: ${vm(18)};
      height: ${vm(18)};
    `}
`

// 按钮文本
const ButtonText = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ theme }) => theme.black0};

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

// 分组容器
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const GroupContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

// 分组标题
const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  text-align: left;

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

// 钱包分组容器
const ChainConnectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
      gap: ${vm(16)};
    `}
`

const PendingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
`

export default memo(function ChainConnect({ className, oldWalletAddress, onSuccess, onError }: ChainConnectProps) {
  const [isGetAuthToken] = useIsGetAuthToken()
  const { loginWithWallet } = useWalletLogin()
  const { bindWithWallet } = useWalletBind()
  const { caipNetwork } = useAppKitNetwork()
  const { disconnect } = useDisconnect()
  const {
    address: evmAddress,
    chainId: evmChainId,
    isConnected: evmIsConnected,
    signMessage: evmSignMessage,
    connect: evmConnect,
    getSignatureText: evmGetSignatureText,
    isReady: evmIsReady,
  } = useEVMWalletManagement()
  const {
    address: solanaAddress,
    isConnected: solanaIsConnected,
    signMessage: solanaSignMessage,
    connect: solanaConnect,
    getSignatureText: solanaGetSignatureText,
    isReady: solanaIsReady,
  } = useSolanaWalletManagement()
  const toast = useToast()
  const theme = useTheme()
  const isMobile = useIsMobile()

  // EVM 钱包登录处理
  const handleEVMWalletLogin = useCallback(
    async (address: string, chainId: number) => {
      try {
        // 生成签名消息
        const message = evmGetSignatureText()

        // 请求用户签名
        const signature = await evmSignMessage(`${message.chainType}:${message.timestamp}`)

        // 调用统一登录函数
        const result = await loginWithWallet({
          address,
          signature: handleSignature(signature),
          message,
        })

        onSuccess?.(result)
      } catch (error) {
        console.error('EVM wallet login failed:', error)
        toast({
          title: <Trans>Login failed</Trans>,
          description: '',
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-customize-avatar',
          iconTheme: theme.black0,
          autoClose: 2000,
        })
        disconnect()
        onError?.(error as Error)
      }
    },
    [evmSignMessage, evmGetSignatureText, loginWithWallet, onSuccess, onError, toast, theme.black0, disconnect],
  )

  // EVM 钱包绑定处理
  const handleEVMWalletBind = useCallback(
    async (address: string, chainId: number) => {
      try {
        // 生成签名消息
        const message = evmGetSignatureText()

        // 请求用户签名
        const signature = await evmSignMessage(`${message.chainType}:${message.timestamp}`)

        // 调用统一绑定函数
        const result = await bindWithWallet({
          address,
          signature: handleSignature(signature),
          message,
          oldWalletAddress,
        })

        toast({
          title: <Trans>Bind successfully</Trans>,
          description: address,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-customize-avatar',
          iconTheme: theme.black0,
          autoClose: 2000,
        })
        onSuccess?.(result)
      } catch (error) {
        console.error('EVM wallet bind failed:', error)
        const errorMessage = (error as Error)?.message || ''
        toast({
          title: <Trans>Bind failed</Trans>,
          description: errorMessage,
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-customize-avatar',
          iconTheme: theme.black0,
          autoClose: 2000,
        })
        disconnect()
        onError?.(error as Error)
      }
    },
    [
      evmSignMessage,
      evmGetSignatureText,
      bindWithWallet,
      oldWalletAddress,
      onSuccess,
      onError,
      toast,
      theme.black0,
      disconnect,
    ],
  )

  // Solana 钱包登录处理
  const handleSolanaWalletLogin = useCallback(
    async (address: string) => {
      try {
        // 生成签名消息
        const message = solanaGetSignatureText()

        // 请求用户签名
        const signature = await solanaSignMessage(`${message.chainType}:${message.timestamp}`)

        // 调用统一登录函数
        const result = await loginWithWallet({
          address,
          signature,
          message,
        })
        onSuccess?.(result)
      } catch (error) {
        console.error('Solana wallet login failed:', error)
        toast({
          title: <Trans>Login failed</Trans>,
          description: '',
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-customize-avatar',
          iconTheme: theme.black0,
          autoClose: 2000,
        })
        disconnect()
        onError?.(error as Error)
      }
    },
    [solanaSignMessage, solanaGetSignatureText, loginWithWallet, onSuccess, onError, toast, theme.black0, disconnect],
  )

  // Solana 钱包绑定处理
  const handleSolanaWalletBind = useCallback(
    async (address: string) => {
      try {
        // 生成签名消息
        const message = solanaGetSignatureText()

        // 请求用户签名
        const signature = await solanaSignMessage(`${message.chainType}:${message.timestamp}`)

        // 调用统一绑定函数
        const result = await bindWithWallet({
          address,
          signature,
          message,
          oldWalletAddress,
        })

        toast({
          title: <Trans>Bind successfully</Trans>,
          description: address,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-customize-avatar',
          iconTheme: theme.black0,
          autoClose: 2000,
        })
        onSuccess?.(result)
      } catch (error) {
        console.error('Solana wallet bind failed:', error)
        const errorMessage = (error as Error)?.message || ''
        toast({
          title: <Trans>Bind failed</Trans>,
          description: errorMessage,
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-customize-avatar',
          iconTheme: theme.black0,
          autoClose: 2000,
        })
        disconnect()
        onError?.(error as Error)
      }
    },
    [
      solanaSignMessage,
      solanaGetSignatureText,
      bindWithWallet,
      oldWalletAddress,
      onSuccess,
      onError,
      toast,
      theme.black0,
      disconnect,
    ],
  )

  // Vaults 场景下的钱包连接处理逻辑
  const handleVaultsWalletConnection = useCallback(
    async (loginHandler: () => Promise<any>) => {
      try {
        await loginHandler()
      } catch (error) {
        console.error('Vaults wallet connection failed:', error)
        onError?.(error as Error)
      }
    },
    [onError],
  )

  // 判断当前网络是否为Solana链
  const isSolanaChain = useCallback(() => {
    return caipNetwork?.id === solana.id
  }, [caipNetwork])

  // 钱包连接后的处理逻辑
  useEffect(() => {
    // 只有当前网络属于EVM链时才执行EVM钱包连接逻辑
    if (evmIsConnected && evmAddress && evmChainId && !isSolanaChain()) {
      handleEVMWalletLogin(evmAddress, Number(evmChainId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmIsConnected, evmAddress, evmChainId, isSolanaChain])

  useEffect(() => {
    // 只有当前网络属于Solana链时才执行Solana钱包连接逻辑
    if (solanaIsConnected && solanaAddress && isSolanaChain()) {
      handleSolanaWalletLogin(solanaAddress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solanaIsConnected, solanaAddress, isSolanaChain])

  // 钱包连接处理函数
  const handleWalletConnect = useCallback(
    (walletType: WalletType, chainType: ChainType) => {
      if (chainType === 'evm') {
        evmConnect(walletType)
      } else {
        solanaConnect(walletType)
      }
    },
    [evmConnect, solanaConnect],
  )

  // 获取按钮禁用状态
  const getIsDisabled = useCallback(
    (chainType: ChainType) => {
      return chainType === 'evm' ? !evmIsReady : !solanaIsReady
    },
    [evmIsReady, solanaIsReady],
  )

  // 钱包分组数据
  const walletGroups: WalletGroupConfig[] = [
    {
      title: 'EVM',
      wallets: [
        { id: 'evm-metamask', name: 'MetaMask', icon: metamaskIcon, walletType: 'metamask', chainType: 'evm' },
        {
          id: 'evm-phantom',
          name: 'Phantom',
          icon: phantomIcon,
          walletType: 'phantom',
          chainType: 'evm',
          hideOnMobile: true,
        },
        {
          id: 'evm-walletConnect',
          name: 'WalletConnect',
          icon: walletConnectIcon,
          walletType: 'walletConnect',
          chainType: 'evm',
        },
        { id: 'evm-coinbase', name: 'Coinbase', icon: coinbaseIcon, walletType: 'coinbase', chainType: 'evm' },
        { id: 'evm-okx', name: 'OKX', icon: okxIcon, walletType: 'okx', chainType: 'evm' },
      ],
    },
    {
      title: 'Solana',
      wallets: [
        {
          id: 'solana-metamask',
          name: 'MetaMask',
          icon: metamaskIcon,
          walletType: 'metamask',
          chainType: 'solana',
        },
        {
          id: 'solana-phantom',
          name: 'Phantom',
          icon: phantomIcon,
          walletType: 'phantom',
          chainType: 'solana',
          hideOnMobile: true,
        },
        // Coinbase 和 OKX 目前在 Solana 分组下仍使用 EVM 连接
        { id: 'solana-coinbase', name: 'Coinbase', icon: coinbaseIcon, walletType: 'coinbase', chainType: 'evm' },
        { id: 'solana-okx', name: 'OKX', icon: okxIcon, walletType: 'okx', chainType: 'evm' },
      ],
    },
  ]

  if (isGetAuthToken) {
    return (
      <PendingWrapper>
        <Pending isNotButtonLoading />
      </PendingWrapper>
    )
  }

  return (
    <ChainConnectContainer className={className}>
      {walletGroups.map((group) => (
        <SectionWrapper key={group.title}>
          <SectionTitle>{group.title}</SectionTitle>
          <GroupContent>
            {group.wallets.map((wallet) => {
              // 移动端隐藏特定钱包
              if (wallet.hideOnMobile && isMobile) {
                return null
              }
              return (
                <ConnectButton
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.walletType, wallet.chainType)}
                  $disabled={getIsDisabled(wallet.chainType)}
                >
                  <ButtonIcon>
                    <img src={wallet.icon} alt={wallet.name} />
                  </ButtonIcon>
                  <ButtonText>{wallet.name}</ButtonText>
                </ConnectButton>
              )
            })}
          </GroupContent>
        </SectionWrapper>
      ))}
    </ChainConnectContainer>
  )
})
