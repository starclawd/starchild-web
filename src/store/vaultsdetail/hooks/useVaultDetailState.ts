import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import {
  setActiveTab as setActiveTabAction,
  setCurrentVaultId as setCurrentVaultIdAction,
  setChartTimeRange,
  setIsLoadingChart as setIsLoadingChartAction,
  resetVaultDetail,
} from '../reducer'
import { VaultDetailTabType } from '../vaultsdetail.d'
import { ParamFun } from 'types/global'

// activeTab状态管理
export function useActiveTab(): [VaultDetailTabType, ParamFun<VaultDetailTabType>] {
  const dispatch = useDispatch()
  const activeTab = useSelector((state: RootState) => state.vaultsdetail.activeTab)
  const setActiveTab = useCallback(
    (tab: VaultDetailTabType) => {
      dispatch(setActiveTabAction(tab))
    },
    [dispatch],
  )
  return [activeTab, setActiveTab]
}

// 当前vault ID状态管理
export function useCurrentVaultId(): [string | null, ParamFun<string | null>] {
  const dispatch = useDispatch()
  const currentVaultId = useSelector((state: RootState) => state.vaultsdetail.currentVaultId)
  const setCurrentVaultId = useCallback(
    (vaultId: string | null) => {
      dispatch(setCurrentVaultIdAction(vaultId))
    },
    [dispatch],
  )
  return [currentVaultId, setCurrentVaultId]
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
