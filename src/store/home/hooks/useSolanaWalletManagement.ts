import { useCallback } from 'react'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import { useAppKitAccount, useAppKitNetwork, useDisconnect, useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana'

/**
 * Solana 钱包管理 hook
 * 提供通用的 Solana 连接、断开、签名功能
 */
export function useSolanaWalletManagement() {
  // 获取 Solana 账户信息
  const { address, isConnected } = useAppKitAccount({ namespace: 'solana' })
  const { disconnect } = useDisconnect()
  const { walletProvider } = useAppKitProvider<Provider>('solana')

  // 获取 Solana 连接状态
  const { isReady, isPending, connect } = useAppKitWallet({
    namespace: 'solana',
    onSuccess(parsedCaipAddress) {
      console.log('Solana Connected successfully!', parsedCaipAddress)
    },
    onError(error) {
      console.error('Solana Connection error:', error)
    },
  })

  // 断开 Solana 连接
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect({ namespace: 'solana' })
    } catch (error) {
      console.error('Solana Disconnect error:', error)
      throw error
    }
  }, [disconnect])

  // 签名消息
  const signMessage = useCallback(
    async (message: string) => {
      try {
        // 检查是否有可用的钱包连接
        if (!address || !isConnected) {
          throw new Error('钱包未连接')
        }

        // 通过 AppKit 的通用方法发送签名请求
        if (!walletProvider) {
          throw new Error('未找到 Solana 钱包')
        }

        // 将消息编码为 Uint8Array
        const encodedMessage = new TextEncoder().encode(message)

        // 请求签名
        const signature = await walletProvider.signMessage(encodedMessage)

        // 将签名转换为 base64 字符串
        const signatureBase64 = Buffer.from(signature).toString('base64')

        return signatureBase64
      } catch (error) {
        console.error('Solana Sign message error:', error)
        throw error
      }
    },
    [address, isConnected, walletProvider],
  )

  return {
    address,
    // 连接状态
    isConnected,
    isReady,
    isPending,

    // 操作方法
    connect,
    disconnect: handleDisconnect,
    signMessage,
  }
}
