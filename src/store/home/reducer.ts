import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CandidateStatusDataType } from './home'

export interface HomeState {
  candidateStatus: CandidateStatusDataType
}

const initialState: HomeState = {
  candidateStatus: {
    burnAt: '',
    hasMinted: false,
    inWhitelist: false,
    inWaitList: false,
  },
}

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    updateCandidateStatus: (state, action: PayloadAction<CandidateStatusDataType>) => {
      state.candidateStatus = action.payload
    },
  },
})

export const { updateCandidateStatus } = homeSlice.actions

export default homeSlice.reducer
