import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateAgentLastViewTimestamp } from './reducer'

// 获取特定agent的最后查看时间戳
export function useAgentLastViewTimestamp(taskId: string | undefined): number | undefined {
  return useSelector((state: RootState) => (taskId ? state.myagentcache.agentLastViewTimestamps[taskId] : undefined))
}

// 更新agent的最后查看时间戳
export function useUpdateAgentLastViewTimestamp(): (taskId: string, timestamp?: number) => void {
  const dispatch = useDispatch()
  return useCallback(
    (taskId: string, timestamp?: number) => {
      dispatch(updateAgentLastViewTimestamp({ taskId, timestamp: timestamp || Date.now() }))
    },
    [dispatch],
  )
}
