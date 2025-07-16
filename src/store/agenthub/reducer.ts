import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AgentHubState, AgentInfo, AgentInfoListResponse } from './agenthub'

const initialState: AgentHubState = {
  // agents by category
  agentInfoList: [],
  agentInfoListTotal: 0,
  agentInfoListPage: 1,
  agentInfoListPageSize: 20,
  isLoading: false,
  isLoadMoreLoading: false,
  searchString: '',

  // agent marketplace
  agentMarketplaceInfoList: [],
  isLoadingMarketplace: false,

  // subscribed agents
  subscribedAgentIds: [],
}

export const agentHubSlice = createSlice({
  name: 'agentHub',
  initialState,
  reducers: {
    updateAgentInfoListAgents: (state, action: PayloadAction<AgentInfo[]>) => {
      state.agentInfoList = action.payload
    },
    updateAgentInfoList: (state, action: PayloadAction<AgentInfoListResponse>) => {
      // 如果是第一页，直接替换数据
      if (action.payload.page === 1) {
        state.agentInfoList = action.payload.data
      } else {
        // 如果是后续页面，追加数据到现有数组
        state.agentInfoList = [...state.agentInfoList, ...action.payload.data]
      }
      state.agentInfoListTotal = action.payload.total
      state.agentInfoListPage = action.payload.page
      state.agentInfoListPageSize = action.payload.pageSize
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
      const agentInListIndex = state.agentInfoList.findIndex((agent) => agent.agentId === agentId)
      if (agentInListIndex !== -1) {
        if (subscribed) {
          state.agentInfoList[agentInListIndex].subscriberCount += 1
        } else {
          state.agentInfoList[agentInListIndex].subscriberCount = Math.max(
            0,
            state.agentInfoList[agentInListIndex].subscriberCount - 1,
          )
        }
      }

      // Update subscriberCount in agentMarketplaceThreadInfoList
      const agentInMarketplaceIndex = state.agentMarketplaceInfoList.findIndex((agent) => agent.agentId === agentId)
      if (agentInMarketplaceIndex !== -1) {
        if (subscribed) {
          state.agentMarketplaceInfoList[agentInMarketplaceIndex].subscriberCount += 1
        } else {
          state.agentMarketplaceInfoList[agentInMarketplaceIndex].subscriberCount = Math.max(
            0,
            state.agentMarketplaceInfoList[agentInMarketplaceIndex].subscriberCount - 1,
          )
        }
      }
    },
    updateAgentMarketplaceInfoList: (state, action: PayloadAction<AgentInfo[]>) => {
      state.agentMarketplaceInfoList = action.payload
    },
    updateIsLoadingMarketplace: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMarketplace = action.payload
    },
  },
})

export const {
  updateAgentInfoListAgents,
  updateAgentInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateSearchString,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceInfoList,
  updateIsLoadingMarketplace,
} = agentHubSlice.actions

export default agentHubSlice.reducer
