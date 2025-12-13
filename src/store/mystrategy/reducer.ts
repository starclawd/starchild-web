import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyStrategyDataType } from './mystrategy'

export interface MyStrategyState {
  myStrategies: MyStrategyDataType[]
  isLoadingMyStrategies: boolean
}

const initialState: MyStrategyState = {
  myStrategies: [],
  isLoadingMyStrategies: false,
}

export const myStrategySlice = createSlice({
  name: 'mystrategy',
  initialState,
  reducers: {
    updateMyStrategies: (state, action: PayloadAction<MyStrategyDataType[]>) => {
      state.myStrategies = action.payload
    },
    setLoadingMyStrategies: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMyStrategies = action.payload
    },
    resetMyStrategy: (state) => {
      return { ...initialState }
    },
  },
})

export const { updateMyStrategies, setLoadingMyStrategies, resetMyStrategy } = myStrategySlice.actions

export default myStrategySlice.reducer
