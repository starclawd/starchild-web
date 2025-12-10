/**
 * API 基础配置文件
 * 包含以下功能：
 * 1. 基础 API 请求配置
 * 2. 请求拦截器配置
 * 3. 响应拦截器配置
 * 4. 各类 API 实例创建
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseApi } from './baseStarchild'
import { chatApi } from './baseChat'
import { liveTradingApi } from './baseLiveTrading'
import { orderlyDomain } from 'utils/url'
export { baseApi, chatApi, liveTradingApi }

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

/**
 * 币安现货 API
 * 用于获取币安现货市场数据
 */
export const baseBinanceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/' }),
  reducerPath: 'baseBinanceApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

export const coinmarketApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://s3.coinmarketcap.com/' }),
  reducerPath: 'coinmarketApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

export const coingeckoApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pro-api.coingecko.com/' }),
  reducerPath: 'coingeckoApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * Orderly API
 * 用于访问Orderly相关的Vault数据和服务
 */
export const orderlyApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: orderlyDomain.restfulDomain }),
  reducerPath: 'orderlyApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})
