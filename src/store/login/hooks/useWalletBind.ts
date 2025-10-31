import { useCallback } from 'react'
import { useLazyBindAddressQuery } from 'api/home'

export interface WalletBindParams {
  address: string
  signature: string
  message: string
}

/**
 * 统一的钱包绑定 hook
 * 支持 EVM 和 Solana 钱包的绑定功能
 */
export function useWalletBind() {
  const [triggerBindAddress] = useLazyBindAddressQuery()

  /**
   * 生成绑定签名消息
   * @param address - 钱包地址
   * @returns 签名消息字符串
   */
  const generateBindMessage = useCallback((address: string) => {
    const bindData = {
      date: Date.now(),
      address,
    }
    return JSON.stringify(bindData)
  }, [])

  /**
   * 统一钱包绑定函数
   * @param params - 绑定参数，包含地址、签名和消息
   * @returns 绑定结果
   */
  const bindWithWallet = useCallback(
    async (params: WalletBindParams) => {
      try {
        const { address, signature, message } = params

        if (!address || !signature || !message) {
          throw new Error('绑定参数不完整')
        }

        // 调用绑定 API
        const result = await triggerBindAddress({
          account: address,
          signature,
          message,
        })

        return result
      } catch (error) {
        console.error('钱包绑定失败:', error)
        throw error
      }
    },
    [triggerBindAddress],
  )

  return {
    // 统一绑定函数
    bindWithWallet,

    // 通用功能
    generateBindMessage,
  }
}
