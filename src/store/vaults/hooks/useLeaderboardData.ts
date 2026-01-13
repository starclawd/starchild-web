import { useMemo } from 'react'
import { useGetBalanceHistoryLeaderboardQuery } from '../../../api/strategy'

export interface LeaderboardVault {
  vaultId: string
  strategyId: string
  strategyName: string
  balance: number
  creatorAvatar?: string
}

/**
 * Leaderboard数据管理hook
 */
export const useLeaderboardData = () => {
  const { data: leaderboardResponse, isLoading } = useGetBalanceHistoryLeaderboardQuery()

  const leaderboardData = useMemo(() => {
    if (!leaderboardResponse?.strategies) {
      return []
    }

    const vaults: LeaderboardVault[] = []

    leaderboardResponse.strategies.forEach((strategy) => {
      vaults.push({
        vaultId: strategy.vault_id,
        strategyId: strategy.strategy_id,
        strategyName: strategy.strategy_name,
        balance: strategy.latest_available_balance,
        creatorAvatar: strategy.user_info?.user_avatar,
      })
    })

    return vaults
  }, [leaderboardResponse?.strategies])

  return {
    leaderboardData,
    isLoading,
    topVaults: leaderboardData.slice(0, 10), // 取前10名
    allVaults: leaderboardData,
  }
}
