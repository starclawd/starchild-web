import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { setIsMenuNoAgentOpen, updateAgentLastViewTimestamp } from './reducer'

// 获取和更新特定agent的最后查看时间戳
export function useAgentLastViewTimestamp(
  taskId: string | undefined,
): [number | undefined, (timestamp?: number) => void] {
  const dispatch = useDispatch()
  const timestamp = useSelector((state: RootState) =>
    taskId ? state.myagentcache.agentLastViewTimestamps[taskId] : undefined,
  )

  const updateTimestamp = useCallback(
    (newTimestamp?: number) => {
      if (taskId) {
        dispatch(updateAgentLastViewTimestamp({ taskId, timestamp: newTimestamp || Date.now() }))
      }
    },
    [dispatch, taskId],
  )

  return [timestamp, updateTimestamp]
}

// 获取是否显示菜单中的无agent提示
export function useIsMenuNoAgentOpen(): [boolean, (isOpen: boolean) => void] {
  const dispatch = useDispatch()
  const isMenuNoAgentOpen = useSelector((state: RootState) => state.myagentcache.isMenuNoAgentOpen)
  const updateIsMenuNoAgentOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setIsMenuNoAgentOpen(isOpen))
    },
    [dispatch],
  )
  return [isMenuNoAgentOpen, updateIsMenuNoAgentOpen]
}
