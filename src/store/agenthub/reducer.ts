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

  // subscribed agents
  subscribedAgentIds: [],
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
    updateAgentSubscriptionStatus: (state, action: PayloadAction<{ agentId: string; subscribed: boolean }>) => {
      const { agentId, subscribed } = action.payload

      // Update subscribed agent IDs
      if (subscribed) {
        // Add to subscribed list if not already present
        if (!state.subscribedAgentIds.includes(agentId)) {
          state.subscribedAgentIds.push(agentId)
        }
      } else {
        // Remove from subscribed list
        const agentIndex = state.subscribedAgentIds.findIndex((id) => id === agentId)
        if (agentIndex !== -1) {
          state.subscribedAgentIds.splice(agentIndex, 1)
        }
      }

      // Update subscriberCount in agentThreadInfoList
      const agentInListIndex = state.agentThreadInfoList.findIndex((agent) => agent.threadId === agentId)
      if (agentInListIndex !== -1) {
        if (subscribed) {
          state.agentThreadInfoList[agentInListIndex].subscriberCount += 1
        } else {
          state.agentThreadInfoList[agentInListIndex].subscriberCount = Math.max(
            0,
            state.agentThreadInfoList[agentInListIndex].subscriberCount - 1,
          )
        }
      }

      // Update subscriberCount in agentMarketplaceThreadInfoList
      const agentInMarketplaceIndex = state.agentMarketplaceThreadInfoList.findIndex(
        (agent) => agent.threadId === agentId,
      )
      if (agentInMarketplaceIndex !== -1) {
        if (subscribed) {
          state.agentMarketplaceThreadInfoList[agentInMarketplaceIndex].subscriberCount += 1
        } else {
          state.agentMarketplaceThreadInfoList[agentInMarketplaceIndex].subscriberCount = Math.max(
            0,
            state.agentMarketplaceThreadInfoList[agentInMarketplaceIndex].subscriberCount - 1,
          )
        }
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
