import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateVaultLibraryStats,
  updateMyVaultStats,
  clearMyVaultStats,
  updateProtocolVaults,
  updateCommunityVaults,
  updateCommunityVaultsFilter,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingProtocolVaults,
  setLoadingCommunityVaults,
  updateVaultsTabIndex,
} from '../reducer'
import { VaultLibraryStats, MyVaultStats, ProtocolVault, CommunityVault, CommunityVaultFilter } from '../vaults.d'
import {
  useGetProtocolVaultsQuery,
  useGetCommunityVaultsQuery,
  useLazyGetVaultLibraryStatsQuery,
  useLazyGetMyVaultStatsQuery,
} from 'api/vaults'
import {
  transformVaultLibraryStats,
  transformMyVaultStats,
  transformProtocolVaults,
  transformCommunityVaults,
} from '../dataTransforms'
import { useVaultWalletInfo } from './useVaultWallet'

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
  const walletInfo = useVaultWalletInfo()
  const [triggerGetMyVaultStats] = useLazyGetMyVaultStatsQuery()
  const dispatch = useDispatch()

  const fetchMyVaultStats = useCallback(async () => {
    const walletAddress = walletInfo?.address

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
  }, [walletInfo?.address, triggerGetMyVaultStats, setMyVaultStats, dispatch])

  return {
    myVaultStats,
    isLoading,
    fetchMyVaultStats,
    clearMyVaultStats: clearMyVaultStatsData,
  }
}

/**
 * Protocol Vaults数据管理hook
 */
export function useProtocolVaultsData() {
  const protocolVaults = useSelector((state: RootState) => state.vaults.protocolVaults)
  const isLoadingProtocolVaults = useSelector((state: RootState) => state.vaults.isLoadingProtocolVaults)
  const dispatch = useDispatch()

  const {
    data: protocolVaultsData,
    isLoading: protocolVaultsLoading,
    refetch: refetchProtocolVaults,
  } = useGetProtocolVaultsQuery({})

  useEffect(() => {
    if (protocolVaultsData) {
      const transformedData = transformProtocolVaults(protocolVaultsData)
      dispatch(updateProtocolVaults(transformedData))
    }
  }, [protocolVaultsData, dispatch])

  useEffect(() => {
    dispatch(setLoadingProtocolVaults(protocolVaultsLoading))
  }, [protocolVaultsLoading, dispatch])

  return {
    protocolVaults,
    isLoadingProtocolVaults,
    refetchProtocolVaults,
  }
}

/**
 * Community Vaults数据管理hook
 */
export function useCommunityVaultsData() {
  const communityVaults = useSelector((state: RootState) => state.vaults.communityVaults)
  const filter = useSelector((state: RootState) => state.vaults.communityVaultsFilter)
  const isLoadingCommunityVaults = useSelector((state: RootState) => state.vaults.isLoadingCommunityVaults)
  const dispatch = useDispatch()

  const {
    data: communityVaultsData,
    isLoading: communityVaultsLoading,
    refetch: refetchCommunityVaults,
  } = useGetCommunityVaultsQuery({
    filter: filter.statusFilter !== 'all' ? filter.statusFilter : undefined,
    sortBy: filter.sortBy,
    hideZeroBalances: filter.hideZeroBalances,
  })

  useEffect(() => {
    if (communityVaultsData) {
      const transformedData = transformCommunityVaults(communityVaultsData)
      dispatch(updateCommunityVaults(transformedData))
    }
  }, [communityVaultsData, dispatch])

  useEffect(() => {
    dispatch(setLoadingCommunityVaults(communityVaultsLoading))
  }, [communityVaultsLoading, dispatch])

  const updateFilter = useCallback(
    (newFilter: Partial<CommunityVaultFilter>) => {
      dispatch(updateCommunityVaultsFilter(newFilter))
      // 过滤条件改变时，重新获取数据
      setTimeout(() => {
        refetchCommunityVaults()
      }, 0)
    },
    [dispatch, refetchCommunityVaults],
  )

  return {
    communityVaults,
    filter,
    isLoadingCommunityVaults,
    updateFilter,
    refetchCommunityVaults,
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
