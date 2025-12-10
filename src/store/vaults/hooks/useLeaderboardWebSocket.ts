import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateLeaderboardBalances, clearLeaderboardBalances } from '../reducer'
import { LeaderboardBalanceData, LeaderboardBalanceUpdate } from '../vaults.d'
import { useInsightsSubscription } from 'store/insights/hooks'
import { STRATEGY_BALANCE_UPDATE_SUB_ID, STRATEGY_BALANCE_UPDATE_UNSUB_ID } from 'store/websocket/websocket'

/**
 * Leaderboard余额更新hook
 */
export function useLeaderboardBalanceUpdates(): [LeaderboardBalanceUpdate, (value: LeaderboardBalanceData[]) => void] {
  const dispatch = useDispatch()
  const leaderboardBalanceUpdates = useSelector((state: RootState) => state.vaults.leaderboardBalanceUpdates)

  const updateBalances = useCallback(
    (value: LeaderboardBalanceData[]) => {
      dispatch(updateLeaderboardBalances(value))
    },
    [dispatch],
  )

  return [leaderboardBalanceUpdates, updateBalances]
}

/**
 * 清空Leaderboard余额更新hook
 */
export function useClearLeaderboardBalances() {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(clearLeaderboardBalances())
  }, [dispatch])
}

/**
 * Leaderboard WebSocket订阅hook - 用于实时更新PnL数据
 */
export function useLeaderboardWebSocketSubscription() {
  const { subscribe, unsubscribe, isOpen } = useInsightsSubscription({ handleMessage: false })

  // 订阅leaderboard-balances频道
  useEffect(() => {
    if (isOpen) {
      subscribe('strategy-balance-update', STRATEGY_BALANCE_UPDATE_SUB_ID)
    }

    // 组件卸载时取消订阅
    return () => {
      unsubscribe('strategy-balance-update', STRATEGY_BALANCE_UPDATE_UNSUB_ID)
    }
  }, [subscribe, unsubscribe, isOpen])

  return {
    isConnected: isOpen,
  }
}

/**
 * 专门用于更新leaderboard余额的hook - 供websocket消息处理器使用
 */
export function useUpdateLeaderboardBalances() {
  const dispatch = useDispatch()

  return useCallback(
    (data: LeaderboardBalanceData[]) => {
      if (data && Array.isArray(data)) {
        dispatch(updateLeaderboardBalances(data))
      }
    },
    [dispatch],
  )
}
