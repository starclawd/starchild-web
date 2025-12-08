import { useEffect, useRef, useCallback, useState } from 'react'
import { useUpdateLeaderboardBalances, useLeaderboardBalanceUpdates } from './useLeaderboardWebSocket'
import { LeaderboardBalanceData } from '../vaults.d'

/**
 * Mock LeaderBoard WebSocket数据更新 - 仅用于开发测试
 * 每10秒生成一次随机数据，范围在300-2000之间
 */
export function useMockLeaderboardWebSocket(mockStrategyIds: string[] = []) {
  const updateLeaderboardBalances = useUpdateLeaderboardBalances()
  const [leaderboardBalanceUpdates] = useLeaderboardBalanceUpdates()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const strategyIdsRef = useRef<string[]>([])
  const [isActive, setIsActive] = useState(false)

  // 缓存策略ID，避免无限循环
  const strategyIdsStr = mockStrategyIds.join(',')

  // 使用ref来保存最新的balance数据，避免依赖项导致的重新创建
  const balanceUpdatesRef = useRef(leaderboardBalanceUpdates)
  balanceUpdatesRef.current = leaderboardBalanceUpdates

  const generateMockData = useCallback((): LeaderboardBalanceData[] => {
    return strategyIdsRef.current.map((strategyId) => {
      // 从ref中获取当前strategy的最新余额
      const currentBalance = balanceUpdatesRef.current[strategyId]?.available_balance

      let newBalance: number
      if (currentBalance !== undefined) {
        // 在当前余额基础上正负1范围内浮动
        const fluctuation = (Math.random() - 0.5) * 2 // -1到1之间的随机数
        newBalance = Math.max(1, currentBalance + fluctuation) // 确保余额不为负数，最小值为1
      } else {
        // 如果没有历史数据，使用300-2000之间的初始值
        newBalance = Math.floor(Math.random() * (2000 - 300 + 1)) + 300
      }

      return {
        strategy_id: strategyId,
        available_balance: Number(newBalance.toFixed(2)), // 保留2位小数
        timestamp: Date.now(),
      }
    })
  }, []) // 移除leaderboardBalanceUpdates依赖项，使用ref代替

  const startMockUpdates = useCallback(() => {
    if (intervalRef.current || !strategyIdsRef.current.length) return

    setIsActive(true)

    // 立即生成一次数据
    const initialData = generateMockData()
    updateLeaderboardBalances(initialData)

    console.log('🔧 Mock LeaderBoard WebSocket: 开始每10秒更新数据', {
      strategyIds: strategyIdsRef.current,
      initialData,
    })

    // 设置定时器
    intervalRef.current = setInterval(() => {
      const mockData = generateMockData()
      updateLeaderboardBalances(mockData)

      // 显示更详细的变化信息
      const balanceUpdatesSnapshot = balanceUpdatesRef.current
      const changes = mockData
        .map((item) => {
          const prevBalance = strategyIdsRef.current.includes(item.strategy_id)
            ? balanceUpdatesSnapshot[item.strategy_id]?.available_balance
            : undefined
          const change = prevBalance ? (item.available_balance - prevBalance).toFixed(2) : 'new'
          const changeSymbol = typeof change === 'string' ? '' : Number(change) > 0 ? '+' : ''
          return `${item.strategy_id}: ${item.available_balance} (${changeSymbol}${change})`
        })
        .join(', ')
    }, 10000) // 10秒
  }, [generateMockData, updateLeaderboardBalances])

  const stopMockUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsActive(false)
    console.log('🛑 Mock LeaderBoard WebSocket: 已停止数据更新')
  }, [])

  useEffect(() => {
    // 更新策略ID引用
    strategyIdsRef.current = mockStrategyIds

    // 如果没有策略ID，停止mock
    if (!mockStrategyIds.length) {
      stopMockUpdates()
      return
    }

    // 如果策略ID有变化，重启mock
    if (mockStrategyIds.length > 0) {
      stopMockUpdates()
      // 延迟启动，避免快速重启
      const timer = setTimeout(startMockUpdates, 100)
      return () => clearTimeout(timer)
    }
  }, [strategyIdsStr, mockStrategyIds, startMockUpdates, stopMockUpdates])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopMockUpdates()
    }
  }, [stopMockUpdates])

  return {
    isActive,
  }
}

/**
 * Mock策略ID生成器 - 生成指定数量的mock策略ID
 */
export function generateMockStrategyIds(count: number = 5): string[] {
  return Array.from({ length: count }, (_, index) => `mock-strategy-${index + 1}`)
}
