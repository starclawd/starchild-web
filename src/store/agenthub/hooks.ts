import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateAgentThreadInfoListAgents,
  updateAgentThreadInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
} from './reducer'
import { useLazyGetAgentHubThreadListQuery } from 'api/agentHub'
import { AgentThreadInfo, AgentThreadInfoListParams } from './agenthub'

export function useAgentThreadInfoListAgents(): [AgentThreadInfo[], (agents: AgentThreadInfo[]) => void] {
  const agentThreadInfoListAgents = useSelector((state: RootState) => state.agentHub.agentThreadInfoListAgents)
  const dispatch = useDispatch()
  const setAgentThreadInfoListAgents = useCallback(
    (agents: AgentThreadInfo[]) => {
      dispatch(updateAgentThreadInfoListAgents(agents))
    },
    [dispatch],
  )
  return [agentThreadInfoListAgents, setAgentThreadInfoListAgents]
}

export function useAgentThreadInfoList(): [
  AgentThreadInfo[],
  number,
  number,
  number,
  (data: { data: AgentThreadInfo[]; total: number; page: number; pageSize: number }) => void,
] {
  const agentThreadInfoListAgents = useSelector((state: RootState) => state.agentHub.agentThreadInfoListAgents)
  const agentThreadInfoListTotal = useSelector((state: RootState) => state.agentHub.agentThreadInfoListTotal)
  const agentThreadInfoListPage = useSelector((state: RootState) => state.agentHub.agentThreadInfoListPage)
  const agentThreadInfoListPageSize = useSelector((state: RootState) => state.agentHub.agentThreadInfoListPageSize)
  const dispatch = useDispatch()
  const setAgentThreadInfoList = useCallback(
    (data: { data: AgentThreadInfo[]; total: number; page: number; pageSize: number }) => {
      dispatch(updateAgentThreadInfoList(data))
    },
    [dispatch],
  )
  return [
    agentThreadInfoListAgents,
    agentThreadInfoListTotal,
    agentThreadInfoListPage,
    agentThreadInfoListPageSize,
    setAgentThreadInfoList,
  ]
}

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

export function useGetAgentThreadInfoList() {
  const [, , , , setAgentThreadInfoList] = useAgentThreadInfoList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetAgentThreadInfoList] = useLazyGetAgentHubThreadListQuery()

  return useCallback(
    async (params: AgentThreadInfoListParams) => {
      console.log('useGetAgentThreadInfoList params', params)
      const { page = 1 } = params
      const isFirstPage = page === 1

      try {
        if (isFirstPage) {
          setIsLoading(true)
        } else {
          setIsLoadMoreLoading(true)
        }

        const data = await triggerGetAgentThreadInfoList(params)
        if (data.isSuccess) {
          setAgentThreadInfoList(data.data as any)
        }
        return data
      } catch (error) {
        return error
      } finally {
        if (isFirstPage) {
          setIsLoading(false)
        } else {
          setIsLoadMoreLoading(false)
        }
      }
    },
    [setAgentThreadInfoList, setIsLoading, setIsLoadMoreLoading, triggerGetAgentThreadInfoList],
  )
}
