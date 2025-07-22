import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { updateSubscribedAgents } from './reducer'
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
