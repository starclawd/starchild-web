import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { BacktestDataType, BACKTEST_STATUS, DEFAULT_BACKTEST_DATA } from 'store/agentdetail/agentdetail.d'
import {
  updateCurrentAgentDetailData,
  updateSubscribedAgents,
  updateAgentsRecommendList,
  updateMyAgentsOverviewList,
  updateLastVisibleAgentId,
} from './reducer'
import { ParamFun } from 'types/global'
import { useGetAgentsRecommendListQuery, useGetMyAgentsOverviewListQuery } from 'api/myAgent'
import { useLazyGetBacktestDataQuery } from 'api/chat'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { convertAgentDetailListToCardPropsList, convertAgentDetailToCardProps } from './utils'

export function useSubscribedAgents(): [AgentDetailDataType[], ParamFun<AgentDetailDataType[]>] {
  const dispatch = useDispatch()
  const subscribedAgents = useSelector((state: RootState) => state.myagent.subscribedAgents)
  const setSubscribedAgents = useCallback(
    (value: AgentDetailDataType[]) => {
      dispatch(updateSubscribedAgents(value))
    },
    [dispatch],
  )
  return [subscribedAgents, setSubscribedAgents]
}

export function useCurrentAgentDetailData(): [AgentDetailDataType | null, ParamFun<AgentDetailDataType | null>] {
  const dispatch = useDispatch()
  const currentAgentDetailData = useSelector((state: RootState) => state.myagent.currentAgentDetailData)
  const setCurrentAgentDetailData = useCallback(
    (value: AgentDetailDataType | null) => {
      dispatch(updateCurrentAgentDetailData(value))
    },
    [dispatch],
  )
  return [currentAgentDetailData, setCurrentAgentDetailData]
}

// Hook for agents recommend list - returns converted AgentCardProps[]
export function useAgentsRecommendList(): [AgentCardProps[], ParamFun<AgentDetailDataType[]>] {
  const dispatch = useDispatch()
  const agentsRecommendList = useSelector((state: RootState) => state.myagent.agentsRecommendList)
  const setAgentsRecommendList = useCallback(
    (value: AgentDetailDataType[]) => {
      dispatch(updateAgentsRecommendList(value))
    },
    [dispatch],
  )
  // Convert AgentDetailDataType[] to AgentCardProps[] before returning
  const convertedList = convertAgentDetailListToCardPropsList(agentsRecommendList)
  return [convertedList, setAgentsRecommendList]
}

// Hook for my agents overview list
export function useMyAgentsOverviewList(): [AgentDetailDataType[], ParamFun<AgentDetailDataType[]>] {
  const dispatch = useDispatch()
  const myAgentsOverviewList = useSelector((state: RootState) => state.myagent.myAgentsOverviewList)
  const setMyAgentsOverviewList = useCallback(
    (value: AgentDetailDataType[]) => {
      dispatch(updateMyAgentsOverviewList(value))
    },
    [dispatch],
  )
  return [myAgentsOverviewList, setMyAgentsOverviewList]
}

// Hook for last visible agent ID
export function useLastVisibleAgentId(): [string | null, ParamFun<string | null>] {
  const dispatch = useDispatch()
  const lastVisibleAgentId = useSelector((state: RootState) => state.myagent.lastVisibleAgentId)
  const setLastVisibleAgentId = useCallback(
    (value: string | null) => {
      dispatch(updateLastVisibleAgentId(value))
    },
    [dispatch],
  )
  return [lastVisibleAgentId, setLastVisibleAgentId]
}

// Hook to fetch and update agents recommend list
export function useFetchAgentsRecommendList() {
  const dispatch = useDispatch()
  const { data, isLoading, error, refetch } = useGetAgentsRecommendListQuery()

  useEffect(() => {
    if (data) {
      dispatch(updateAgentsRecommendList(data))
    }
  }, [data, dispatch])

  return { data, isLoading, error, refetch }
}

// Hook to fetch and update my agents overview list
export function useFetchMyAgentsOverviewList() {
  const dispatch = useDispatch()

  const { data, isLoading, error, refetch } = useGetMyAgentsOverviewListQuery()

  useEffect(() => {
    if (data) {
      dispatch(updateMyAgentsOverviewList(data))
    }
  }, [data, dispatch])

  return { data, isLoading, error, refetch }
}

export function useGetBacktestData() {
  const [backtestData, setBacktestData] = useState<BacktestDataType>(DEFAULT_BACKTEST_DATA)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [triggerGetBacktestData] = useLazyGetBacktestDataQuery()

  const fetchBacktestData = useCallback(
    async (taskId: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await triggerGetBacktestData({ taskId })
        if (data.isSuccess) {
          const backtestResult = (data.data as any).backtest_result
          const result = backtestResult.result
          if (result && result.symbol) {
            setBacktestData({
              ...result,
              status: BACKTEST_STATUS.SUCCESS,
            } as BacktestDataType)
          } else {
            if (backtestResult.message) {
              setBacktestData({
                ...DEFAULT_BACKTEST_DATA,
                status: BACKTEST_STATUS.FAILED,
                error_msg: backtestResult.message,
              } as BacktestDataType)
            } else {
              setBacktestData({
                ...DEFAULT_BACKTEST_DATA,
                status: BACKTEST_STATUS.RUNNING,
              } as BacktestDataType)
            }
          }
        } else {
          setError(data.error)
          setBacktestData({
            ...DEFAULT_BACKTEST_DATA,
            status: BACKTEST_STATUS.FAILED,
            error_msg: 'Failed to fetch backtest data',
          } as BacktestDataType)
        }
        setIsLoading(false)
        return data
      } catch (error) {
        setError(error)
        setIsLoading(false)
        setBacktestData({
          ...DEFAULT_BACKTEST_DATA,
          status: BACKTEST_STATUS.FAILED,
          error_msg: 'An error occurred while fetching backtest data',
        } as BacktestDataType)
        return error
      }
    },
    [triggerGetBacktestData],
  )

  return {
    backtestData,
    isLoading,
    error,
    fetchBacktestData,
    setBacktestData,
  }
}
