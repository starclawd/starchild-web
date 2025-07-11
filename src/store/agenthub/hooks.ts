import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateSignalScannerAgents, updateSignalScannerList, updateIsLoading, updateIsLoadMoreLoading } from './reducer'
import { useLazyGetSignalScannerListQuery } from 'api/agentHub'
import { AgentThreadInfo, AgentThreadInfoListParams } from './agenthub'

export function useSignalScannerAgents(): [AgentThreadInfo[], (agents: AgentThreadInfo[]) => void] {
  const signalScannerAgents = useSelector((state: RootState) => state.agentHub.signalScannerAgents)
  const dispatch = useDispatch()
  const setSignalScannerAgents = useCallback(
    (agents: AgentThreadInfo[]) => {
      dispatch(updateSignalScannerAgents(agents))
    },
    [dispatch],
  )
  return [signalScannerAgents, setSignalScannerAgents]
}

export function useSignalScannerList(): [
  AgentThreadInfo[],
  number,
  number,
  number,
  (data: { data: AgentThreadInfo[]; total: number; page: number; pageSize: number }) => void,
] {
  const signalScannerAgents = useSelector((state: RootState) => state.agentHub.signalScannerAgents)
  const signalScannerTotal = useSelector((state: RootState) => state.agentHub.signalScannerTotal)
  const signalScannerPage = useSelector((state: RootState) => state.agentHub.signalScannerPage)
  const signalScannerPageSize = useSelector((state: RootState) => state.agentHub.signalScannerPageSize)
  const dispatch = useDispatch()
  const setSignalScannerList = useCallback(
    (data: { data: AgentThreadInfo[]; total: number; page: number; pageSize: number }) => {
      dispatch(updateSignalScannerList(data))
    },
    [dispatch],
  )
  return [signalScannerAgents, signalScannerTotal, signalScannerPage, signalScannerPageSize, setSignalScannerList]
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

export function useGetSignalScannerList() {
  const [, , , , setSignalScannerList] = useSignalScannerList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetSignalScannerList] = useLazyGetSignalScannerListQuery()

  return useCallback(
    async (params: AgentThreadInfoListParams) => {
      const { page = 1 } = params
      const isFirstPage = page === 1

      try {
        if (isFirstPage) {
          setIsLoading(true)
        } else {
          setIsLoadMoreLoading(true)
        }

        const data = await triggerGetSignalScannerList(params)
        if (data.isSuccess) {
          setSignalScannerList(data.data as any)
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
    [setSignalScannerList, setIsLoading, setIsLoadMoreLoading, triggerGetSignalScannerList],
  )
}
