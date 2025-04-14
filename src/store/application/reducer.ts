import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationModal } from './application';

export interface ApplicationState {
  openModal: ApplicationModal | null;
  htmlScollTop: number;
  visualViewportHeight: number;
  currentRouter: string;
}

const initialState: ApplicationState = {
  openModal: null,
  htmlScollTop: 0,
  visualViewportHeight: 0,
  currentRouter: window.location.pathname,
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
  },
});

export const { updateOpenModal, setHtmlScrollTop, setVisualViewportHeight, setCurrentRouter } = applicationSlice.actions;

export default applicationSlice.reducer; 