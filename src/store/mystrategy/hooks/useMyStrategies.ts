import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useCallback, useEffect } from 'react'
import { updateMyStrategies, setLoadingMyStrategies, setCurrentStrategyId } from '../reducer'
import { useGetMyStrategiesQuery } from 'api/strategy'
import { useIsLogin, useUserInfo } from 'store/login/hooks'
import {
  useLazyDeleteStrategyQuery,
  useLazyDelistStrategyQuery,
  useLazyPauseStrategyQuery,
  useLazyRestartStrategyQuery,
} from 'api/createStrategy'
import { ParamFun } from 'types/global'

export function useMyStrategies() {
  const isLogin = useIsLogin()
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const myStrategies = useSelector((state: RootState) => state.mystrategy.myStrategies)
  const isLoadingMyStrategies = useSelector((state: RootState) => state.mystrategy.isLoadingMyStrategies)
  const { data, isLoading, refetch } = useGetMyStrategiesQuery(undefined, {
    skip: !userInfoId || !isLogin,
  })

  useEffect(() => {
    if (data) {
      const strategies = [...data.strategies]
      // 按 roe 倒序排列
      strategies.sort((a, b) => {
        const roeA = a.roe ?? 0
        const roeB = b.roe ?? 0
        return roeB - roeA
      })
      dispatch(updateMyStrategies(strategies))
    } else {
      dispatch(updateMyStrategies([]))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingMyStrategies(isLoading))
  }, [isLoading, dispatch])

  return { myStrategies, isLoadingMyStrategies, refetch }
}

export function usePauseStrategy() {
  const [triggerPauseStrategy] = useLazyPauseStrategyQuery()

  return useCallback(
    async (strategyId: string) => {
      try {
        const data = await triggerPauseStrategy({ strategy_id: strategyId })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerPauseStrategy],
  )
}

export function useRestartStrategy() {
  const [triggerRestartStrategy] = useLazyRestartStrategyQuery()

  return useCallback(
    async ({ strategyId, walletId }: { strategyId: string; walletId: string }) => {
      try {
        const data = await triggerRestartStrategy({ strategy_id: strategyId, wallet_id: walletId })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerRestartStrategy],
  )
}

export function useDelistStrategy() {
  const [triggerDelistStrategy] = useLazyDelistStrategyQuery()

  return useCallback(
    async ({ strategyId, walletId }: { strategyId: string; walletId: string }) => {
      try {
        const data = await triggerDelistStrategy({ strategy_id: strategyId, wallet_id: walletId })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerDelistStrategy],
  )
}

export function useDeleteStrategy() {
  const [triggerDeleteStrategy] = useLazyDeleteStrategyQuery()

  return useCallback(
    async (strategyId: string) => {
      try {
        const data = await triggerDeleteStrategy({ strategy_id: strategyId })
        return data
      } catch (error) {
        return error
      }
    },
    [triggerDeleteStrategy],
  )
}

export function useCurrentStrategyId(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const currentStrategyId = useSelector((state: RootState) => state.mystrategy.currentStrategyId)
  const updateCurrentStrategyId = useCallback(
    (strategyId: string) => {
      dispatch(setCurrentStrategyId(strategyId))
    },
    [dispatch],
  )
  return [currentStrategyId, updateCurrentStrategyId]
}
