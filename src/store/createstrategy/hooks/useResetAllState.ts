import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { resetCreateStrategy } from '../reducer'
import { strategyApi } from 'api/createStrategy'

export function useResetAllState() {
  const dispatch = useDispatch()
  return useCallback(() => {
    // 重置 Redux store 中的 createStrategy 状态
    dispatch(resetCreateStrategy())
    // 重置 RTK Query 缓存（strategyApi 包括 useStrategyCode 等数据）
    dispatch(strategyApi.util.resetApiState())
  }, [dispatch])
}
