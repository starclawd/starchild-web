import { baseApi } from './baseHolominds'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInsights: builder.query({
      query: ({
        pageIndex,
        pageSize,
      }) => {
        return {
          url: `/private/alertNotifications?page=${pageIndex}&pageSize=${pageSize}`,
          method: 'get',
        }
      },
    }),
    markAsRead: builder.query({
      query: ({
        isList,
      }) => {
        return {
          url: `/private/alertNotifications/markRead`,
          method: 'post',
          body: {
            notificationIds: isList,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetAllInsightsQuery,
  useLazyMarkAsReadQuery,
} = postsApi
export default postsApi
