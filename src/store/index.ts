import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import languageReducer from './language/reducer';
import themeReducer from './theme/reducer';
import { api } from '../api';

// Redux Persist
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// 需要持久化的reducer配置
const persistConfig = {
  key: 'root', // localStorage中的key
  storage, // 使用localStorage存储
  whitelist: ['language', 'theme'], // 持久化language和theme
  // blacklist: [], // 可选：不持久化的reducer列表
};

// 组合所有reducer
const rootReducer = combineReducers({
  language: languageReducer,
  theme: themeReducer,
  [api.reducerPath]: api.reducer,
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
    }).concat(api.middleware),
});

// 创建persistor
export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 