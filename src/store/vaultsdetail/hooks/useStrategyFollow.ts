import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  useFollowStrategyMutation,
  useUnfollowStrategyMutation,
  useGetIsFollowedStrategyQuery,
  useLazyGetIsFollowedStrategyQuery,
} from 'api/createStrategy'
import { setIsFollowing, setLoadingFollowing } from 'store/vaultsdetail/reducer'
import { useVibeTradingStrategyInfo } from './useVibeTradingStrategyInfo'
import { useIsLogin } from 'store/login/hooks'
import { useUserInfo } from 'store/login/hooks'

/**
 * 查询策略是否已关注hook
 */
export function useIsFollowedStrategy({ strategyId }: { strategyId: string | null }) {
  const dispatch = useDispatch()
  const isLogin = useIsLogin()
  const [{ userInfoId }] = useUserInfo()
  const isFollowing = useSelector((state: RootState) => state.vaultsdetail.isFollowing)
  const isLoadingFollowing = useSelector((state: RootState) => state.vaultsdetail.isLoadingFollowing)

  const { data, isLoading, error, refetch } = useGetIsFollowedStrategyQuery(
    { strategy_id: strategyId || '' },
    {
      skip: !strategyId || !isLogin || !userInfoId,
      refetchOnMountOrArgChange: true,
    },
  )

  const [getIsFollowedStrategy, { isLoading: isLazyLoading }] = useLazyGetIsFollowedStrategyQuery()

  const fetchIsFollowed = useCallback(
    async (id?: string) => {
      const targetId = id || strategyId
      if (!targetId) return
      try {
        dispatch(setLoadingFollowing(true))
        const result = await getIsFollowedStrategy({ strategy_id: targetId }).unwrap()
        const isFollowing = result?.data?.is_following
        if (isFollowing !== undefined) {
          dispatch(setIsFollowing(isFollowing))
        }
      } catch (err) {
        console.error('Fetch is followed strategy failed:', err)
      } finally {
        dispatch(setLoadingFollowing(false))
      }
    },
    [getIsFollowedStrategy, strategyId, dispatch],
  )

  useEffect(() => {
    const isFollowing = data?.data?.is_following
    if (isFollowing !== undefined) {
      dispatch(setIsFollowing(isFollowing))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingFollowing(isLoading))
  }, [isLoading, dispatch])

  return {
    isFollowedStrategy: isFollowing,
    isLoadingFollowing: isLoadingFollowing || isLazyLoading,
    error,
    refetch,
    fetchIsFollowed,
  }
}

/**
 * 关注策略hook
 */
export function useFollowStrategy() {
  const [followStrategyMutation] = useFollowStrategyMutation()

  const followStrategy = useCallback(
    async (strategyId: string) => {
      try {
        await followStrategyMutation({ strategy_id: strategyId }).unwrap()
      } catch (err) {
        console.error('Follow strategy failed:', err)
        throw err
      }
    },
    [followStrategyMutation],
  )

  return followStrategy
}

/**
 * 取消关注策略hook
 */
export function useUnfollowStrategy() {
  const [unfollowStrategyMutation] = useUnfollowStrategyMutation()

  const unfollowStrategy = useCallback(
    async (strategyId: string) => {
      try {
        await unfollowStrategyMutation({ strategy_id: strategyId }).unwrap()
      } catch (err) {
        console.error('Unfollow strategy failed:', err)
        throw err
      }
    },
    [unfollowStrategyMutation],
  )

  return unfollowStrategy
}
