import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { NewTriggerDataType } from 'store/myagent/myagent'

interface MyAgentState {
  subscribedAgents: AgentDetailDataType[]
  agentsRecommendList: AgentDetailDataType[]
  currentEditAgentData: AgentDetailDataType | null
  newTriggerList: NewTriggerDataType[]
}

const initialState: MyAgentState = {
  subscribedAgents: [],
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
    updateAgentsRecommendList: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.agentsRecommendList = action.payload
    },
    updateCurrentEditAgentData: (state, action: PayloadAction<AgentDetailDataType | null>) => {
      state.currentEditAgentData = action.payload
    },
    updateNewTriggerList: (state, action: PayloadAction<NewTriggerDataType>) => {
      state.newTriggerList.unshift(action.payload)
    },
    resetNewTriggerList: (state) => {
      state.newTriggerList = []
    },
  },
})

export const {
  updateSubscribedAgents,
  updateAgentsRecommendList,
  updateCurrentEditAgentData,
  updateNewTriggerList,
  resetNewTriggerList,
} = myAgentSlice.actions

export default myAgentSlice.reducer
