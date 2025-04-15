/**
 * API 基础配置文件
 * 包含以下功能：
 * 1. 基础 API 请求配置
 * 2. 请求拦截器配置
 * 3. 响应拦截器配置
 * 4. 各类 API 实例创建
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isLocalEnv } from 'utils/url'
import { baseApi } from './baseHolominds'
import { tradeAiApi } from './baseTradeAi'
export { baseApi, tradeAiApi }

/**
 * DODO API
 * 用于获取 CoinGecko 代币数据
 */
export const dodoApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: isLocalEnv ? '' : 'https://tokens.coingecko.com/' 
  }),
  reducerPath: 'dodoApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * OpenAI API
 * 用于访问 OpenAI 的服务
 * 支持切换不同的 API 端点
 */
export const openAiApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openai.com/v1/' }),
  // 备用 API 端点
  // baseQuery: fetchBaseQuery({ baseUrl: 'https://api.zhizengzeng.com/v1/' }),
  reducerPath: 'openAiApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

// ... existing code ...
