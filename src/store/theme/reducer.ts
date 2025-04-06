import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

// 主题状态接口
interface ThemeState {
  mode: ThemeMode;
}

// 初始状态
const initialState: ThemeState = {
  mode: 'light', // 默认使用亮色主题
};

// 创建切片
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

// 导出actions
export const { setTheme, toggleTheme } = themeSlice.actions;

// 导出reducer
export default themeSlice.reducer; 