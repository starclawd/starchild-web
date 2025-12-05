import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateVaultLibraryStats,
  updateMyVaultStats,
  clearMyVaultStats,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingVaults,
  updateVaultsTabIndex,
  updateCurrentDepositAndWithdrawVault,
  updateAllVaults,
} from '../reducer'
import { VaultLibraryStats, MyVaultStats } from '../vaults.d'
import { useGetVaultsQuery, useLazyGetVaultLibraryStatsQuery, useLazyGetMyVaultStatsQuery, VaultInfo } from 'api/vaults'
import { transformVaultLibraryStats, transformMyVaultStats } from '../dataTransforms'
import { useAppKitAccount } from '@reown/appkit/react'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'

/**
 * VaultLibraryStats数据管理hook
 */
export function useVaultLibraryStats(): [VaultLibraryStats | null, (value: VaultLibraryStats) => void] {
  const dispatch = useDispatch()
  const vaultLibraryStats = useSelector((state: RootState) => state.vaults.vaultLibraryStats)

  const setVaultLibraryStats = useCallback(
    (value: VaultLibraryStats) => {
      dispatch(updateVaultLibraryStats(value))
    },
    [dispatch],
  )

  return [vaultLibraryStats, setVaultLibraryStats]
}

/**
 * MyVaultStats数据管理hook
 */
export function useMyVaultStats(): [MyVaultStats | null, (value: MyVaultStats) => void, () => void] {
  const dispatch = useDispatch()
  const myVaultStats = useSelector((state: RootState) => state.vaults.myVaultStats)

  const setMyVaultStats = useCallback(
    (value: MyVaultStats) => {
      dispatch(updateMyVaultStats(value))
    },
    [dispatch],
  )

  const clearMyVaultStatsData = useCallback(() => {
    dispatch(clearMyVaultStats())
  }, [dispatch])

  return [myVaultStats, setMyVaultStats, clearMyVaultStatsData]
}

/**
 * VaultLibraryStats API数据获取hook
 */
export function useFetchVaultLibraryStatsData() {
  const [vaultLibraryStats, setVaultLibraryStats] = useVaultLibraryStats()
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingLibraryStats)
  const [triggerGetVaultLibraryStats] = useLazyGetVaultLibraryStatsQuery()
  const dispatch = useDispatch()

  const fetchVaultLibraryStats = useCallback(async () => {
    dispatch(setLoadingLibraryStats(true))

    try {
      const result = await triggerGetVaultLibraryStats({})
      if (result.data) {
        const transformedData = transformVaultLibraryStats(result.data)
        setVaultLibraryStats(transformedData)
        return { success: true, data: transformedData }
      } else {
        console.error('Failed to fetch vault library stats:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error fetching vault library stats:', error)
      return { success: false, error }
    } finally {
      dispatch(setLoadingLibraryStats(false))
    }
  }, [triggerGetVaultLibraryStats, setVaultLibraryStats, dispatch])

  return {
    vaultLibraryStats,
    isLoading,
    fetchVaultLibraryStats,
  }
}

/**
 * MyVaultStats API数据获取hook
 */
export function useFetchMyVaultStatsData() {
  const [myVaultStats, setMyVaultStats, clearMyVaultStatsData] = useMyVaultStats()
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingMyStats)
  const [isValidWallet, address] = useValidVaultWalletAddress()
  const [triggerGetMyVaultStats] = useLazyGetMyVaultStatsQuery()
  const dispatch = useDispatch()

  const fetchMyVaultStats = useCallback(async () => {
    if (!isValidWallet) {
      return { success: false, error: 'Invalid wallet address' }
    }

    dispatch(setLoadingMyStats(true))

    try {
      const result = await triggerGetMyVaultStats({ wallet_address: address || '' })
      if (result.data) {
        const transformedData = transformMyVaultStats(result.data)
        setMyVaultStats(transformedData)
        return { success: true, data: transformedData }
      } else {
        console.error('Failed to fetch my vault stats:', result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error fetching my vault stats:', error)
      return { success: false, error }
    } finally {
      dispatch(setLoadingMyStats(false))
    }
  }, [isValidWallet, address, triggerGetMyVaultStats, setMyVaultStats, dispatch])

  return {
    myVaultStats,
    isLoading,
    fetchMyVaultStats,
    clearMyVaultStats: clearMyVaultStatsData,
  }
}

/**
 * 合并的Vaults数据管理hook - 统一获取数据，分别处理protocol和community类型
 */
export function useVaultsData() {
  const allVaults = useSelector((state: RootState) => state.vaults.allVaults)
  const isLoadingVaults = useSelector((state: RootState) => state.vaults.isLoadingVaults)
  const dispatch = useDispatch()

  const { data: vaultsData, isLoading: vaultsLoading, refetch: refetchVaults } = useGetVaultsQuery({})

  useEffect(() => {
    if (vaultsData) {
      dispatch(updateAllVaults(vaultsData))
    }
  }, [vaultsData, dispatch])
  // 更新加载状态
  useEffect(() => {
    dispatch(setLoadingVaults(vaultsLoading))
  }, [vaultsLoading, dispatch])

  return {
    allVaults,
    isLoadingVaults,
    refetchVaults,
  }
}

export function useVaultByVaultId(vaultId: string): VaultInfo | null {
  const { allVaults } = useVaultsData()
  return allVaults.find((vault) => vault.vault_id === vaultId) || null
}

export function useVaultsTabIndex(): [number, (index: number) => void] {
  const vaultsTabIndex = useSelector((state: RootState) => state.vaults.vaultsTabIndex)
  const dispatch = useDispatch()
  const setVaultsTabIndex = useCallback(
    (index: number) => {
      dispatch(updateVaultsTabIndex(index))
    },
    [dispatch],
  )
  return [vaultsTabIndex, setVaultsTabIndex]
}

/**
 * 获取策略图标名称映射
 * 注意：只支持Protocol Vaults。Community Vaults需要获取创建者的头像展示
 */
export function useGetStrategyIconName(): Record<string, string> {
  const allStrategies = useSelector((state: RootState) => state.vaults.allStrategies)

  return useMemo(() => {
    // 如果没有数据，返回空对象
    if (!allStrategies || allStrategies.length === 0) {
      return {}
    }

    // 过滤出有有 vault_start_time 的金库
    const vaultsWithStartTime = [...allStrategies]

    // 按照 vault_start_time 从早到晚排序
    vaultsWithStartTime.sort((a, b) => a.ageDays - b.ageDays)

    // 创建映射对象，将 vault_id 映射到 icon-strategy{index}
    const iconMapping: Record<string, string> = {}
    vaultsWithStartTime.forEach((vault, index) => {
      iconMapping[vault.strategyId] = `icon-strategy${index + 1}`
    })

    return iconMapping
  }, [allStrategies])
}

export function useCurrentDepositAndWithdrawVault(): [VaultInfo | null, (vault: VaultInfo | null) => void] {
  const currentDepositAndWithdrawVault = useSelector((state: RootState) => state.vaults.currentDepositAndWithdrawVault)
  const dispatch = useDispatch()
  const setCurrentDepositAndWithdrawVault = useCallback(
    (vault: VaultInfo | null) => {
      dispatch(updateCurrentDepositAndWithdrawVault(vault))
    },
    [dispatch],
  )
  return [currentDepositAndWithdrawVault, setCurrentDepositAndWithdrawVault]
}

export function useAllVaults(): VaultInfo[] {
  const allVaults = useSelector((state: RootState) => state.vaults.allVaults)
  return allVaults
}
