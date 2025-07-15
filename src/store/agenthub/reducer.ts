import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentHubState, AgentThreadInfo, AgentThreadInfoListResponse } from './agenthub'

const initialState: AgentHubState = {
  // agents by category
  agentThreadInfoList: [],
  agentThreadInfoListTotal: 0,
  agentThreadInfoListPage: 1,
  agentThreadInfoListPageSize: 20,
  isLoading: false,
  isLoadMoreLoading: false,
  searchString: '',

  // agent marketplace
  agentMarketplaceThreadInfoList: [],
  isLoadingMarketplace: false,
}

export const agentHubSlice = createSlice({
  name: 'agentHub',
  initialState,
  reducers: {
    updateAgentThreadInfoListAgents: (state, action: PayloadAction<AgentThreadInfo[]>) => {
      state.agentThreadInfoList = action.payload
    },
    updateAgentThreadInfoList: (state, action: PayloadAction<AgentThreadInfoListResponse>) => {
      // 如果是第一页，直接替换数据
      if (action.payload.page === 1) {
        state.agentThreadInfoList = action.payload.data
      } else {
        // 如果是后续页面，追加数据到现有数组
        state.agentThreadInfoList = [...state.agentThreadInfoList, ...action.payload.data]
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
    updateSearchString: (state, action: PayloadAction<string>) => {
      state.searchString = action.payload
    },
    updateAgentSubscriptionStatus: (state, action: PayloadAction<{ threadId: string; subscribed: boolean }>) => {
      const { threadId, subscribed } = action.payload
      const agentIndex = state.agentThreadInfoList.findIndex((agent) => agent.threadId === threadId)
      if (agentIndex !== -1) {
        state.agentThreadInfoList[agentIndex].subscribed = subscribed
        state.agentThreadInfoList[agentIndex].subscriberCount = subscribed
          ? state.agentThreadInfoList[agentIndex].subscriberCount + 1
          : state.agentThreadInfoList[agentIndex].subscriberCount - 1
      }
    },
    updateAgentMarketplaceThreadInfoList: (state, action: PayloadAction<AgentThreadInfo[]>) => {
      state.agentMarketplaceThreadInfoList = action.payload
    },
    updateIsLoadingMarketplace: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMarketplace = action.payload
    },
  },
})

export const {
  updateAgentThreadInfoListAgents,
  updateAgentThreadInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateSearchString,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceThreadInfoList,
  updateIsLoadingMarketplace,
} = agentHubSlice.actions

export default agentHubSlice.reducer
