import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateStrategyDetail, changeIsLoadingStrategyDetail } from '../reducer'
import { useCallback, useEffect, useMemo } from 'react'
import { useGetStrategyDetailQuery, useLazyEditStrategyQuery, useLazyGetStrategyDetailQuery } from 'api/createStrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useUserInfo } from 'store/login/hooks'
import { useStrategyTabIndex } from 'store/createstrategycache/hooks'
import { useStrategyCode } from './useCode'
import { usePaperTrading } from './usePaperTrading'
import { GENERATION_STATUS, STRATEGY_STATUS, STRATEGY_TAB_INDEX } from '../createstrategy'

export function useStrategyDetail({ strategyId }: { strategyId: string }) {
  const dispatch = useDispatch()
  const [{ userInfoId }] = useUserInfo()
  const strategyDetail = useSelector((state: RootState) => state.createstrategy.strategyDetail)
  const isLoadingStrategyDetail = useSelector((state: RootState) => state.createstrategy.isLoadingStrategyDetail)
  const { data, isLoading, error, refetch } = useGetStrategyDetailQuery(
    { strategyId },
    {
      skip: !strategyId || !userInfoId,
      refetchOnMountOrArgChange: true,
    },
  )
  const [triggerGetStrategyDetail] = useLazyGetStrategyDetailQuery()

  const fetchStrategyDetail = useCallback(
    async (id: string) => {
      try {
        const result = await triggerGetStrategyDetail({ strategyId: id })
        if (result.data?.status === 'success') {
          dispatch(updateStrategyDetail(result.data.data))
        }
        return result
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerGetStrategyDetail, dispatch],
  )

  useEffect(() => {
    if (data?.status === 'success') {
      dispatch(updateStrategyDetail(data.data))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(changeIsLoadingStrategyDetail({ isLoadingStrategyDetail: isLoading }))
  }, [isLoading, dispatch])

  return {
    strategyDetail,
    isLoadingStrategyDetail,
    error,
    refetch,
    fetchStrategyDetail,
  }
}

export function useEditStrategy() {
  const [triggerEditStrategy] = useLazyEditStrategyQuery()
  return useCallback(
    async ({ name, strategyId, description }: { name: string; strategyId: string; description: string }) => {
      try {
        const data = await triggerEditStrategy({ name, strategyId, description })
        return data
      } catch (error) {
        console.error(error)
        return null
      }
    },
    [triggerEditStrategy],
  )
}

export function useIsShowActionLayer() {
  const { strategyId } = useParsedQueryString()
  const [strategyInfoTabIndex] = useStrategyTabIndex(strategyId || undefined)
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const { strategyCode } = useStrategyCode({ strategyId: strategyId || '' })
  const { paperTradingCurrentData } = usePaperTrading({
    strategyId: strategyId || '',
  })
  const { strategy_config, status } = strategyDetail || {
    strategy_config: null,
    status: STRATEGY_STATUS.DRAFT,
  }
  const codeGenerated = strategyCode?.generation_status === GENERATION_STATUS.COMPLETED

  const isShowGenerateCodeOperation = useMemo(() => {
    return strategyInfoTabIndex === STRATEGY_TAB_INDEX.CREATE && !codeGenerated && !!strategy_config
  }, [strategyInfoTabIndex, codeGenerated, strategy_config])

  const isShowPaperTradingOperation = useMemo(() => {
    return strategyInfoTabIndex === STRATEGY_TAB_INDEX.CODE && codeGenerated && !paperTradingCurrentData
  }, [strategyInfoTabIndex, codeGenerated, paperTradingCurrentData])

  const isShowLaunchOperation = useMemo(() => {
    return strategyInfoTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING && status !== STRATEGY_STATUS.DEPLOYED
  }, [strategyInfoTabIndex, status])

  const isShowActionLayer = useMemo(() => {
    return isShowGenerateCodeOperation || isShowPaperTradingOperation || isShowLaunchOperation
  }, [isShowGenerateCodeOperation, isShowPaperTradingOperation, isShowLaunchOperation])
  return {
    isShowGenerateCodeOperation,
    isShowPaperTradingOperation,
    isShowLaunchOperation,
    isShowActionLayer,
  }
}
