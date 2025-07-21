import { baseApi } from './baseStarchild'

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
          },
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
    closeTask: builder.query({
      query: ({ id }) => {
        return {
          url: `/private/tasks/${id}`,
          method: 'put',
        }
      },
    }),
    deleteTask: builder.query({
      query: ({ id }) => {
        return {
          url: `/private/tasks/${id}`,
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
  useLazyGetTaskListQuery,
  useLazyCloseTaskQuery,
  useLazyDeleteTaskQuery,
} = postsApi
export default postsApi
