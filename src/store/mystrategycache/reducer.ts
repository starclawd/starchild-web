import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyStrategyCacheState } from './mystrategycache'

const initialState: MyStrategyCacheState = {
  tabIndex: 0,
}

const myStrategyCacheSlice = createSlice({
  name: 'mystrategycache',
  initialState,
  reducers: {
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload
    },
  },
})

export const { setTabIndex } = myStrategyCacheSlice.actions

export default myStrategyCacheSlice.reducer
