import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { RootState } from 'store'
import { AgentHubViewMode } from './agenthubcache'
import { updateViewMode } from './reducer'

// Hook 用于获取和设置视图模式
export function useAgentHubViewMode(): [AgentHubViewMode, (newViewMode: AgentHubViewMode) => void] {
  const dispatch = useDispatch()
  const viewMode = useSelector((state: RootState) => state.agenthubcache.viewMode)

  const setViewMode = useCallback(
    (newViewMode: AgentHubViewMode) => {
      dispatch(updateViewMode(newViewMode))
    },
    [dispatch],
  )

  return [viewMode, setViewMode]
}
