import { baseApi } from './baseHolominds'
export const OPEN_AI_KEY = ''

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletHistory: builder.query({
      query: ({
        chain,
        evmAddress,
        solanaAddress,
        limit,
      }) => {
        return {
          url: `/private/walletHistory?chain=${chain}&evmAddress=${evmAddress}&solanaAddress=${solanaAddress}&limit=${limit}&includeInternalTransactions=true`,
          method: 'get',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetWalletHistoryQuery,
} = postsApi
export default postsApi
