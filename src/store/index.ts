import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import languageReducer from './language/reducer';
import themeReducer from './theme/reducer';
import tradeaiReducer from './tradeai/reducer';
import tradeaicacheReducer from './tradeaicache/reducer';
import loginReducer from './login/reducer';
import applicationReducer from './application/reducer';
import { baseApi } from '../api/base';

// Redux Persist
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// 需要持久化的reducer配置
const persistConfig = {
  key: 'root', // localStorage中的key
  storage, // 使用localStorage存储
  whitelist: ['language', 'theme', 'tradeaicache'], // 持久化language和theme
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
  [baseApi.reducerPath]: baseApi.reducer,
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略redux-persist的action类型
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
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
  _persist?: PersistPartial;
}

export type AppDispatch = typeof store.dispatch; 