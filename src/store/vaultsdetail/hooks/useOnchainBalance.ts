import { useGetOnchainBalanceQuery } from 'api/createStrategy'
import { useIsLogin, useUserInfo } from 'store/login/hooks'

/**
 * 获取策略链上余额hook
 */
export function useOnchainBalance() {
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()

  const { data, isLoading, error, refetch } = useGetOnchainBalanceQuery(undefined, {
    skip: !userInfoId || !isLogin,
  })

  return {
    onchainBalance: data,
    isLoading,
    error,
    refetch,
  }
}
