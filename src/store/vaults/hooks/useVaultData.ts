import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateVaultLibraryStats,
  updateMyVaultStats,
  clearMyVaultStats,
  updateProtocolVaults,
  updateCommunityVaults,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingVaults,
  updateVaultsTabIndex,
  updateCurrentDepositAndWithdrawVault,
  updateAllVaults,
} from '../reducer'
import { VaultLibraryStats, MyVaultStats, ProtocolVault, CommunityVault } from '../vaults.d'
import { useGetVaultsQuery, useLazyGetVaultLibraryStatsQuery, useLazyGetMyVaultStatsQuery, VaultInfo } from 'api/vaults'
import {
  transformVaultLibraryStats,
  transformMyVaultStats,
  transformProtocolVaults,
  transformCommunityVaults,
} from '../dataTransforms'
import { useAppKitAccount } from '@reown/appkit/react'

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
  const { address } = useAppKitAccount()
  const [triggerGetMyVaultStats] = useLazyGetMyVaultStatsQuery()
  const dispatch = useDispatch()

  const fetchMyVaultStats = useCallback(async () => {
    const walletAddress = address

    if (!walletAddress) {
      return { success: false, error: 'No wallet address found' }
    }

    dispatch(setLoadingMyStats(true))

    try {
      const result = await triggerGetMyVaultStats({ wallet_address: walletAddress })
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
  }, [address, triggerGetMyVaultStats, setMyVaultStats, dispatch])

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
  const protocolVaults = useSelector((state: RootState) => state.vaults.protocolVaults)
  const communityVaults = useSelector((state: RootState) => state.vaults.communityVaults)
  const isLoadingVaults = useSelector((state: RootState) => state.vaults.isLoadingVaults)
  const dispatch = useDispatch()

  const { data: vaultsData, isLoading: vaultsLoading, refetch: refetchVaults } = useGetVaultsQuery({})

  useEffect(() => {
    if (vaultsData) {
      dispatch(updateAllVaults(vaultsData))
    }
  }, [vaultsData, dispatch])

  // 处理Protocol Vaults数据
  useEffect(() => {
    if (vaultsData) {
      const protocolVaultsData = vaultsData.filter((vault) => vault.vault_type === 'protocol')
      const transformedProtocolData = transformProtocolVaults(protocolVaultsData)
      dispatch(updateProtocolVaults(transformedProtocolData))
    }
  }, [vaultsData, dispatch])

  // 处理Community Vaults数据
  useEffect(() => {
    if (vaultsData) {
      const communityVaultsData = vaultsData.filter((vault) => vault.vault_type !== 'protocol')
      const transformedCommunityData = transformCommunityVaults(communityVaultsData)
      dispatch(updateCommunityVaults(transformedCommunityData))
    }
  }, [vaultsData, dispatch])

  // 更新加载状态
  useEffect(() => {
    dispatch(setLoadingVaults(vaultsLoading))
  }, [vaultsLoading, dispatch])

  return {
    protocolVaults,
    communityVaults,
    isLoadingVaults,
    refetchVaults,
  }
}

/**
 * Protocol Vaults数据管理hook - 兼容性保持
 */
export function useProtocolVaultsData() {
  const { protocolVaults, isLoadingVaults, refetchVaults } = useVaultsData()
  return {
    protocolVaults,
    isLoadingProtocolVaults: isLoadingVaults,
    refetchProtocolVaults: refetchVaults,
  }
}

/**
 * Community Vaults数据管理hook - 兼容性保持，删除updateFilter功能
 */
export function useCommunityVaultsData() {
  const { communityVaults, isLoadingVaults, refetchVaults } = useVaultsData()
  return {
    communityVaults,
    isLoadingCommunityVaults: isLoadingVaults,
    refetchCommunityVaults: refetchVaults,
  }
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
  const protocolVaults = useSelector((state: RootState) => state.vaults.protocolVaults)

  // 如果没有数据，返回空对象
  if (!protocolVaults || protocolVaults.length === 0) {
    return {}
  }

  // 过滤出有 raw 数据且有 vault_start_time 的金库
  const vaultsWithStartTime = protocolVaults
    .filter((vault) => vault.raw && vault.raw.vault_start_time)
    .map((vault) => ({
      vault_id: vault.id,
      vault_start_time: vault.raw!.vault_start_time,
    }))

  // 按照 vault_start_time 从早到晚排序
  vaultsWithStartTime.sort((a, b) => a.vault_start_time - b.vault_start_time)

  // 创建映射对象，将 vault_id 映射到 icon-strategy{index}
  const iconMapping: Record<string, string> = {}
  vaultsWithStartTime.forEach((vault, index) => {
    iconMapping[vault.vault_id] = `icon-strategy${index + 1}`
  })

  return iconMapping
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
