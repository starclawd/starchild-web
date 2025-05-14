import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationModal, CoinIdData } from './application';

export interface ApplicationState {
  openModal: ApplicationModal | null;
  htmlScollTop: number;
  visualViewportHeight: number;
  currentRouter: string;
  coinIdList: CoinIdData[]
}

const initialState: ApplicationState = {
  openModal: null,
  htmlScollTop: 0,
  visualViewportHeight: 0,
  currentRouter: window.location.pathname,
  coinIdList: []
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateOpenModal: (state, action: PayloadAction<ApplicationModal | null>) => {
      state.openModal = action.payload;
    },
    setHtmlScrollTop: (state, action: PayloadAction<number>) => {
      state.htmlScollTop = action.payload;
    },
    setVisualViewportHeight: (state, action: PayloadAction<number>) => {
      state.visualViewportHeight = action.payload;
    },
    setCurrentRouter(state, action: PayloadAction<string>) {
      state.currentRouter = action.payload
    },
    setCoinIdList(state, action: PayloadAction<CoinIdData[]>) {
      state.coinIdList = action.payload
    }
  },
});

export const { updateOpenModal, setHtmlScrollTop, setVisualViewportHeight, setCurrentRouter, setCoinIdList } = applicationSlice.actions;

export default applicationSlice.reducer; 