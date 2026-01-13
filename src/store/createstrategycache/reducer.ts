import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CreateStrategyCacheState } from './createstrategycache'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

export const DEFAULT_LEFT_WIDTH = 400

const initialState: CreateStrategyCacheState = {
  strategyTabIndexMap: {},
  leftWidth: DEFAULT_LEFT_WIDTH,
}

const createStrategyCacheSlice = createSlice({
  name: 'createstrategycache',
  initialState,
  reducers: {
    setStrategyTabIndex: (state, action: PayloadAction<{ strategyId: string; tabIndex: STRATEGY_TAB_INDEX }>) => {
      const { strategyId, tabIndex } = action.payload
      state.strategyTabIndexMap[strategyId] = tabIndex
    },
    setLeftWidth: (state, action: PayloadAction<number>) => {
      state.leftWidth = action.payload
    },
  },
})

export const { setStrategyTabIndex, setLeftWidth } = createStrategyCacheSlice.actions

export default createStrategyCacheSlice.reducer
