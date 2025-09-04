import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { AgentCardProps } from 'store/agenthub/agenthub'

// New trigger数据类型
export interface NewTriggerDataType {
  agentId: number
  timestamp?: number // 添加时间戳用于mock数据
}

interface MyAgentState {
  subscribedAgents: AgentDetailDataType[]
  currentAgentDetailData: AgentDetailDataType | null
  agentsRecommendList: AgentDetailDataType[]
  currentEditAgentData: AgentDetailDataType | null
  newTriggerList: NewTriggerDataType[]
}

const initialState: MyAgentState = {
  subscribedAgents: [],
  currentAgentDetailData: null,
  agentsRecommendList: [],
  currentEditAgentData: null,
  newTriggerList: [],
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
    updateCurrentEditAgentData: (state, action: PayloadAction<AgentDetailDataType | null>) => {
      state.currentEditAgentData = action.payload
    },
    // New trigger相关actions
    updateNewTriggerList: (state, action: PayloadAction<NewTriggerDataType>) => {
      // 添加新的trigger到列表开头
      state.newTriggerList.unshift(action.payload)
    },
    resetNewTriggerList: (state) => {
      state.newTriggerList = []
    },
  },
})

export const {
  updateSubscribedAgents,
  updateCurrentAgentDetailData,
  updateAgentsRecommendList,
  updateCurrentEditAgentData,
  updateNewTriggerList,
  resetNewTriggerList,
} = myAgentSlice.actions

export default myAgentSlice.reducer
