import { useCallback } from 'react'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import { useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react'
import { useSignMessage } from 'wagmi'

/**
 * EVM 钱包管理 hook
 * 提供通用的 EVM 连接、断开、签名功能
 */
export function useEVMWalletManagement() {
  // 获取 EVM 账户信息
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' })
  const { chainId } = useAppKitNetwork()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  // 获取 EVM 连接状态
  const { isReady, isPending, connect } = useAppKitWallet({
    namespace: 'eip155',
    onSuccess(parsedCaipAddress) {
      console.log('EVM Connected successfully!', parsedCaipAddress)
    },
    onError(error) {
      console.error('EVM Connection error:', error)
    },
  })

  // 断开 EVM 连接
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect({ namespace: 'eip155' })
    } catch (error) {
      console.error('EVM Disconnect error:', error)
      throw error
    }
  }, [disconnect])

  const getSignatureText = useCallback(() => {
    const message = {
      chainType: 'EVM',
      timestamp: Date.now(),
    }
    return message
  }, [])

  // 签名消息
  const signMessage = useCallback(
    async (message: string) => {
      try {
        if (!signMessageAsync) {
          throw new Error('Signature function is not available')
        }
        const signature = await signMessageAsync({ message })
        return signature
      } catch (error) {
        console.error('EVM Sign message error:', error)
        throw error
      }
    },
    [signMessageAsync],
  )

  return {
    address,
    chainId,
    // 连接状态
    isConnected,
    isReady,
    isPending,

    // 操作方法
    connect,
    disconnect: handleDisconnect,
    signMessage,
    getSignatureText,
  }
}
