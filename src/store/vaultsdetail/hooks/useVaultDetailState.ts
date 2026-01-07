import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useState } from 'react'
import { RootState } from 'store'
import {
  setActiveTab as setActiveTabAction,
  setChartType as setChartTypeAction,
  setIsLoadingChart as setIsLoadingChartAction,
  setCurrentStrategyId as setCurrentStrategyIdAction,
  resetVaultDetail,
} from '../reducer'
import { DETAIL_TYPE, CHART_TYPE, CHAT_TIME_RANGE } from '../vaultsdetail.d'
import { ParamFun } from 'types/global'

// activeTab状态管理
export function useActiveTab(): [DETAIL_TYPE, ParamFun<DETAIL_TYPE>] {
  const dispatch = useDispatch()
  const activeTab = useSelector((state: RootState) => state.vaultsdetail.activeTab)
  const setActiveTab = useCallback(
    (tab: DETAIL_TYPE) => {
      dispatch(setActiveTabAction(tab))
    },
    [dispatch],
  )
  return [activeTab, setActiveTab]
}

// 当前vault ID - 从strategyInfo获取vault_id
export function useCurrentVaultId(): string | null {
  return useSelector((state: RootState) => state.vaultsdetail.strategyInfo?.vault_id || null)
}

// 当前strategy ID状态管理
export function useCurrentStrategyId(): [string | null, ParamFun<string | null>] {
  const dispatch = useDispatch()
  const currentStrategyId = useSelector((state: RootState) => state.vaultsdetail.currentStrategyId)
  const setCurrentStrategyId = useCallback(
    (strategyId: string | null) => {
      dispatch(setCurrentStrategyIdAction(strategyId))
    },
    [dispatch],
  )
  return [currentStrategyId, setCurrentStrategyId]
}

// 图表类型状态管理
export function useChartType(): [CHART_TYPE, ParamFun<CHART_TYPE>] {
  const dispatch = useDispatch()
  const chartType = useSelector((state: RootState) => state.vaultsdetail.chartType)
  const setChartType = useCallback(
    (type: CHART_TYPE) => {
      dispatch(setChartTypeAction(type))
    },
    [dispatch],
  )
  return [chartType, setChartType]
}

// 图表加载状态管理
export function useIsLoadingChart(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isLoadingChart = useSelector((state: RootState) => state.vaultsdetail.isLoadingChart)
  const setIsLoadingChart = useCallback(
    (isLoading: boolean) => {
      dispatch(setIsLoadingChartAction(isLoading))
    },
    [dispatch],
  )
  return [isLoadingChart, setIsLoadingChart]
}

// 重置VaultDetail状态
export const useResetVaultDetail = () => {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetVaultDetail())
  }, [dispatch])
}

// 获取完整的VaultDetail状态
export const useVaultDetailState = () => {
  return useSelector((state: RootState) => state.vaultsdetail)
}
