import {
  useStartPaperTradingMutation,
  usePausePaperTradingMutation,
  useGetPaperTradingCurrentQuery,
} from 'api/createStrategy'
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updatePaperTradingCurrentData,
  changeIsLoadingPaperTradingCurrent,
  setIsStartingPaperTrading,
  setIsPausingPaperTrading,
  setIsShowSignals,
  setShouldRefreshData,
} from '../reducer'
import { useUserInfo } from 'store/login/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ParamFun } from 'types/global'

export function usePaperTrading({ strategyId }: { strategyId: string }) {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const paperTradingCurrentData = useSelector((state: RootState) => state.createstrategy.paperTradingCurrentData)
  const isLoadingPaperTradingCurrent = useSelector(
    (state: RootState) => state.createstrategy.isLoadingPaperTradingCurrent,
  )

  const { data, isLoading, error, refetch } = useGetPaperTradingCurrentQuery(
    { strategy_id: strategyId },
    {
      skip: !strategyId || !userInfoId,
      refetchOnMountOrArgChange: true,
    },
  )

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updatePaperTradingCurrentData(data.data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(changeIsLoadingPaperTradingCurrent({ isLoadingPaperTradingCurrent: isLoading }))
  }, [isLoading, dispatch])

  return {
    paperTradingCurrentData,
    isLoadingPaperTradingCurrent,
    error,
    refetch,
  }
}

export function useStartPaperTradingAction() {
  const [triggerStartPaperTrading] = useStartPaperTradingMutation()

  return useCallback(
    async (strategyId: string) => {
      try {
        const data = await triggerStartPaperTrading({ strategy_id: strategyId })
        return data
      } catch (error) {
        console.error('Start paper trading failed:', error)
        return null
      }
    },
    [triggerStartPaperTrading],
  )
}

export function usePausePaperTradingAction() {
  const [triggerPausePaperTrading] = usePausePaperTradingMutation()

  return useCallback(
    async (strategyId: string) => {
      try {
        const data = await triggerPausePaperTrading({ strategy_id: strategyId })
        return data
      } catch (error) {
        console.error('Pause paper trading failed:', error)
        return null
      }
    },
    [triggerPausePaperTrading],
  )
}

export function useIsStartingPaperTrading(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isStartingPaperTrading = useSelector((state: RootState) => state.createstrategy.isStartingPaperTrading)
  const updateIsStartingPaperTrading = useCallback(
    (value: boolean) => {
      dispatch(setIsStartingPaperTrading(value))
    },
    [dispatch],
  )
  return [isStartingPaperTrading, updateIsStartingPaperTrading]
}

export function useIsPausingPaperTrading(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isPausingPaperTrading = useSelector((state: RootState) => state.createstrategy.isPausingPaperTrading)
  const updateIsPausingPaperTrading = useCallback(
    (value: boolean) => {
      dispatch(setIsPausingPaperTrading(value))
    },
    [dispatch],
  )
  return [isPausingPaperTrading, updateIsPausingPaperTrading]
}

export function useHandleStartPaperTrading() {
  const dispatch = useDispatch()
  const { strategyId } = useParsedQueryString()
  const { refetch: refetchPaperTrading } = usePaperTrading({ strategyId: strategyId || '' })
  const [isStartingPaperTrading, setIsStartingPaperTrading] = useIsStartingPaperTrading()
  const triggerStartPaperTrading = useStartPaperTradingAction()

  const handleStartPaperTrading = useCallback(async () => {
    try {
      if (isStartingPaperTrading) return
      setIsStartingPaperTrading(true)
      const data = await triggerStartPaperTrading(strategyId || '')
      if (data?.data?.status === 'success') {
        await refetchPaperTrading()
        // 触发数据重新获取
        dispatch(setShouldRefreshData(true))
      }
      setIsStartingPaperTrading(false)
    } catch (error) {
      console.error('handleStartPaperTrading error', error)
      setIsStartingPaperTrading(false)
    }
  }, [
    strategyId,
    triggerStartPaperTrading,
    refetchPaperTrading,
    setIsStartingPaperTrading,
    isStartingPaperTrading,
    dispatch,
  ])

  return handleStartPaperTrading
}

export function useHandlePausePaperTrading() {
  const { strategyId } = useParsedQueryString()
  const { refetch: refetchPaperTrading } = usePaperTrading({ strategyId: strategyId || '' })
  const [isPausingPaperTrading, setIsPausingPaperTrading] = useIsPausingPaperTrading()
  const triggerPausePaperTrading = usePausePaperTradingAction()

  const handlePausePaperTrading = useCallback(async () => {
    try {
      if (isPausingPaperTrading) return
      setIsPausingPaperTrading(true)
      const data = await triggerPausePaperTrading(strategyId || '')
      if (data?.data?.status === 'success') {
        await refetchPaperTrading()
      }
      setIsPausingPaperTrading(false)
    } catch (error) {
      console.error('handlePausePaperTrading error', error)
      setIsPausingPaperTrading(false)
    }
  }, [strategyId, triggerPausePaperTrading, refetchPaperTrading, setIsPausingPaperTrading, isPausingPaperTrading])

  return handlePausePaperTrading
}

export function useIsShowSignals(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowSignals = useSelector((state: RootState) => state.createstrategy.isShowSignals)
  const updateIsShowSignals = useCallback(
    (value: boolean) => {
      dispatch(setIsShowSignals(value))
    },
    [dispatch],
  )
  return [isShowSignals, updateIsShowSignals]
}

