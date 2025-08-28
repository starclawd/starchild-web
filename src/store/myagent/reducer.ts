import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { AgentCardProps } from 'store/agenthub/agenthub'

interface MyAgentState {
  subscribedAgents: AgentDetailDataType[]
  currentAgentDetailData: AgentDetailDataType | null
  agentsRecommendList: AgentDetailDataType[]
  myAgentsOverviewList: AgentDetailDataType[]
  lastVisibleAgentId: string | null
  currentEditAgentData: AgentDetailDataType | null
}

const initialState: MyAgentState = {
  subscribedAgents: [],
  currentAgentDetailData: null,
  agentsRecommendList: [],
  myAgentsOverviewList: [],
  lastVisibleAgentId: null,
  currentEditAgentData: null,
}

const myAgentSlice = createSlice({
  name: 'myagent',
  initialState,
  reducers: {
    updateSubscribedAgents: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.subscribedAgents = action.payload
    },
    updateCurrentAgentDetailData: (state, action: PayloadAction<AgentDetailDataType | null>) => {
      state.currentAgentDetailData = action.payload
    },
    updateAgentsRecommendList: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.agentsRecommendList = action.payload
    },
    updateMyAgentsOverviewList: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.myAgentsOverviewList = action.payload
    },
    updateLastVisibleAgentId: (state, action: PayloadAction<string | null>) => {
      state.lastVisibleAgentId = action.payload
    },
    updateCurrentEditAgentData: (state, action: PayloadAction<AgentDetailDataType | null>) => {
      state.currentEditAgentData = action.payload
    },
  },
})

export const {
  updateSubscribedAgents,
  updateCurrentAgentDetailData,
  updateAgentsRecommendList,
  updateMyAgentsOverviewList,
  updateLastVisibleAgentId,
  updateCurrentEditAgentData,
} = myAgentSlice.actions

export default myAgentSlice.reducer
