import { useStartPaperTradingMutation, useGetPaperTradingCurrentQuery } from 'api/createStrategy'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updatePaperTradingCurrentData, changeIsLoadingPaperTradingCurrent } from '../reducer'
import { useUserInfo } from 'store/login/hooks'

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
