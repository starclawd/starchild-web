import { baseApi } from './baseHolominds'
export const OPEN_AI_KEY = ''

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSolTokenBalances: builder.query({
      query: ({
        walletAddress,
        network,
      }) => {
        return {
          url: `/account/${network}/${walletAddress}/tokens`,
          method: 'get',
        }
      },
    }),
    getSolPortfolio: builder.query({
      query: ({
        walletAddress,
        network,
      }) => {
        return {
          url: `/account/${network}/${walletAddress}/portfolio`,
          method: 'get',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetSolTokenBalancesQuery,
  useLazyGetSolPortfolioQuery,
} = postsApi
export default postsApi
