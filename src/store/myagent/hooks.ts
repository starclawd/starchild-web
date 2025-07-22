import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { updateCurrentAgentDetailData, updateSubscribedAgents } from './reducer'
import { ParamFun } from 'types/global'

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
