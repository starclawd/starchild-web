import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AI_STYLE_TYPE } from './tradeaicache.d';
// 主题状态接口
interface TradeAiCacheState {
  currentAiThreadId: string;
  showHistory: boolean;
  aiStyleType: AI_STYLE_TYPE
}

// 初始状态
const initialState: TradeAiCacheState = {
  currentAiThreadId: '',
  showHistory: false,
  aiStyleType: AI_STYLE_TYPE.NORMAL,
};

// 创建切片
export const tradeAiCacheSlice = createSlice({
  name: 'tradeaicache',
  initialState,
  reducers: {
    changeCurrentAiThreadId: (state, action: PayloadAction<{ currentAiThreadId: string }>) => {
      state.currentAiThreadId = action.payload.currentAiThreadId;
    },
    changeShowHistory: (state, action: PayloadAction<{ showHistory: boolean }>) => {
      state.showHistory = action.payload.showHistory;
    },
    changeAiStyleType: (state, action: PayloadAction<{ aiStyleType: AI_STYLE_TYPE }>) => {
      state.aiStyleType = action.payload.aiStyleType;
    },
  },
});

// 导出actions
export const { changeCurrentAiThreadId, changeShowHistory, changeAiStyleType } = tradeAiCacheSlice.actions;

// 导出reducer
export default tradeAiCacheSlice.reducer; 