import {
  useStartPaperTradingMutation,
  usePausePaperTradingMutation,
  useGetPaperTradingCurrentQuery,
  useLazyGetPaperTradingCurrentQuery,
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
  setIsShowExpandPaperTrading,
} from '../reducer'
import { useUserInfo } from 'store/login/hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ParamFun } from 'types/global'
import { useSendChatUserContent } from './useStream'
import { t } from '@lingui/core/macro'

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
  const [triggerGetPaperTradingCurrent] = useLazyGetPaperTradingCurrentQuery()

  const fetchPaperTrading = useCallback(
    async (id: string) => {
      try {
        const result = await triggerGetPaperTradingCurrent({ strategy_id: id })
        if (result.data?.status === 'success') {
          dispatch(updatePaperTradingCurrentData(result.data.data))
        }
        return result
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerGetPaperTradingCurrent, dispatch],
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
    fetchPaperTrading,
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
  const [isStartingPaperTrading] = useIsStartingPaperTrading()
  const sendChatUserContent = useSendChatUserContent()

  const handleStartPaperTrading = useCallback(async () => {
    if (isStartingPaperTrading) return
    sendChatUserContent({
      value: t`Start paper trading`,
    })
  }, [sendChatUserContent, isStartingPaperTrading])

  return handleStartPaperTrading
}

export function useHandlePausePaperTrading() {
  const [isPausingPaperTrading] = useIsPausingPaperTrading()
  const sendChatUserContent = useSendChatUserContent()

  const handlePausePaperTrading = useCallback(async () => {
    if (isPausingPaperTrading) return
    sendChatUserContent({
      value: t`Pause paper trading`,
    })
  }, [sendChatUserContent, isPausingPaperTrading])

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

export function useIsShowExpandPaperTrading(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowExpandPaperTrading = useSelector((state: RootState) => state.createstrategy.isShowExpandPaperTrading)
  const updateIsShowExpandPaperTrading = useCallback(
    (value: boolean) => {
      dispatch(setIsShowExpandPaperTrading(value))
    },
    [dispatch],
  )
  return [isShowExpandPaperTrading, updateIsShowExpandPaperTrading]
}
