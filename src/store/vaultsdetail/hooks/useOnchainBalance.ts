import { useGetOnchainBalanceQuery } from 'api/createStrategy'
import { useUserInfo } from 'store/login/hooks'

/**
 * 获取策略链上余额hook
 */
export function useOnchainBalance() {
  const [{ userInfoId }] = useUserInfo()

  const { data, isLoading, error, refetch } = useGetOnchainBalanceQuery(undefined, {
    skip: !userInfoId,
  })

  return {
    onchainBalance: data,
    isLoading,
    error,
    refetch,
  }
}
