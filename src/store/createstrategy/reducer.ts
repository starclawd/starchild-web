import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatContentDataType, ChatResponseContentDataType } from './createstrategy'

export interface CreateStrategyState {
  chatContentList: ChatContentDataType[]
  strategyInfoTabIndex: number
  chatResponseContentList: ChatResponseContentDataType[]
}

const initialState: CreateStrategyState = {
  chatContentList: [],
  strategyInfoTabIndex: 0,
  chatResponseContentList: [],
}

export const createStrategySlice = createSlice({
  name: 'createStrategy',
  initialState,
  reducers: {
    updateChatContentList: (state, action: PayloadAction<any[]>) => {
      state.chatContentList = action.payload
    },
    updateStrategyInfoTabIndex: (state, action: PayloadAction<number>) => {
      state.strategyInfoTabIndex = action.payload
    },
    changeChatResponseContentList: (
      state,
      action: PayloadAction<{ chatResponseContentList: ChatResponseContentDataType[] }>,
    ) => {
      state.chatResponseContentList = action.payload.chatResponseContentList
    },
    resetCreateStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const { updateChatContentList, updateStrategyInfoTabIndex, changeChatResponseContentList, resetCreateStrategy } =
  createStrategySlice.actions

export default createStrategySlice.reducer
