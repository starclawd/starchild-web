import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MY_PORTFOLIO_TAB_KEY, STRATEGY_TAB_KEY, MyStrategyCacheState } from './mystrategycache'

const initialState: MyStrategyCacheState = {
  strategyTabKey: STRATEGY_TAB_KEY.LAUNCHED,
  activeTab: MY_PORTFOLIO_TAB_KEY.VAULTS,
}

const myStrategyCacheSlice = createSlice({
  name: 'mystrategycache',
  initialState,
  reducers: {
    setStrategyTabKey: (state, action: PayloadAction<STRATEGY_TAB_KEY>) => {
      state.strategyTabKey = action.payload
    },
    setActiveTab: (state, action: PayloadAction<MY_PORTFOLIO_TAB_KEY>) => {
      state.activeTab = action.payload
    },
  },
})

export const { setStrategyTabKey, setActiveTab } = myStrategyCacheSlice.actions

export default myStrategyCacheSlice.reducer
