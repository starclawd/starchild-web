import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationModal } from './application';

export interface ApplicationState {
  openModal: ApplicationModal | null;
  htmlScollTop: number;
  visualViewportHeight: number;
}

const initialState: ApplicationState = {
  openModal: null,
  htmlScollTop: 0,
  visualViewportHeight: 0,
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
  },
});

export const { updateOpenModal, setHtmlScrollTop, setVisualViewportHeight } = applicationSlice.actions;

export default applicationSlice.reducer; 