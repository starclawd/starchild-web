/**
 * API 基础配置文件
 * 包含以下功能：
 * 1. 基础 API 请求配置
 * 2. 请求拦截器配置
 * 3. 响应拦截器配置
 * 4. 各类 API 实例创建
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { isLocalEnv, isPro } from 'utils/url'
import { OPEN_ALL_PERMISSIONS } from 'types/global.d'
import { parsedQueryString } from 'hooks/useParsedQueryString'
import { baseApi } from './baseJojo'
import { tradeAiApi } from './baseTradeAi'

// 获取 URL 参数
const search = window.location.search
const { openAllPermissions } = parsedQueryString(search)

export { baseApi, tradeAiApi }

/**
 * 第三方 API 配置
 * 包含各种外部服务的 API 实例
 */

/**
 * 币安现货 API
 * 用于获取币安现货市场数据
 */
export const baseBinanceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api1.binance.com/' }),
  reducerPath: 'baseBinanceApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * OKX 现货 API
 * 用于获取 OKX 现货市场数据
 */
export const baseOkxApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.okx.com/' }),
  reducerPath: 'baseOkxApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * 币安网格交易 API
 * 用于币安平台的网格交易功能
 */
export const binanceGridApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.binance.com/' }),
  reducerPath: 'binanceGridApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * Google Cloud Storage API
 * 用于访问谷歌云存储服务
 */
export const googleCloudStorageApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  reducerPath: 'googleCloudStorageApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * 1inch DEX 聚合器 API
 * 用于获取最优交易路径和价格
 */
export const inchApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.1inch.io/v5.0/' }),
  reducerPath: 'inchApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * zkSync API
 * 用于与 zkSync 网络交互
 * 根据环境配置选择主网或测试网
 */
export const zksyncApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: (isPro || openAllPermissions === OPEN_ALL_PERMISSIONS.MAIN_NET) 
      ? 'https://mainnet.era.zksync.io/' 
      : 'https://testnet.era.zksync.dev/' 
  }),
  reducerPath: 'zksyncApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * OKX DEX 聚合器 API
 * 用于获取 OKX DEX 的交易数据
 */
export const okxApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: isLocalEnv 
      ? '/api/v5/dex/aggregator/' 
      : 'https://www.okx.com/api/v5/dex/aggregator/' 
  }),
  reducerPath: 'okxApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

/**
 * DefiLlama API
 * 用于获取 DeFi 协议的收益率数据
 */
export const llamaApi = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: isLocalEnv ? '' : 'https://yields.llama.fi/' 
  }),
  reducerPath: 'llamaApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

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

/**
 * Lido API
 * 用于获取 Lido 质押相关的数据
 */
export const lidoApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://eth-api.lido.fi/' }),
  reducerPath: 'lidoApi',
  keepUnusedDataFor: 5 * 60,
  refetchOnMountOrArgChange: 30 * 60,
  endpoints: () => ({}),
})

// ... existing code ...
