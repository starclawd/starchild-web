import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatContentDataType } from './createstrategy'

export interface CreateStrategyState {
  chatContentList: ChatContentDataType[]
  strategyInfoTabIndex: number
}

const initialState: CreateStrategyState = {
  chatContentList: [],
  strategyInfoTabIndex: 0,
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
    resetCreateStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const { updateChatContentList, updateStrategyInfoTabIndex } = createStrategySlice.actions

export default createStrategySlice.reducer
