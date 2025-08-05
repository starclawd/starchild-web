import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import {
  updateCurrentAgentDetailData,
  updateSubscribedAgents,
  updateAgentsRecommendList,
  updateMyAgentsOverviewList,
} from './reducer'
import { ParamFun } from 'types/global'
import { useGetAgentsRecommendListQuery, useGetMyAgentsOverviewListQuery } from 'api/myAgent'
import { AgentCardProps } from 'store/agenthub/agenthub'

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

// Hook for agents recommend list
export function useAgentsRecommendList(): [AgentCardProps[], ParamFun<AgentCardProps[]>] {
  const dispatch = useDispatch()
  const agentsRecommendList = useSelector((state: RootState) => state.myagent.agentsRecommendList)
  const setAgentsRecommendList = useCallback(
    (value: AgentCardProps[]) => {
      dispatch(updateAgentsRecommendList(value))
    },
    [dispatch],
  )
  return [agentsRecommendList, setAgentsRecommendList]
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
