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
    getAuthTokenGoogle: builder.query({
      query: (googleToken: string) => {
        return {
          url: '/authGoogleToken',
          method: 'post',
          body: { googleToken },
        }
      },
    }),
    bindGoogle: builder.query({
      query: (googleToken: string) => {
        return {
          url: '/private/bindGoogleToken',
          method: 'post',
          body: { googleToken },
        }
      },
    }),
    bindTelegram: builder.query({
      query: (data) => {
        return {
          url: '/private/bindTelegram',
          method: 'post',
          body: data,
        }
      },
    }),
    walletLogin: builder.query({
      query: ({ address, signature, message }: { address: string; signature: string; message: string }) => {
        return {
          url: '/private/walletLogin',
          method: 'post',
          body: {
            address,
            signature,
            message,
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
  useLazyGetAuthTokenGoogleQuery,
  useLazyBindGoogleQuery,
  useLazyBindTelegramQuery,
  useLazyWalletLoginQuery,
} = postsApi
export default postsApi
