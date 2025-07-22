import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'

export interface MyagentState {
  subscribedAgents: AgentDetailDataType[]
}

const initialState: MyagentState = {
  subscribedAgents: [],
}

export const myagentSlice = createSlice({
  name: 'myagent',
  initialState,
  reducers: {
    updateSubscribedAgents: (state, action: PayloadAction<AgentDetailDataType[]>) => {
      state.subscribedAgents = action.payload
    },
  },
})

export const { updateSubscribedAgents } = myagentSlice.actions

export default myagentSlice.reducer
