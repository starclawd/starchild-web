import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateStrategyDetail,
  changeIsLoadingStrategyDetail,
  setIsCreateStrategy,
  setCurrentStrategyTabIndex,
} from '../reducer'
import { useCallback, useEffect, useMemo } from 'react'
import { useGetStrategyDetailQuery, useLazyEditStrategyQuery, useLazyGetStrategyDetailQuery } from 'api/createStrategy'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useUserInfo } from 'store/login/hooks'
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
  const [currentStrategyTabIndex] = useCurrentStrategyTabIndex()
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
    return currentStrategyTabIndex === STRATEGY_TAB_INDEX.CREATE && !codeGenerated && !!strategy_config
  }, [currentStrategyTabIndex, codeGenerated, strategy_config])

  const isShowPaperTradingOperation = useMemo(() => {
    return currentStrategyTabIndex === STRATEGY_TAB_INDEX.CODE && codeGenerated && !paperTradingCurrentData
  }, [currentStrategyTabIndex, codeGenerated, paperTradingCurrentData])

  const isShowLaunchOperation = useMemo(() => {
    return currentStrategyTabIndex === STRATEGY_TAB_INDEX.PAPER_TRADING && status !== STRATEGY_STATUS.DEPLOYED
  }, [currentStrategyTabIndex, status])

  const isShowActionLayer = useMemo(() => {
    return isShowGenerateCodeOperation || isShowPaperTradingOperation || isShowLaunchOperation
  }, [isShowGenerateCodeOperation, isShowPaperTradingOperation, isShowLaunchOperation])

  const isShowGenerateCodeOperationWithoutTab = useMemo(() => {
    return !codeGenerated && !!strategy_config
  }, [codeGenerated, strategy_config])

  const isShowPaperTradingOperationWithoutTab = useMemo(() => {
    return codeGenerated && !paperTradingCurrentData
  }, [codeGenerated, paperTradingCurrentData])

  const isShowLaunchOperationWithoutTab = useMemo(() => {
    return status !== STRATEGY_STATUS.DEPLOYED
  }, [status])

  return {
    isShowGenerateCodeOperation,
    isShowPaperTradingOperation,
    isShowLaunchOperation,
    isShowActionLayer,
    isShowGenerateCodeOperationWithoutTab,
    isShowPaperTradingOperationWithoutTab,
    isShowLaunchOperationWithoutTab,
  }
}

export function useIsCreateStrategy(): [boolean, (value: boolean) => void] {
  const dispatch = useDispatch()
  const isCreateStrategy = useSelector((state: RootState) => state.createstrategy.isCreateStrategy)
  const updateIsCreateStrategy = useCallback(
    (value: boolean) => {
      dispatch(setIsCreateStrategy(value))
    },
    [dispatch],
  )
  return [isCreateStrategy, updateIsCreateStrategy]
}

export function useCurrentStrategyTabIndex(): [STRATEGY_TAB_INDEX, (index: STRATEGY_TAB_INDEX) => void] {
  const dispatch = useDispatch()
  const currentStrategyTabIndex = useSelector((state: RootState) => state.createstrategy.currentStrategyTabIndex)
  const updateCurrentStrategyTabIndex = useCallback(
    (index: STRATEGY_TAB_INDEX) => {
      dispatch(setCurrentStrategyTabIndex(index))
    },
    [dispatch],
  )
  return [currentStrategyTabIndex, updateCurrentStrategyTabIndex]
}
