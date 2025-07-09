import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentHubState, SignalScannerAgent, SignalScannerListResponse } from './agenthub'

const initialState: AgentHubState = {
  signalScannerAgents: [],
  signalScannerTotal: 0,
  signalScannerPage: 1,
  signalScannerPageSize: 20,
  isLoading: false,
}

export const agentHubSlice = createSlice({
  name: 'agentHub',
  initialState,
  reducers: {
    updateSignalScannerAgents: (state, action: PayloadAction<SignalScannerAgent[]>) => {
      state.signalScannerAgents = action.payload
    },
    updateSignalScannerList: (state, action: PayloadAction<SignalScannerListResponse>) => {
      console.log('updateSignalScannerList', action.payload)
      // 如果是第一页，直接替换数据
      if (action.payload.page === 1) {
        state.signalScannerAgents = action.payload.data
      } else {
        // 如果是后续页面，追加数据到现有数组
        state.signalScannerAgents = [...state.signalScannerAgents, ...action.payload.data]
      }
      state.signalScannerTotal = action.payload.total
      state.signalScannerPage = action.payload.page
      state.signalScannerPageSize = action.payload.pageSize
    },
    updateIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { updateSignalScannerAgents, updateSignalScannerList, updateIsLoading } = agentHubSlice.actions

export default agentHubSlice.reducer
