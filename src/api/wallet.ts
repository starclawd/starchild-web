import { baseApi } from './baseHolominds'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletHistory: builder.query({
      query: ({
        chain,
        evmAddress,
        limit,
      }) => {
        return {
          url: `/private/allWalletHistory?evmAddress=${evmAddress}&includeInternalTransactions=true`,
          method: 'get',
        }
      },
    }),
    getNetWorth: builder.query({
      query: ({
        chains,
        evmAddress,
      }) => {
        return {
          url: `/private/walletNetWorth?chains=${chains}&evmAddress=${evmAddress}&excludePam=true&excludeUnverifiedContract=true`,
          method: 'get',
        }
      },
    }),
    getAllNetworkWalletTokens: builder.query({
      query: ({
        evmAddress,
      }) => {
        return {
          url: `/private/allNetworkWalletTokens?evmAddress=${evmAddress}&excludeSpam=true&excludeUnverifiedContract=true`,
          method: 'get',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetWalletHistoryQuery,
  useLazyGetNetWorthQuery,
  useLazyGetAllNetworkWalletTokensQuery,
} = postsApi
export default postsApi
