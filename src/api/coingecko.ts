import { baseApi } from './base'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoingeckoCoinIdMap: builder.query({
      query: (param) => ({
        url: '/coingecko/coins/list',
        method: 'get',
      }),
    }),
    getCoingeckoCoinOhlcRange: builder.query({
      query: ({ id, from, to, interval }) => ({
        url: `/coingecko/ohlc/range?coinId=${id}&from=${from}&to=${to}&interval=${interval}&vsCurrency=usd`,
        method: 'get',
      }),
    }),
    getCoinData: builder.query({
      query: ({ id }) => ({
        url: `/coingecko/coins/${id}`,
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
export const { useLazyGetCoingeckoCoinIdMapQuery, useLazyGetCoingeckoCoinOhlcRangeQuery, useLazyGetCoinDataQuery } =
  postsApi

export default postsApi
