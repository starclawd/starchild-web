import { useMemo } from 'react'
import { useProtocolVaultsData, useCommunityVaultsData } from './useVaultData'

export interface LeaderboardVault {
  id: string
  name: string
  pnl: number
  pnlFormatted: string
  type: 'protocol' | 'community'
  tvl: string
  apy: string
  additional?: {
    builder?: string
    strategyProvider?: string
    description?: string
    depositors?: number
  }
}

/**
 * 格式化PnL数值显示
 */
const formatPnL = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`
  } else {
    return `$${value.toFixed(2)}`
  }
}

/**
 * Leaderboard数据管理hook
 */
export const useLeaderboardData = () => {
  const { protocolVaults, isLoadingProtocolVaults } = useProtocolVaultsData()
  const { communityVaults, isLoadingCommunityVaults } = useCommunityVaultsData()

  const leaderboardData = useMemo(() => {
    const vaults: LeaderboardVault[] = []

    // // 处理Protocol Vaults
    // protocolVaults.forEach((vault) => {
    //   const pnl = vault.raw?.vault_lifetime_net_pnl ?? 0
    //   vaults.push({
    //     id: vault.id,
    //     name: vault.name,
    //     pnl,
    //     pnlFormatted: formatPnL(pnl),
    //     type: 'protocol',
    //     tvl: vault.tvl,
    //     apy: vault.allTimeApy,
    //     additional: {
    //       description: vault.description,
    //       depositors: vault.depositors,
    //     },
    //   })
    // })

    // 处理Community Vaults
    communityVaults.forEach((vault) => {
      const pnl = vault.allTimePnL ?? 0
      vaults.push({
        id: vault.id,
        name: vault.name,
        pnl,
        pnlFormatted: formatPnL(pnl),
        type: 'community',
        tvl: vault.tvl,
        apy: vault.allTimeApy,
        additional: {
          builder: vault.builder,
          strategyProvider: vault.strategyProvider,
        },
      })
    })

    // 按PnL降序排序
    return vaults.sort((a, b) => b.pnl - a.pnl)
  }, [communityVaults])

  const isLoading = isLoadingProtocolVaults || isLoadingCommunityVaults

  return {
    leaderboardData,
    isLoading,
    topVaults: leaderboardData.slice(0, 10), // 取前10名
    allVaults: leaderboardData,
  }
}
