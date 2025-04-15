import { baseApi } from './baseHolominds'
export const OPEN_AI_KEY = ''

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvmWalletTokenBalancesPrice: builder.query({
      query: ({
        walletAddress,
        chain,
        cursor,
      }) => {
        return {
          url: `/api/v2.2/wallets/${walletAddress}/tokens`,
          method: 'get',
          params: {
            chain,
            exclude_spam: true,
            exclude_unverified_contracts: true,
            cursor,
            limit: 100,
            min_pair_side_liquidity_usd: 1000,
          },
        }
      },
    }),
    getEvmWalletNetWorth: builder.query({
      query: ({
        walletAddress,
        chains,
      }) => {
        return {
          url: `/api/v2.2/wallets/${walletAddress}/net-worth`,
          method: 'get',
          params: {
            chains,
            exclude_spam: true,
            exclude_unverified_contracts: true,
            min_pair_side_liquidity_usd: 1000,
          },
        }
      },
    }),
    getEvmWalletProfitabilitySummary: builder.query({
      query: ({
        walletAddress,
        chain,
      }) => {
        return {
          url: `/api/v2.2/wallets/${walletAddress}/profitability/summary`,
          method: 'get',
          params: {
            chain,
          },
        }
      },
    }),
    getEvmDefiPositionsSummary: builder.query({
      query: ({
        walletAddress,
        chain,
      }) => {
        return {
          url: `/api/v2.2/wallets/${walletAddress}/defi/positions`,
          method: 'get',
          params: {
            chain,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetEvmWalletTokenBalancesPriceQuery,
  useLazyGetEvmWalletNetWorthQuery,
  useLazyGetEvmWalletProfitabilitySummaryQuery,
  useLazyGetEvmDefiPositionsSummaryQuery,
} = postsApi
export default postsApi
