import { useCallback } from 'react'
import { useLazyBindWalletQuery } from 'api/user'

export interface WalletBindParams {
  address: string
  signature: string
  message: any
  chainId?: number
  oldWalletAddress?: string
}

/**
 * 统一的钱包绑定 hook
 * 支持 EVM 和 Solana 钱包的绑定功能
 */
export function useWalletBind() {
  const [triggerBindWallet] = useLazyBindWalletQuery()

  /**
   * 统一钱包绑定函数
   * @param params - 绑定参数，包含地址、签名和消息
   * @returns 绑定结果
   */
  const bindWithWallet = useCallback(
    async (params: WalletBindParams) => {
      try {
        const { address, signature, message, oldWalletAddress } = params

        if (!address || !signature || !message) {
          throw new Error('Binding parameters are incomplete')
        }

        // 调用绑定 API
        const result = await triggerBindWallet({
          address,
          message,
          signature,
          oldWalletAddress,
        })

        return result
      } catch (error) {
        console.error('钱包绑定失败:', error)
        throw error
      }
    },
    [triggerBindWallet],
  )

  return {
    bindWithWallet,
  }
}
