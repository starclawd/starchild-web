import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BacktestDataType, AgentDetailDataType } from './agentdetail.d'

export interface AgentDetailState {
  backtestData: BacktestDataType | null
  agentDetailData: AgentDetailDataType | null
  tabIndex: number
}

const initialState: AgentDetailState = {
  backtestData: null,
  agentDetailData: null,
  tabIndex: 0,
}

export const agentDetailSlice = createSlice({
  name: 'agentdetail',
  initialState,
  reducers: {
    updateBacktestData: (state, action: PayloadAction<BacktestDataType | null>) => {
      state.backtestData = action.payload
    },
    updateAgentDetail: (state, action: PayloadAction<AgentDetailDataType | null>) => {
      state.agentDetailData = action.payload
    },
    updateTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload
    },
  },
})

export const { updateBacktestData, updateAgentDetail, updateTabIndex } = agentDetailSlice.actions

export default agentDetailSlice.reducer
