import { baseApi } from './baseHolominds'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWatchlist: builder.query({
      query: () => {
        return {
          url: `/private/favoriteTokens`,
          method: 'get',
        }
      },
    }),
    addWatchlist: builder.query({
      query: ({ symbol }) => {
        return {
          url: `/private/favoriteTokens`,
          method: 'post',
          body: {
            tokenSymbol: symbol,
          }
        }
      },
    }),
    deleteWatchlist: builder.query({
      query: ({ symbol }) => {
        return {
          url: `/private/favoriteTokens?tokenSymbol=${symbol}`,
          method: 'delete',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetWatchlistQuery,
  useLazyAddWatchlistQuery,
  useLazyDeleteWatchlistQuery,
} = postsApi
export default postsApi
