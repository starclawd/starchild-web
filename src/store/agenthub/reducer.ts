import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AgentHubState,
  AgentInfo,
  AgentInfoListResponse,
  KolInfo,
  TokenInfo,
  ListViewSortingColumn,
  ListViewSortingOrder,
} from './agenthub'

const initialState: AgentHubState = {
  // agents by category
  agentInfoList: [],
  agentInfoListTotal: 0,
  agentInfoListPage: 1,
  agentInfoListPageSize: 10,
  searchedAgentInfoList: [],
  isLoading: false,
  isLoadMoreLoading: false,
  categoryAgentTags: [],

  // agent marketplace
  agentMarketplaceInfoList: [],
  searchedAgentMarketplaceInfoList: [],
  isLoadingMarketplace: false,

  // subscribed agents
  subscribedAgentIds: [],

  // current selected info
  currentKolInfo: null,
  currentTokenInfo: null,

  marketplaceSearchString: '',
  categorySearchString: '',
  categorySearchTag: '',
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
      state.categoryAgentTags = action.payload.categoryAgentTags
    },
    updateSearchedAgentInfoList: (state, action: PayloadAction<AgentInfo[]>) => {
      state.searchedAgentInfoList = action.payload
    },
    updateIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateIsLoadMoreLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadMoreLoading = action.payload
    },
    updateMarketplaceSearchString: (state, action: PayloadAction<string>) => {
      state.marketplaceSearchString = action.payload
    },
    updateCategorySearchString: (state, action: PayloadAction<string>) => {
      state.categorySearchString = action.payload
    },
    updateCategorySearchTag: (state, action: PayloadAction<string>) => {
      state.categorySearchTag = action.payload
    },
    updateAgentSubscriptionStatus: (state, action: PayloadAction<{ agentId: number; subscribed: boolean }>) => {
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

      // Update subscriberCount in agentInfoList
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

      // Update subscriberCount in agentMarketplaceInfoList
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

      // Update subscriberCount in searchedAgentMarketplaceInfoList
      const agentInSearchedMarketplaceIndex = state.searchedAgentMarketplaceInfoList.findIndex(
        (agent) => agent.agentId === agentId,
      )
      if (agentInSearchedMarketplaceIndex !== -1) {
        if (subscribed) {
          state.searchedAgentMarketplaceInfoList[agentInSearchedMarketplaceIndex].subscriberCount += 1
        } else {
          state.searchedAgentMarketplaceInfoList[agentInSearchedMarketplaceIndex].subscriberCount = Math.max(
            0,
            state.searchedAgentMarketplaceInfoList[agentInSearchedMarketplaceIndex].subscriberCount - 1,
          )
        }
      }

      // Update subscriberCount in searchedAgentInfoList
      const agentInSearchedInfoIndex = state.searchedAgentInfoList.findIndex((agent) => agent.agentId === agentId)
      if (agentInSearchedInfoIndex !== -1) {
        if (subscribed) {
          state.searchedAgentInfoList[agentInSearchedInfoIndex].subscriberCount += 1
        } else {
          state.searchedAgentInfoList[agentInSearchedInfoIndex].subscriberCount = Math.max(
            0,
            state.searchedAgentInfoList[agentInSearchedInfoIndex].subscriberCount - 1,
          )
        }
      }
    },
    updateAgentMarketplaceInfoList: (state, action: PayloadAction<AgentInfo[]>) => {
      state.agentMarketplaceInfoList = action.payload
    },
    updateSearchedAgentMarketplaceInfoList: (state, action: PayloadAction<AgentInfo[]>) => {
      state.searchedAgentMarketplaceInfoList = action.payload
    },
    updateIsLoadingMarketplace: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMarketplace = action.payload
    },
    updateSubscribedAgentIds: (state, action: PayloadAction<number[]>) => {
      state.subscribedAgentIds = action.payload
    },
    updateCurrentKolInfo: (state, action: PayloadAction<KolInfo | null>) => {
      state.currentKolInfo = action.payload
    },
    updateCurrentTokenInfo: (state, action: PayloadAction<TokenInfo | null>) => {
      state.currentTokenInfo = action.payload
    },
  },
})

export const {
  updateAgentInfoListAgents,
  updateAgentInfoList,
  updateSearchedAgentInfoList,
  updateIsLoading,
  updateIsLoadMoreLoading,
  updateMarketplaceSearchString,
  updateCategorySearchString,
  updateCategorySearchTag,
  updateAgentSubscriptionStatus,
  updateAgentMarketplaceInfoList,
  updateSearchedAgentMarketplaceInfoList,
  updateIsLoadingMarketplace,
  updateSubscribedAgentIds,
  updateCurrentKolInfo,
  updateCurrentTokenInfo,
} = agentHubSlice.actions

export default agentHubSlice.reducer
