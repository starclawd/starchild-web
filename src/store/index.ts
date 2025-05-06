import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import languagecacheReducer from './languagecache/reducer';
import themecacheReducer from './themecache/reducer';
import tradeaiReducer from './tradeai/reducer';
import tradeaicacheReducer from './tradeaicache/reducer';
import loginReducer from './login/reducer';
import applicationReducer from './application/reducer';
import portfolioReducer from './portfolio/reducer';
import websocketReducer from './websocket/reducer';
import websocketMiddleware from './websocket/websocketMiddle';
import logincacheReducer from './logincache/reducer';
import insightsCacheReducer from './insightscache/reducer';
import portfoliocacheReducer from './portfoliocache/reducer';
import insightsReducer from './insights/reducer';
import { baseApi, tradeAiApi, baseBinanceApi } from '../api/base';

// Redux Persist
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { StateReconciler } from 'redux-persist/es/types';

// 定义每个reducer的版本号
const REDUCER_VERSIONS: Record<string, string> = {
  languagecache: '0.0.1',
  themecache: '0.0.1',
  tradeaicache: '0.0.1',
  logincache: '0.0.1',
  insightsCache: '0.0.1',
  portfoliocache: '0.0.1',
};

// 需要持久化的reducer配置
const persistConfig = {
  key: 'root', // localStorage中的key
  storage, // 使用localStorage存储
  whitelist: ['languagecache', 'themecache', 'tradeaicache', 'logincache', 'insightsCache', 'portfoliocache'], // 持久化language和theme
  // blacklist: [], // 可选：不持久化的reducer列表
  version: 1, // 根持久化版本，不同于各个reducer的版本
  migrate: createMigrate({
    // 迁移函数，用于根据版本控制
    1: (state: any) => {
      return state;
    }
  }),
  stateReconciler: ((inboundState: any, originalState: any, reducedState: any, config: any) => {
    // 检查每个reducer的版本是否有变化
    const persistedVersions = JSON.parse(localStorage.getItem('reducer_versions') || '{}');
    
    // 创建一个新的state对象
    const newState = { ...inboundState };
    
    // 检查每个白名单中的reducer
    config.whitelist?.forEach((reducerKey: string) => {
      const currentVersion = REDUCER_VERSIONS[reducerKey];
      const persistedVersion = persistedVersions[reducerKey];
      
      // 如果版本不同（或者没有记录过版本信息）则重置该reducer状态
      if (persistedVersion !== currentVersion) {
        // 使用初始状态替换
        newState[reducerKey] = reducedState[reducerKey];
      }
    });
    
    // 保存最新的版本信息到localStorage
    localStorage.setItem('reducer_versions', JSON.stringify(REDUCER_VERSIONS));
    
    // 确保非持久化的状态也存在
    // 这样即使在恢复过程中，也保证了不在whitelist中的reducer（如login）有初始状态
    Object.keys(reducedState).forEach((key) => {
      if (!newState[key]) {
        newState[key] = reducedState[key];
      }
    });
    
    return newState;
  }) as StateReconciler<any>
};

// 组合所有reducer
const rootReducer = combineReducers({
  languagecache: languagecacheReducer,
  themecache: themecacheReducer,
  tradeai: tradeaiReducer,
  tradeaicache: tradeaicacheReducer,
  login: loginReducer,
  application: applicationReducer,
  portfolio: portfolioReducer,
  logincache: logincacheReducer,
  insightsCache: insightsCacheReducer,
  portfoliocache: portfoliocacheReducer,
  insights: insightsReducer,
  websocket: websocketReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [tradeAiApi.reducerPath]: tradeAiApi.reducer,
  [baseBinanceApi.reducerPath]: baseBinanceApi.reducer,
});

// 定义根reducer的类型
type RootReducerState = ReturnType<typeof rootReducer>;

// 创建持久化reducer
const persistedReducer = persistReducer<RootReducerState>(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware, tradeAiApi.middleware, baseBinanceApi.middleware, websocketMiddleware),
});

// 创建persistor
export const persistor = persistStore(store);

setupListeners(store.dispatch);

// 修改RootState类型定义，添加PersistPartial
import { PersistPartial } from 'redux-persist/es/persistReducer';

// 明确定义每个状态的类型
export interface RootState {
  languagecache: ReturnType<typeof languagecacheReducer>;
  themecache: ReturnType<typeof themecacheReducer>;
  tradeai: ReturnType<typeof tradeaiReducer>;
  tradeaicache: ReturnType<typeof tradeaicacheReducer>;
  login: ReturnType<typeof loginReducer>;
  application: ReturnType<typeof applicationReducer>;
  portfolio: ReturnType<typeof portfolioReducer>;
  websocket: ReturnType<typeof websocketReducer>;
  logincache: ReturnType<typeof logincacheReducer>;
  insightsCache: ReturnType<typeof insightsCacheReducer>;
  portfoliocache: ReturnType<typeof portfoliocacheReducer>;
  insights: ReturnType<typeof insightsReducer>;
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
  [tradeAiApi.reducerPath]: ReturnType<typeof tradeAiApi.reducer>;
  [baseBinanceApi.reducerPath]: ReturnType<typeof baseBinanceApi.reducer>;
  _persist?: PersistPartial;
}

export type AppDispatch = typeof store.dispatch; 