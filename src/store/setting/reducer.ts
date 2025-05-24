import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskDataType } from './setting.d';

export interface SettingState {
  watchlist: string[];
  isFromTaskPage: boolean;
  taskList: TaskDataType[];
  currentTaskData: TaskDataType | null;
}

const initialState: SettingState = {
  watchlist: [],
  isFromTaskPage: false,
  taskList: [],
  currentTaskData: null,
};

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    updateWatchlist: (state, action: PayloadAction<string[]>) => {
      state.watchlist = action.payload;
    },
    updateIsFromTaskPage: (state, action: PayloadAction<boolean>) => {
      state.isFromTaskPage = action.payload;
    },
    updateTaskList: (state, action: PayloadAction<any[]>) => {
      state.taskList = action.payload;
    },
    updateCurrentTaskData: (state, action: PayloadAction<TaskDataType | null>) => {
      state.currentTaskData = action.payload;
    },
  },
});

export const {
  updateWatchlist,
  updateIsFromTaskPage,
  updateTaskList,
  updateCurrentTaskData,
} = settingSlice.actions;

export default settingSlice.reducer; 