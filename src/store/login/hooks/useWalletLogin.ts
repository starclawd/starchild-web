import { useCallback } from 'react'
import { useLazyWalletLoginQuery } from 'api/user'
import { useAuthToken } from 'store/logincache/hooks'
import { useIsGetAuthToken } from '../hooks'

/**
 * 钱包登录参数接口
 */
export interface WalletLoginParams {
  address: string
  signature: string
  message: any
  chainId?: number
}

/**
 * 统一的钱包登录 hook
 * 支持 EVM 和 Solana 钱包的登录功能
 */
export function useWalletLogin() {
  const [triggerWalletLogin] = useLazyWalletLoginQuery()
  const [, setAuthToken] = useAuthToken()
  const [, setIsGetAuthToken] = useIsGetAuthToken()

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
          throw new Error('Login parameters are incomplete')
        }

        setIsGetAuthToken(true)
        // 调用登录 API
        const data = await triggerWalletLogin({
          address,
          signature,
          message,
        })
        if (data.isSuccess) {
          const result = data.data
          setAuthToken(result.token as string)
        }
        setIsGetAuthToken(false)

        return data
      } catch (error) {
        console.error('钱包登录失败:', error)
        throw error
      }
    },
    [triggerWalletLogin, setAuthToken, setIsGetAuthToken],
  )

  return {
    loginWithWallet,
  }
}
