import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CreateStrategyCacheState } from './createstrategycache'
import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

const initialState: CreateStrategyCacheState = {
  strategyTabIndexMap: {},
}

const createStrategyCacheSlice = createSlice({
  name: 'createstrategycache',
  initialState,
  reducers: {
    setStrategyTabIndex: (state, action: PayloadAction<{ strategyId: string; tabIndex: STRATEGY_TAB_INDEX }>) => {
      const { strategyId, tabIndex } = action.payload
      state.strategyTabIndexMap[strategyId] = tabIndex
    },
  },
})

export const { setStrategyTabIndex } = createStrategyCacheSlice.actions

export default createStrategyCacheSlice.reducer
