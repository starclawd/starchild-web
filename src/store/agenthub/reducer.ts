import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentHubState, SignalScannerAgent, SignalScannerListResponse } from './agenthub'

const initialState: AgentHubState = {
  signalScannerAgents: [],
  signalScannerTotal: 0,
  signalScannerPage: 1,
  signalScannerPageSize: 20,
  isLoading: false,
  isLoadMoreLoading: false,
}

export const agentHubSlice = createSlice({
  name: 'agentHub',
  initialState,
  reducers: {
    updateSignalScannerAgents: (state, action: PayloadAction<SignalScannerAgent[]>) => {
      state.signalScannerAgents = action.payload
    },
    updateSignalScannerList: (state, action: PayloadAction<SignalScannerListResponse>) => {
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
    updateIsLoadMoreLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadMoreLoading = action.payload
    },
  },
})

export const { updateSignalScannerAgents, updateSignalScannerList, updateIsLoading, updateIsLoadMoreLoading } =
  agentHubSlice.actions

export default agentHubSlice.reducer
