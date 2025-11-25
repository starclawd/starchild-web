import { useCallback } from 'react'
import {
  useLazyGetVaultLibraryStatsQuery,
  useLazyGetMyVaultStatsQuery,
  useLazyGetProtocolVaultsQuery,
  useLazyGetCommunityVaultsQuery,
} from 'api/vaults'
import { useUserInfo } from 'store/login/hooks'

/**
 * Vault API操作hooks
 */
export function useVaultApiOperations() {
  const [fetchLibraryStats] = useLazyGetVaultLibraryStatsQuery()
  const [fetchMyStats] = useLazyGetMyVaultStatsQuery()
  const [fetchProtocolVaults] = useLazyGetProtocolVaultsQuery()
  const [fetchCommunityVaults] = useLazyGetCommunityVaultsQuery()

  const [userInfo] = useUserInfo()

  // 判断是否已登录（通过 userInfoId 判断）
  const isLoggedIn = Boolean(userInfo?.userInfoId)

  // 获取钱包地址，优先 walletAddress，然后是 secondaryWalletAddress
  const walletAddress = userInfo?.walletAddress || userInfo?.secondaryWalletAddress

  const fetchAllData = useCallback(async () => {
    try {
      // 先获取公共数据
      await Promise.all([
        fetchLibraryStats({}).unwrap(),
        fetchProtocolVaults({}).unwrap(),
        fetchCommunityVaults({}).unwrap(),
      ])

      // 只有在用户已登录且有钱包地址时才获取个人统计
      if (isLoggedIn && walletAddress) {
        await fetchMyStats({ wallet_address: walletAddress }).unwrap()
      }
    } catch (error) {
      console.error('Failed to fetch vault data:', error)
    }
  }, [fetchLibraryStats, fetchMyStats, fetchProtocolVaults, fetchCommunityVaults, isLoggedIn, walletAddress])

  const fetchLibraryData = useCallback(async () => {
    try {
      // 先获取库统计数据
      await fetchLibraryStats({}).unwrap()

      // 只有在用户已登录且有钱包地址时才获取个人统计
      if (isLoggedIn && walletAddress) {
        await fetchMyStats({ wallet_address: walletAddress }).unwrap()
      }
    } catch (error) {
      console.error('Failed to fetch library data:', error)
    }
  }, [fetchLibraryStats, fetchMyStats, isLoggedIn, walletAddress])

  const fetchProtocolVaultsData = useCallback(async () => {
    try {
      await fetchProtocolVaults({}).unwrap()
    } catch (error) {
      console.error('Failed to fetch protocol vaults:', error)
    }
  }, [fetchProtocolVaults])

  const fetchCommunityVaultsData = useCallback(
    async (params?: { filter?: string; sortBy?: string; hideZeroBalances?: boolean }) => {
      try {
        await fetchCommunityVaults(params || {}).unwrap()
      } catch (error) {
        console.error('Failed to fetch community vaults:', error)
      }
    },
    [fetchCommunityVaults],
  )

  return {
    fetchAllData,
    fetchLibraryData,
    fetchProtocolVaultsData,
    fetchCommunityVaultsData,
  }
}
