import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyAgentCacheState } from './myagentcache'

const initialState: MyAgentCacheState = {
  agentLastViewTimestamps: {},
}

const myAgentCacheSlice = createSlice({
  name: 'myagentcache',
  initialState,
  reducers: {
    updateAgentLastViewTimestamp: (state, action: PayloadAction<{ taskId: string; timestamp: number }>) => {
      const { taskId, timestamp } = action.payload
      state.agentLastViewTimestamps[taskId] = timestamp
    },
  },
})

export const { updateAgentLastViewTimestamp } = myAgentCacheSlice.actions

export default myAgentCacheSlice.reducer
