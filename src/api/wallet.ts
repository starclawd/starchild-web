import { baseApi } from './baseHolominds'
export const OPEN_AI_KEY = ''

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletHistory: builder.query({
      query: ({
        chain,
        evmAddress,
        limit,
      }) => {
        return {
          url: `/private/walletHistory?chain=${chain}&evmAddress=${evmAddress}&limit=${limit}&includeInternalTransactions=true`,
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
  }),
  overrideExisting: false,
})

export const {
  useLazyGetWalletHistoryQuery,
  useLazyGetNetWorthQuery,
} = postsApi
export default postsApi
