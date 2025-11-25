import { useCallback } from 'react'
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
} from './reducer'
import {
  VaultLibraryStats,
  MyVaultStats,
  ProtocolVault,
  CommunityVault,
  CommunityVaultFilter,
} from './vaults'

/**
 * 获取和设置Vault库统计数据
 */
export function useVaultLibraryStats(): [VaultLibraryStats | null, (stats: VaultLibraryStats) => void] {
  const vaultLibraryStats = useSelector((state: RootState) => state.vaults.vaultLibraryStats)
  const dispatch = useDispatch()

  const setVaultLibraryStats = useCallback(
    (stats: VaultLibraryStats) => {
      dispatch(updateVaultLibraryStats(stats))
    },
    [dispatch],
  )

  return [vaultLibraryStats, setVaultLibraryStats]
}

/**
 * 获取和设置我的Vault统计数据
 */
export function useMyVaultStats(): [MyVaultStats | null, (stats: MyVaultStats) => void] {
  const myVaultStats = useSelector((state: RootState) => state.vaults.myVaultStats)
  const dispatch = useDispatch()

  const setMyVaultStats = useCallback(
    (stats: MyVaultStats) => {
      dispatch(updateMyVaultStats(stats))
    },
    [dispatch],
  )

  return [myVaultStats, setMyVaultStats]
}

/**
 * 获取和设置Protocol Vaults
 */
export function useProtocolVaults(): [ProtocolVault[], (vaults: ProtocolVault[]) => void] {
  const protocolVaults = useSelector((state: RootState) => state.vaults.protocolVaults)
  const dispatch = useDispatch()

  const setProtocolVaults = useCallback(
    (vaults: ProtocolVault[]) => {
      dispatch(updateProtocolVaults(vaults))
    },
    [dispatch],
  )

  return [protocolVaults, setProtocolVaults]
}

/**
 * 获取和设置Community Vaults
 */
export function useCommunityVaults(): [CommunityVault[], (vaults: CommunityVault[]) => void] {
  const communityVaults = useSelector((state: RootState) => state.vaults.communityVaults)
  const dispatch = useDispatch()

  const setCommunityVaults = useCallback(
    (vaults: CommunityVault[]) => {
      dispatch(updateCommunityVaults(vaults))
    },
    [dispatch],
  )

  return [communityVaults, setCommunityVaults]
}

/**
 * 获取和设置Community Vaults过滤条件
 */
export function useCommunityVaultsFilter(): [CommunityVaultFilter, (filter: Partial<CommunityVaultFilter>) => void] {
  const filter = useSelector((state: RootState) => state.vaults.communityVaultsFilter)
  const dispatch = useDispatch()

  const setFilter = useCallback(
    (newFilter: Partial<CommunityVaultFilter>) => {
      dispatch(updateCommunityVaultsFilter(newFilter))
    },
    [dispatch],
  )

  return [filter, setFilter]
}

/**
 * 库统计数据加载状态
 */
export function useIsLoadingLibraryStats(): [boolean, (loading: boolean) => void] {
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingLibraryStats)
  const dispatch = useDispatch()

  const setIsLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingLibraryStats(loading))
    },
    [dispatch],
  )

  return [isLoading, setIsLoading]
}

/**
 * 我的统计数据加载状态
 */
export function useIsLoadingMyStats(): [boolean, (loading: boolean) => void] {
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingMyStats)
  const dispatch = useDispatch()

  const setIsLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingMyStats(loading))
    },
    [dispatch],
  )

  return [isLoading, setIsLoading]
}

/**
 * Protocol Vaults加载状态
 */
export function useIsLoadingProtocolVaults(): [boolean, (loading: boolean) => void] {
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingProtocolVaults)
  const dispatch = useDispatch()

  const setIsLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingProtocolVaults(loading))
    },
    [dispatch],
  )

  return [isLoading, setIsLoading]
}

/**
 * Community Vaults加载状态
 */
export function useIsLoadingCommunityVaults(): [boolean, (loading: boolean) => void] {
  const isLoading = useSelector((state: RootState) => state.vaults.isLoadingCommunityVaults)
  const dispatch = useDispatch()

  const setIsLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingCommunityVaults(loading))
    },
    [dispatch],
  )

  return [isLoading, setIsLoading]
}
