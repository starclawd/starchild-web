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
import { useIsLogin, useUserInfo } from 'store/login/hooks'

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
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { solana } from '@reown/appkit/networks'

// 登录按钮
const ConnectButton = styled(ButtonCommon)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding: 11px;
  background: ${({ theme, $disabled }) => ($disabled ? theme.bgT20 : theme.black500)};
  border-radius: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  gap: 4px;

  &:hover {
    opacity: 0.7;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
      height: ${vm(40)};
      padding: ${vm(11)};
      border-radius: ${vm(8)};
      gap: ${vm(4)};
    `}
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
  color: ${({ theme }) => theme.textL1};

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

// 分组标题
const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  text-align: left;

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

// 钱包分组容器
const WalletGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
      gap: ${vm(16)};
    `}
`

interface WalletGroupsProps {
  className?: string
  type: 'login' | 'bind' | 'vaults'
  oldWalletAddress?: string
  onSuccess?: (result?: any) => void
  onError?: (error: Error) => void
}

export default memo(function ConnectWallets({
  className,
  type,
  oldWalletAddress,
  onSuccess,
  onError,
}: WalletGroupsProps) {
  const { loginWithWallet } = useWalletLogin()
  const { bindWithWallet } = useWalletBind()
  const { chainId, caipNetwork } = useAppKitNetwork()
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
  const isLogin = useIsLogin()
  const [userInfo] = useUserInfo()

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
          iconTheme: theme.ruby50,
          autoClose: 2000,
        })
        onError?.(error as Error)
      }
    },
    [evmSignMessage, evmGetSignatureText, loginWithWallet, onSuccess, onError, toast, theme.ruby50],
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
          iconTheme: theme.jade10,
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
          iconTheme: theme.ruby50,
          autoClose: 2000,
        })
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
      theme.jade10,
      theme.ruby50,
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
          iconTheme: theme.ruby50,
          autoClose: 2000,
        })
        onError?.(error as Error)
      }
    },
    [solanaSignMessage, solanaGetSignatureText, loginWithWallet, onSuccess, onError, toast, theme.ruby50],
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
          iconTheme: theme.jade10,
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
          iconTheme: theme.ruby50,
          autoClose: 2000,
        })
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
      theme.jade10,
      theme.ruby50,
    ],
  )

  // Vaults 场景下的钱包连接处理逻辑
  const handleVaultsWalletConnection = useCallback(
    async (address: string, loginHandler: () => Promise<any>, bindHandler: () => Promise<any>) => {
      if (!isLogin) {
        // 用户未登录，尝试登录
        try {
          await loginHandler()
        } catch {
          // 登录失败，断开连接
          await disconnect()
        }
      } else {
        // 用户已登录，检查是否已绑定该地址
        const { walletAddress, secondaryWalletAddress } = userInfo
        const isAddressBound =
          address.toLocaleLowerCase() === walletAddress.toLocaleLowerCase() ||
          address.toLocaleLowerCase() === secondaryWalletAddress.toLocaleLowerCase()

        if (isAddressBound) {
          // 已绑定，什么都不做
          return
        }

        // 未绑定，检查是否还能绑定
        const canBind = !walletAddress || !secondaryWalletAddress

        if (canBind) {
          // 尝试绑定地址
          try {
            await bindHandler()
          } catch {
            // 绑定失败，断开连接
            await disconnect()
          }
        } else {
          // 不能绑定，弹出错误提示并断开连接
          toast({
            title: <Trans>Maximum Wallets Linked (2/2)</Trans>,
            description: (
              <Trans>Starchild supports a maximum of 2 wallets. Please unbind an existing one to add a new one.</Trans>
            ),
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-customize-avatar',
            iconTheme: theme.ruby50,
            autoClose: 2000,
          })
          await disconnect()
        }
      }
    },
    [isLogin, userInfo, toast, theme.ruby50, disconnect],
  )

  // 判断当前网络是否为Solana链
  const isSolanaChain = useCallback(() => {
    return caipNetwork?.id === solana.id
  }, [caipNetwork])

  // 钱包连接后的处理逻辑
  useEffect(() => {
    // 只有当前网络属于EVM链时才执行EVM钱包连接逻辑
    if (evmIsConnected && evmAddress && evmChainId && !isSolanaChain()) {
      if (type === 'login') {
        handleEVMWalletLogin(evmAddress, Number(evmChainId))
      } else if (type === 'bind') {
        handleEVMWalletBind(evmAddress, Number(evmChainId))
      } else if (type === 'vaults') {
        // Vaults 场景处理逻辑
        handleVaultsWalletConnection(
          evmAddress,
          () => handleEVMWalletLogin(evmAddress, Number(evmChainId)),
          () => handleEVMWalletBind(evmAddress, Number(evmChainId)),
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evmIsConnected, evmAddress, evmChainId, type, isSolanaChain])

  useEffect(() => {
    // 只有当前网络属于Solana链时才执行Solana钱包连接逻辑
    if (solanaIsConnected && solanaAddress && isSolanaChain()) {
      if (type === 'login') {
        handleSolanaWalletLogin(solanaAddress)
      } else if (type === 'bind') {
        handleSolanaWalletBind(solanaAddress)
      } else if (type === 'vaults') {
        // Vaults 场景处理逻辑
        handleVaultsWalletConnection(
          solanaAddress,
          () => handleSolanaWalletLogin(solanaAddress),
          () => handleSolanaWalletBind(solanaAddress),
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solanaIsConnected, solanaAddress, type, isSolanaChain])

  const handleMetaMaskEVM = useCallback(() => {
    evmConnect('metamask')
  }, [evmConnect])

  const handlePhantomEVM = useCallback(() => {
    evmConnect('phantom')
  }, [evmConnect])

  const handleWalletConnectEVM = useCallback(() => {
    evmConnect('walletConnect')
  }, [evmConnect])

  const handleCoinbaseEVM = useCallback(() => {
    evmConnect('coinbase')
  }, [evmConnect])

  const handleOKXEVM = useCallback(() => {
    evmConnect('okx')
  }, [evmConnect])

  const handleMetaMaskSolana = useCallback(() => {
    solanaConnect('metamask')
  }, [solanaConnect])

  const handlePhantomSolana = useCallback(() => {
    solanaConnect('phantom')
  }, [solanaConnect])

  return (
    <WalletGroupsContainer className={className}>
      {/* EVM 钱包分组 */}
      <SectionWrapper>
        <SectionTitle>EVM</SectionTitle>

        <ConnectButton onClick={handleMetaMaskEVM} $disabled={!evmIsReady}>
          <ButtonIcon>
            <img src={metamaskIcon} alt='MetaMask' />
          </ButtonIcon>
          <ButtonText>
            <Trans>MetaMask</Trans>
          </ButtonText>
        </ConnectButton>

        {!isMobile && (
          <ConnectButton onClick={handlePhantomEVM} $disabled={!evmIsReady}>
            <ButtonIcon>
              <img src={phantomIcon} alt='Phantom' />
            </ButtonIcon>
            <ButtonText>
              <Trans>Phantom</Trans>
            </ButtonText>
          </ConnectButton>
        )}

        <ConnectButton onClick={handleWalletConnectEVM} $disabled={!evmIsReady}>
          <ButtonIcon>
            <img src={walletConnectIcon} alt='WalletConnect' />
          </ButtonIcon>
          <ButtonText>
            <Trans>WalletConnect</Trans>
          </ButtonText>
        </ConnectButton>

        <ConnectButton onClick={handleCoinbaseEVM} $disabled={!evmIsReady}>
          <ButtonIcon>
            <img src={coinbaseIcon} alt='Coinbase' />
          </ButtonIcon>
          <ButtonText>
            <Trans>Coinbase</Trans>
          </ButtonText>
        </ConnectButton>

        <ConnectButton onClick={handleOKXEVM} $disabled={!evmIsReady}>
          <ButtonIcon>
            <img src={okxIcon} alt='OKX' />
          </ButtonIcon>
          <ButtonText>
            <Trans>OKX</Trans>
          </ButtonText>
        </ConnectButton>
      </SectionWrapper>

      {/* Solana 钱包分组 */}
      <SectionWrapper>
        <SectionTitle>Solana</SectionTitle>

        <ConnectButton onClick={handleMetaMaskSolana} $disabled={!solanaIsReady}>
          <ButtonIcon>
            <img src={metamaskIcon} alt='MetaMask' />
          </ButtonIcon>
          <ButtonText>
            <Trans>MetaMask</Trans>
          </ButtonText>
        </ConnectButton>

        {!isMobile && (
          <ConnectButton onClick={handlePhantomSolana} $disabled={!solanaIsReady}>
            <ButtonIcon>
              <img src={phantomIcon} alt='Phantom' />
            </ButtonIcon>
            <ButtonText>
              <Trans>Phantom</Trans>
            </ButtonText>
          </ConnectButton>
        )}

        <ConnectButton onClick={handleCoinbaseEVM} $disabled={!evmIsReady}>
          <ButtonIcon>
            <img src={coinbaseIcon} alt='Coinbase' />
          </ButtonIcon>
          <ButtonText>
            <Trans>Coinbase</Trans>
          </ButtonText>
        </ConnectButton>

        <ConnectButton onClick={handleOKXEVM} $disabled={!evmIsReady}>
          <ButtonIcon>
            <img src={okxIcon} alt='OKX' />
          </ButtonIcon>
          <ButtonText>
            <Trans>OKX</Trans>
          </ButtonText>
        </ConnectButton>
      </SectionWrapper>
    </WalletGroupsContainer>
  )
})
