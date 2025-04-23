import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import languageReducer from './language/reducer';
import themeReducer from './theme/reducer';
import tradeaiReducer from './tradeai/reducer';
import tradeaicacheReducer from './tradeaicache/reducer';
import loginReducer from './login/reducer';
import applicationReducer from './application/reducer';
import portfolioReducer from './portfolio/reducer';
import websocketReducer from './websocket/reducer';
import websocketMiddleware from './websocket/websocketMiddle';
import userCacheReducer from './usercache/reducer';
import { baseApi, tradeAiApi } from '../api/base';

// Redux Persist
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// 需要持久化的reducer配置
const persistConfig = {
  key: 'root', // localStorage中的key
  storage, // 使用localStorage存储
  whitelist: ['language', 'theme', 'tradeaicache', 'userCache'], // 持久化language和theme
  // blacklist: [], // 可选：不持久化的reducer列表
};

// 组合所有reducer
const rootReducer = combineReducers({
  language: languageReducer,
  theme: themeReducer,
  tradeai: tradeaiReducer,
  tradeaicache: tradeaicacheReducer,
  login: loginReducer,
  application: applicationReducer,
  portfolio: portfolioReducer,
  userCache: userCacheReducer,
  websocket: websocketReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [tradeAiApi.reducerPath]: tradeAiApi.reducer,
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, tradeAiApi.middleware, websocketMiddleware),
});

// 创建persistor
export const persistor = persistStore(store);

setupListeners(store.dispatch);

// 修改RootState类型定义，添加PersistPartial
import { PersistPartial } from 'redux-persist/es/persistReducer';

// 明确定义每个状态的类型
export interface RootState {
  language: ReturnType<typeof languageReducer>;
  theme: ReturnType<typeof themeReducer>;
  tradeai: ReturnType<typeof tradeaiReducer>;
  tradeaicache: ReturnType<typeof tradeaicacheReducer>;
  login: ReturnType<typeof loginReducer>;
  application: ReturnType<typeof applicationReducer>;
  portfolio: ReturnType<typeof portfolioReducer>;
  websocket: ReturnType<typeof websocketReducer>;
  userCache: ReturnType<typeof userCacheReducer>;
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
  [tradeAiApi.reducerPath]: ReturnType<typeof tradeAiApi.reducer>;
  _persist?: PersistPartial;
}

export type AppDispatch = typeof store.dispatch; 