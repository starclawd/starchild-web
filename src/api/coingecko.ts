import { coingeckoApi } from './base'

const postsApi = coingeckoApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoingeckoCoinIdMap: builder.query({
      query: (param) => ({
        url: '/api/v3/coins/list',
        method: 'get',
      }),
    }),
    getCoingeckoCoinOhlcRange: builder.query({
      query: ({ id, from, to, interval }) => ({
        url: `/api/v3/coins/${id}/ohlc/range?from=${from}&to=${to}&interval=${interval}&vs_currency=usd`,
        method: 'get',
      }),
    }),
    getCoinData: builder.query({
      query: ({ id }) => ({
        url: `/api/v3/coins/${id}`,
        method: 'get', 
      }),
    }),
  }),
  overrideExisting: false,
})

/**
 * 导出基础 API hooks
 * 使用 Lazy 查询模式，只在需要时触发请求
 */
export const {
  useLazyGetCoingeckoCoinIdMapQuery,
  useLazyGetCoingeckoCoinOhlcRangeQuery,
  useLazyGetCoinDataQuery,
} = postsApi

export default postsApi
