import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// 主题状态接口
interface TradeAiCacheState {
  currentAiThreadId: string;
}

// 初始状态
const initialState: TradeAiCacheState = {
  currentAiThreadId: '',
};

// 创建切片
export const tradeAiCacheSlice = createSlice({
  name: 'tradeaicache',
  initialState,
  reducers: {
    changeCurrentAiThreadId: (state, action: PayloadAction<{ currentAiThreadId: string }>) => {
      state.currentAiThreadId = action.payload.currentAiThreadId;
    },
  },
});

// 导出actions
export const { changeCurrentAiThreadId } = tradeAiCacheSlice.actions;

// 导出reducer
export default tradeAiCacheSlice.reducer; 