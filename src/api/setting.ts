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
    getTaskList: builder.query({
      query: () => {
        return {
          url: `/private/tasks`,
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
  useLazyGetTaskListQuery,
} = postsApi
export default postsApi
