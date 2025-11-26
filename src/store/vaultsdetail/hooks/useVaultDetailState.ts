import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { setActiveTab, setCurrentVaultId, setChartTimeRange, setIsLoadingChart, resetVaultDetail } from '../reducer'
import { VaultDetailTabType } from '../vaultsdetail.d'

// 获取activeTab状态
export const useActiveTab = () => {
  return useSelector((state: RootState) => state.vaultsdetail.activeTab)
}

// 设置activeTab
export const useSetActiveTab = () => {
  const dispatch = useDispatch()
  return useCallback(
    (tab: VaultDetailTabType) => {
      dispatch(setActiveTab(tab))
    },
    [dispatch],
  )
}

// 获取当前vault ID
export const useCurrentVaultId = () => {
  return useSelector((state: RootState) => state.vaultsdetail.currentVaultId)
}

// 设置当前vault ID
export const useSetCurrentVaultId = () => {
  const dispatch = useDispatch()
  return useCallback(
    (vaultId: string | null) => {
      dispatch(setCurrentVaultId(vaultId))
    },
    [dispatch],
  )
}

// 获取图表加载状态
export const useIsLoadingChart = () => {
  return useSelector((state: RootState) => state.vaultsdetail.isLoadingChart)
}

// 设置图表加载状态
export const useSetIsLoadingChart = () => {
  const dispatch = useDispatch()
  return useCallback(
    (isLoading: boolean) => {
      dispatch(setIsLoadingChart(isLoading))
    },
    [dispatch],
  )
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
