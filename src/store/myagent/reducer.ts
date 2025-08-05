import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { AgentCardProps } from 'store/agenthub/agenthub'

export interface MyagentState {
  subscribedAgents: AgentDetailDataType[]
  currentAgentDetailData: AgentDetailDataType | null
  agentsRecommendList: AgentCardProps[]
  myAgentsOverviewList: AgentDetailDataType[]
}

const initialState: MyagentState = {
  subscribedAgents: [],
  currentAgentDetailData: null,
  agentsRecommendList: [],
  myAgentsOverviewList: [],
}

export const myagentSlice = createSlice({
  name: 'myagent',
  initialState,
  reducers: {
    updateSubscribedAgents: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.subscribedAgents = action.payload
    },
    updateCurrentAgentDetailData: (state, action: PayloadAction<AgentDetailDataType | null>) => {
      state.currentAgentDetailData = action.payload
    },
    updateAgentsRecommendList: (state, action: PayloadAction<AgentCardProps[]>) => {
      state.agentsRecommendList = action.payload
    },
    updateMyAgentsOverviewList: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.myAgentsOverviewList = action.payload
    },
  },
})

export const {
  updateSubscribedAgents,
  updateCurrentAgentDetailData,
  updateAgentsRecommendList,
  updateMyAgentsOverviewList,
} = myagentSlice.actions

export default myagentSlice.reducer
