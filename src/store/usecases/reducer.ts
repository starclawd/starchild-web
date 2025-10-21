import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TabKey } from 'constants/useCases'

export interface UseCasesState {
  activeTab: TabKey
}

const initialState: UseCasesState = {
  activeTab: 'ta' as TabKey,
}

const useCasesSlice = createSlice({
  name: 'usecases',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabKey>) => {
      state.activeTab = action.payload
    },
  },
})

export const useCasesActions = useCasesSlice.actions
export default useCasesSlice.reducer
