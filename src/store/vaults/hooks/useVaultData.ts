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
  updateVaultsTabIndex,
} from '../reducer'
import { VaultLibraryStats, MyVaultStats, ProtocolVault, CommunityVault, CommunityVaultFilter } from '../vaults'
import {
  useGetVaultLibraryStatsQuery,
  useGetMyVaultStatsQuery,
  useGetProtocolVaultsQuery,
  useGetCommunityVaultsQuery,
} from 'api/vaults'
import {
  transformVaultLibraryStats,
  transformMyVaultStats,
  transformProtocolVaults,
  transformCommunityVaults,
} from '../dataTransforms'
import { useUserInfo } from 'store/login/hooks'
import { useVaultWalletInfo } from './useVaultWallet'

/**
 * Vault概览数据管理hook
 */
export function useVaultOverviewData() {
  const vaultLibraryStats = useSelector((state: RootState) => state.vaults.vaultLibraryStats)
  const myVaultStats = useSelector((state: RootState) => state.vaults.myVaultStats)
  const isLoadingLibraryStats = useSelector((state: RootState) => state.vaults.isLoadingLibraryStats)
  const isLoadingMyStats = useSelector((state: RootState) => state.vaults.isLoadingMyStats)
  const [userInfo] = useUserInfo()
  const walletInfo = useVaultWalletInfo()
  const dispatch = useDispatch()

  // 判断是否已登录（通过 userInfoId 判断）
  const isLoggedIn = Boolean(userInfo?.userInfoId)

  // 获取钱包地址
  const walletAddress = walletInfo?.address

  // API查询 - Library Stats (不需要认证)
  const {
    data: libraryStatsData,
    isLoading: libraryStatsLoading,
    error: libraryStatsError,
    refetch: refetchLibraryStats,
  } = useGetVaultLibraryStatsQuery({})

  // API查询 - My Stats (需要用户已登录且有钱包地址)
  const {
    data: myStatsData,
    isLoading: myStatsLoading,
    refetch: refetchMyStats,
  } = useGetMyVaultStatsQuery(
    { wallet_address: walletAddress! },
    {
      skip: !isLoggedIn || !walletAddress, // 未登录或无钱包地址时跳过
    },
  )

  // 更新状态 - Library Stats
  useEffect(() => {
    if (libraryStatsData) {
      const transformedData = transformVaultLibraryStats(libraryStatsData)
      dispatch(updateVaultLibraryStats(transformedData))
    }
  }, [libraryStatsData, dispatch])

  // 临时测试数据 - 确保组件能够显示
  useEffect(() => {
    if (!libraryStatsData && !libraryStatsLoading) {
      console.log('No data and not loading, setting test data')
      const testData = {
        tvl: '$17.02M',
        allTimePnL: '+$1.24M',
        vaultCount: 3,
      }
      dispatch(updateVaultLibraryStats(testData))
    }
  }, [libraryStatsData, libraryStatsLoading, dispatch])

  // 更新状态 - My Stats
  useEffect(() => {
    if (myStatsData) {
      const transformedData = transformMyVaultStats(myStatsData)
      dispatch(updateMyVaultStats(transformedData))
    }
  }, [myStatsData, dispatch])

  useEffect(() => {
    dispatch(setLoadingLibraryStats(libraryStatsLoading))
  }, [libraryStatsLoading, dispatch])

  useEffect(() => {
    dispatch(setLoadingMyStats(myStatsLoading))
  }, [myStatsLoading, dispatch])

  // 临时测试数据 - 确保 MyVaultStats 组件能够显示
  useEffect(() => {
    if (!myStatsData && !myStatsLoading && !isLoggedIn) {
      console.log('Setting test data for MyVaultStats (not logged in)')
      const testMyStats = {
        vaultCount: '--',
        myTvl: '--',
        myAllTimePnL: '--',
      }
      dispatch(updateMyVaultStats(testMyStats))
    }
  }, [myStatsData, myStatsLoading, isLoggedIn, dispatch])

  const refreshData = useCallback(() => {
    refetchLibraryStats()
    if (isLoggedIn && walletAddress) {
      refetchMyStats()
    }
  }, [refetchLibraryStats, refetchMyStats, isLoggedIn, walletAddress])

  return {
    vaultLibraryStats,
    myVaultStats,
    isLoadingLibraryStats,
    isLoadingMyStats,
    refreshData,
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
