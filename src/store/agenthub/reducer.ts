import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentHubState, AgentThreadInfo, AgentThreadInfoListResponse } from './agenthub'

const initialState: AgentHubState = {
  agentThreadInfoListAgents: [],
  agentThreadInfoListTotal: 0,
  agentThreadInfoListPage: 1,
  agentThreadInfoListPageSize: 20,
  isLoading: false,
  isLoadMoreLoading: false,
}

export const agentHubSlice = createSlice({
  name: 'agentHub',
  initialState,
  reducers: {
    updateAgentThreadInfoListAgents: (state, action: PayloadAction<AgentThreadInfo[]>) => {
      state.agentThreadInfoListAgents = action.payload
    },
    updateAgentThreadInfoList: (state, action: PayloadAction<AgentThreadInfoListResponse>) => {
      // 如果是第一页，直接替换数据
      if (action.payload.page === 1) {
        state.agentThreadInfoListAgents = action.payload.data
      } else {
        // 如果是后续页面，追加数据到现有数组
        state.agentThreadInfoListAgents = [...state.agentThreadInfoListAgents, ...action.payload.data]
      }
      state.agentThreadInfoListTotal = action.payload.total
      state.agentThreadInfoListPage = action.payload.page
      state.agentThreadInfoListPageSize = action.payload.pageSize
    },
    updateIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateIsLoadMoreLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadMoreLoading = action.payload
    },
    updateAgentSubscriptionStatus: (state, action: PayloadAction<{ threadId: string; subscribed: boolean }>) => {
      const { threadId, subscribed } = action.payload
      const agentIndex = state.agentThreadInfoListAgents.findIndex((agent) => agent.threadId === threadId)
      if (agentIndex !== -1) {
        state.agentThreadInfoListAgents[agentIndex].subscribed = subscribed
        state.agentThreadInfoListAgents[agentIndex].subscriberCount = subscribed
          ? state.agentThreadInfoListAgents[agentIndex].subscriberCount + 1
          : state.agentThreadInfoListAgents[agentIndex].subscriberCount - 1
      }
    },
  },
})

export const {
  updateAgentThreadInfoListAgents,
  updateAgentThreadInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateAgentSubscriptionStatus,
} = agentHubSlice.actions

export default agentHubSlice.reducer
