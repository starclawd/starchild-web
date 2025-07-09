import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

// 主题状态接口
interface ThemecacheState {
  mode: ThemeMode
}

// 初始状态
const initialState: ThemecacheState = {
  mode: 'light', // 默认使用亮色主题
}

// 创建切片
export const themecacheSlice = createSlice({
  name: 'themecache',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    },
  },
})

// 导出actions
export const { setTheme, toggleTheme } = themecacheSlice.actions

// 导出reducer
export default themecacheSlice.reducer
