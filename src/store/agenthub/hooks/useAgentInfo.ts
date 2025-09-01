import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store'
import { updateAgentInfoList, updateIsLoading, updateIsLoadMoreLoading } from '../reducer'
import { AgentInfo } from '../agenthub'

/**
 * Agent信息列表状态管理
 */
export function useAgentInfoList(): [
  AgentInfo[],
  number,
  number,
  number,
  string[],
  (data: { data: AgentInfo[]; total: number; page: number; pageSize: number; categoryAgentTags: string[] }) => void,
] {
  const agentInfoList = useSelector((state: RootState) => state.agentHub.agentInfoList)
  const agentInfoListTotal = useSelector((state: RootState) => state.agentHub.agentInfoListTotal)
  const agentInfoListPage = useSelector((state: RootState) => state.agentHub.agentInfoListPage)
  const agentInfoListPageSize = useSelector((state: RootState) => state.agentHub.agentInfoListPageSize)
  const categoryAgentTags = useSelector((state: RootState) => state.agentHub.categoryAgentTags)
  const dispatch = useDispatch()
  const setAgentInfoList = useCallback(
    (data: { data: AgentInfo[]; total: number; page: number; pageSize: number; categoryAgentTags: string[] }) => {
      dispatch(updateAgentInfoList(data))
    },
    [dispatch],
  )
  return [
    agentInfoList,
    agentInfoListTotal,
    agentInfoListPage,
    agentInfoListPageSize,
    categoryAgentTags,
    setAgentInfoList,
  ]
}

/**
 * 加载状态管理
 */
export function useIsLoading(): [boolean, (isLoading: boolean) => void] {
  const isLoading = useSelector((state: RootState) => state.agentHub.isLoading)
  const dispatch = useDispatch()
  const setIsLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(updateIsLoading(isLoading))
    },
    [dispatch],
  )
  return [isLoading, setIsLoading]
}

/**
 * 加载更多状态管理
 */
export function useIsLoadMoreLoading(): [boolean, (isLoadMoreLoading: boolean) => void] {
  const isLoadMoreLoading = useSelector((state: RootState) => state.agentHub.isLoadMoreLoading)
  const dispatch = useDispatch()
  const setIsLoadMoreLoading = useCallback(
    (isLoadMoreLoading: boolean) => {
      dispatch(updateIsLoadMoreLoading(isLoadMoreLoading))
    },
    [dispatch],
  )
  return [isLoadMoreLoading, setIsLoadMoreLoading]
}
