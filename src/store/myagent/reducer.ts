import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'

export interface MyagentState {
  subscribedAgents: AgentDetailDataType[]
  currentAgentDetailData: AgentDetailDataType | null
}

const initialState: MyagentState = {
  subscribedAgents: [],
  currentAgentDetailData: null,
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
  },
})

export const { updateSubscribedAgents, updateCurrentAgentDetailData } = myagentSlice.actions

export default myagentSlice.reducer
