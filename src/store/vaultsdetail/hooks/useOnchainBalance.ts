import { useGetOnchainBalanceQuery } from 'api/createStrategy'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateOnchainBalance } from '../reducer'
import { useEffect } from 'react'

/**
 * 获取策略链上余额hook
 */
export function useOnchainBalance() {
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const dispatch = useDispatch()
  const onchainBalance = useSelector((state: RootState) => state.vaultsdetail.onchainBalance)

  const { data, isLoading, error, refetch } = useGetOnchainBalanceQuery(undefined, {
    skip: !userInfoId || !isLogin,
  })

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updateOnchainBalance(data.data))
    }
  }, [data, dispatch])

  return {
    onchainBalance,
    isLoading,
    error,
    refetch,
  }
}
