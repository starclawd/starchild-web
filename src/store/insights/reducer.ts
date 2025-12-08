import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BinanceSymbolsDataType,
  CoingeckoCoinIdMapDataType,
  KlineSubDataType,
  LiveChatDataType,
} from './insights.d'
import { AgentOverviewDetailDataType, NewTriggerDataType } from 'store/myagent/myagent'

export interface InsightsState {
  klineSubData: KlineSubDataType | null
  coingeckoCoinIdMap: CoingeckoCoinIdMapDataType[]
  binanceSymbols: BinanceSymbolsDataType[]
  systemSignalOverviewList: AgentOverviewDetailDataType[]
  isLoadingSystemSignalOverview: boolean
  systemSignalList: AgentOverviewDetailDataType[]
  newTriggerSystemSignalHistoryList: NewTriggerDataType[]
  liveChatList: LiveChatDataType[]
  liveChatSubData: LiveChatDataType | null
  isExpandedLiveChat: boolean
  currentLiveChatData: LiveChatDataType | null
}

const initialState: InsightsState = {
  klineSubData: null,
  coingeckoCoinIdMap: [],
  binanceSymbols: [],
  systemSignalOverviewList: [],
  isLoadingSystemSignalOverview: false,
  systemSignalList: [],
  newTriggerSystemSignalHistoryList: [],
  liveChatList: [],
  liveChatSubData: null,
  isExpandedLiveChat: false,
  currentLiveChatData: null,
}

export const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    updateKlineSubData: (state, action: PayloadAction<KlineSubDataType | null>) => {
      state.klineSubData = action.payload
    },
    updateCoingeckoCoinIdMap: (state, action: PayloadAction<CoingeckoCoinIdMapDataType[]>) => {
      state.coingeckoCoinIdMap = action.payload
    },
    updateBinanceSymbols: (state, action: PayloadAction<BinanceSymbolsDataType[]>) => {
      state.binanceSymbols = action.payload
    },
    updateSystemSignalOverviewList: (state, action: PayloadAction<AgentOverviewDetailDataType[]>) => {
      state.systemSignalOverviewList = action.payload
    },
    updateIsLoadingSystemSignalOverview: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSystemSignalOverview = action.payload
    },
    updateSystemSignalList: (state, action: PayloadAction<AgentOverviewDetailDataType[]>) => {
      state.systemSignalList = action.payload
    },
    updateNewTriggerSystemSignalHistoryList: (state, action: PayloadAction<NewTriggerDataType>) => {
      state.newTriggerSystemSignalHistoryList.unshift(action.payload)
    },
    updateLiveChatList: (state, action: PayloadAction<LiveChatDataType[]>) => {
      state.liveChatList = action.payload
    },
    updateLiveChatSubData: (state, action: PayloadAction<LiveChatDataType>) => {
      state.liveChatList = [action.payload, ...state.liveChatList]
    },
    updateIsExpandedLiveChat: (state, action: PayloadAction<boolean>) => {
      state.isExpandedLiveChat = action.payload
    },
    updateCurrentLiveChatData: (state, action: PayloadAction<LiveChatDataType | null>) => {
      state.currentLiveChatData = action.payload
    },
    resetNewTriggerSystemSignalHistoryList: (state) => {
      state.newTriggerSystemSignalHistoryList = []
    },
  },
})

export const {
  updateKlineSubData,
  updateCoingeckoCoinIdMap,
  updateBinanceSymbols,
  updateSystemSignalOverviewList,
  updateIsLoadingSystemSignalOverview,
  updateSystemSignalList,
  updateNewTriggerSystemSignalHistoryList,
  resetNewTriggerSystemSignalHistoryList,
  updateLiveChatList,
  updateLiveChatSubData,
  updateIsExpandedLiveChat,
  updateCurrentLiveChatData,
} = insightsSlice.actions

export default insightsSlice.reducer
