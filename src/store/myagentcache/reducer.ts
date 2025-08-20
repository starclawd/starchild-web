import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyAgentCacheState } from './myagentcache'

const initialState: MyAgentCacheState = {
  agentLastViewTimestamps: {},
  isMenuNoAgentOpen: true,
}

const myAgentCacheSlice = createSlice({
  name: 'myagentcache',
  initialState,
  reducers: {
    updateAgentLastViewTimestamp: (state, action: PayloadAction<{ taskId: string; timestamp: number }>) => {
      const { taskId, timestamp } = action.payload
      state.agentLastViewTimestamps[taskId] = timestamp
    },
    setIsMenuNoAgentOpen: (state, action: PayloadAction<boolean>) => {
      state.isMenuNoAgentOpen = action.payload
    },
  },
})

export const { updateAgentLastViewTimestamp, setIsMenuNoAgentOpen } = myAgentCacheSlice.actions

export default myAgentCacheSlice.reducer
