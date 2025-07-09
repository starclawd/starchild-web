import { coinmarketApi } from './base'

const postsApi = coinmarketApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoinId: builder.query({
      query: (param) => ({
        url: '/generated/core/crypto/cryptos.json',
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
export const { useLazyGetCoinIdQuery } = postsApi

export default postsApi
