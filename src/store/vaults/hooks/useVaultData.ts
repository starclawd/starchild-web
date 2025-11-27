import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateVaultLibraryStats,
  updateMyVaultStats,
  updateProtocolVaults,
  updateCommunityVaults,
  updateCommunityVaultsFilter,
  setLoadingLibraryStats,
  setLoadingMyStats,
  setLoadingProtocolVaults,
  setLoadingCommunityVaults,
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
export function useMyVaultStats(): [MyVaultStats | null, (value: MyVaultStats) => void] {
  const dispatch = useDispatch()
  const myVaultStats = useSelector((state: RootState) => state.vaults.myVaultStats)

  const setMyVaultStats = useCallback(
    (value: MyVaultStats) => {
      dispatch(updateMyVaultStats(value))
    },
    [dispatch],
  )

  return [myVaultStats, setMyVaultStats]
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
  const [myVaultStats, setMyVaultStats] = useMyVaultStats()
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
