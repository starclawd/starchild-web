import { useCallback } from 'react'
import { useLazyWalletLoginQuery } from 'api/user'
import { useEVMWalletManagement } from '../../home/hooks/useEVMWalletManagement'
import { useSolanaWalletManagement } from '../../home/hooks/useSolanaWalletManagement'

/**
 * 钱包登录参数接口
 */
export interface WalletLoginParams {
  address: string
  signature: string
  message: string
}

/**
 * 统一的钱包登录 hook
 * 支持 EVM 和 Solana 钱包的登录功能
 */
export function useWalletLogin() {
  const [triggerWalletLogin] = useLazyWalletLoginQuery()

  /**
   * 生成登录签名消息
   * @param address - 钱包地址
   * @returns 签名消息字符串
   */
  const generateLoginMessage = useCallback((address: string) => {
    const loginData = {
      date: Date.now(),
      address,
    }
    return JSON.stringify(loginData)
  }, [])

  /**
   * 统一钱包登录函数
   * @param params - 登录参数，包含地址、签名和消息
   * @returns 登录结果
   */
  const loginWithWallet = useCallback(
    async (params: WalletLoginParams) => {
      try {
        const { address, signature, message } = params

        if (!address || !signature || !message) {
          throw new Error('登录参数不完整')
        }

        // 调用登录 API
        const result = await triggerWalletLogin({
          address,
          signature,
          message,
        })

        return result
      } catch (error) {
        console.error('钱包登录失败:', error)
        throw error
      }
    },
    [triggerWalletLogin],
  )

  return {
    // 统一登录函数
    loginWithWallet,

    // 通用功能
    generateLoginMessage,
  }
}
