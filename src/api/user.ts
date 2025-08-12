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
    getAuthTokenApp: builder.query({
      query: (initData) => {
        return {
          url: '/authTGAppToken',
          method: 'post',
          body: {
            queryString: initData,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetUserInfoQuery,
  useLazyGetAuthTokenQuery,
  useChangeLanguageMutation,
  useLazyGetAuthTokenAppQuery,
} = postsApi
export default postsApi
