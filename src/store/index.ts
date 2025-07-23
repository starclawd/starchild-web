import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import languagecacheReducer from './languagecache/reducer'
import themecacheReducer from './themecache/reducer'
import chatReducer from './chat/reducer'
import chatcacheReducer from './chatcache/reducer'
import loginReducer from './login/reducer'
import applicationReducer from './application/reducer'
import portfolioReducer from './portfolio/reducer'
import logincacheReducer from './logincache/reducer'
import insightscacheReducer from './insightscache/reducer'
import portfoliocacheReducer from './portfoliocache/reducer'
import insightsReducer from './insights/reducer'
import shortcutsReducer from './shortcuts/reducer'
import timezonecacheReducer from './timezonecache/reducer'
import settingcacheReducer from './settingcache/reducer'
import agentdetailReducer from './agentdetail/reducer'
import agentHubReducer from './agenthub/reducer'
import headercacheReducer from './headercache/reducer'
import myagentReducer from './myagent/reducer'
import { baseApi, chatApi, baseBinanceApi, coinmarketApi, coingeckoApi, openAiApi } from '../api/base'

// Redux Persist
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import { StateReconciler } from 'redux-persist/es/types'

// 定义每个reducer的版本号
const REDUCER_VERSIONS: Record<string, string> = {
  languagecache: '0.0.1',
  themecache: '0.0.1',
  chatcache: '0.0.1',
  logincache: '0.0.1',
  insightscache: '0.0.4',
  portfoliocache: '0.0.1',
  timezonecache: '0.0.2',
  settingcache: '0.0.1',
  headercache: '0.0.2',
}

// 需要持久化的reducer配置
const persistConfig = {
  key: 'root', // localStorage中的key
  storage, // 使用localStorage存储
  whitelist: [
    'languagecache',
    'themecache',
    'chatcache',
    'logincache',
    'insightscache',
    'portfoliocache',
    'timezonecache',
    'settingcache',
    'headercache',
  ], // 持久化language和theme
  // blacklist: [], // 可选：不持久化的reducer列表
  version: 1, // 根持久化版本，不同于各个reducer的版本
  migrate: createMigrate({
    // 迁移函数，用于根据版本控制
    1: (state: any) => {
      return state
    },
  }),
  stateReconciler: ((inboundState: any, originalState: any, reducedState: any, config: any) => {
    // 检查每个reducer的版本是否有变化
    const persistedVersions = JSON.parse(localStorage.getItem('reducer_versions') || '{}')

    // 创建一个新的state对象
    const newState = { ...inboundState }

    // 检查每个白名单中的reducer
    config.whitelist?.forEach((reducerKey: string) => {
      const currentVersion = REDUCER_VERSIONS[reducerKey]
      const persistedVersion = persistedVersions[reducerKey]

      // 如果版本不同（或者没有记录过版本信息）则重置该reducer状态
      if (persistedVersion !== currentVersion) {
        // 使用初始状态替换
        newState[reducerKey] = reducedState[reducerKey]
      }
    })

    // 保存最新的版本信息到localStorage
    localStorage.setItem('reducer_versions', JSON.stringify(REDUCER_VERSIONS))

    // 确保非持久化的状态也存在
    // 这样即使在恢复过程中，也保证了不在whitelist中的reducer（如login）有初始状态
    Object.keys(reducedState).forEach((key) => {
      if (!newState[key]) {
        newState[key] = reducedState[key]
      }
    })

    return newState
  }) as StateReconciler<any>,
}

// 组合所有reducer
const rootReducer = combineReducers({
  languagecache: languagecacheReducer,
  themecache: themecacheReducer,
  chat: chatReducer,
  chatcache: chatcacheReducer,
  login: loginReducer,
  application: applicationReducer,
  portfolio: portfolioReducer,
  logincache: logincacheReducer,
  insightscache: insightscacheReducer,
  portfoliocache: portfoliocacheReducer,
  timezonecache: timezonecacheReducer,
  insights: insightsReducer,
  shortcuts: shortcutsReducer,
  settingcache: settingcacheReducer,
  agentdetail: agentdetailReducer,
  agentHub: agentHubReducer,
  headercache: headercacheReducer,
  myagent: myagentReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [baseBinanceApi.reducerPath]: baseBinanceApi.reducer,
  [coinmarketApi.reducerPath]: coinmarketApi.reducer,
  [coingeckoApi.reducerPath]: coingeckoApi.reducer,
  [openAiApi.reducerPath]: openAiApi.reducer,
})

// 定义根reducer的类型
type RootReducerState = ReturnType<typeof rootReducer>

// 创建持久化reducer
const persistedReducer = persistReducer<RootReducerState>(persistConfig, rootReducer)

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      baseApi.middleware,
      chatApi.middleware,
      baseBinanceApi.middleware,
      coinmarketApi.middleware,
      coingeckoApi.middleware,
      openAiApi.middleware,
    ),
})

// 创建persistor
export const persistor = persistStore(store)

setupListeners(store.dispatch)

// 修改RootState类型定义，添加PersistPartial
import { PersistPartial } from 'redux-persist/es/persistReducer'

// 明确定义每个状态的类型
export interface RootState {
  languagecache: ReturnType<typeof languagecacheReducer>
  themecache: ReturnType<typeof themecacheReducer>
  chat: ReturnType<typeof chatReducer>
  chatcache: ReturnType<typeof chatcacheReducer>
  login: ReturnType<typeof loginReducer>
  application: ReturnType<typeof applicationReducer>
  portfolio: ReturnType<typeof portfolioReducer>
  logincache: ReturnType<typeof logincacheReducer>
  insightscache: ReturnType<typeof insightscacheReducer>
  portfoliocache: ReturnType<typeof portfoliocacheReducer>
  insights: ReturnType<typeof insightsReducer>
  timezonecache: ReturnType<typeof timezonecacheReducer>
  shortcuts: ReturnType<typeof shortcutsReducer>
  settingcache: ReturnType<typeof settingcacheReducer>
  agentdetail: ReturnType<typeof agentdetailReducer>
  agentHub: ReturnType<typeof agentHubReducer>
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>
  [chatApi.reducerPath]: ReturnType<typeof chatApi.reducer>
  [baseBinanceApi.reducerPath]: ReturnType<typeof baseBinanceApi.reducer>
  headercache: ReturnType<typeof headercacheReducer>
  myagent: ReturnType<typeof myagentReducer>
  _persist?: PersistPartial
}

export type AppDispatch = typeof store.dispatch
