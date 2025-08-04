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
    changeLanguage: builder.mutation({
      query: (language: string) => {
        return {
          url: '/private/user/language',
          method: 'put',
          body: { language },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyGetUserInfoQuery, useLazyGetAuthTokenQuery, useChangeLanguageMutation } = postsApi
export default postsApi
