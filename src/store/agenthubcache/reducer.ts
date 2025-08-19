import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentHubViewMode } from './agenthubcache'

export interface AgentHubCacheState {
  viewMode: AgentHubViewMode
}

const initialState: AgentHubCacheState = {
  viewMode: AgentHubViewMode.CARD, // 默认展示 card 视图
}

export const agenthubcacheSlice = createSlice({
  name: 'agenthubcache',
  initialState,
  reducers: {
    updateViewMode: (state, action: PayloadAction<AgentHubViewMode>) => {
      state.viewMode = action.payload
    },
  },
})

export const { updateViewMode } = agenthubcacheSlice.actions

export default agenthubcacheSlice.reducer
