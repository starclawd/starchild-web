import { baseApi } from './baseStarchild'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => {
        return {
          url: '/private/accountInfo',
          method: 'get',
        }
      },
    }),
    getAuthToken: builder.query({
      query: (data) => {
        return {
          url: '/authTGToken',
          method: 'post',
          body: data,
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyGetUserInfoQuery, useLazyGetAuthTokenQuery } = postsApi
export default postsApi
