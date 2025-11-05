import { WalletLoginParams } from 'store/login/hooks/useWalletLogin'
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
          url: '/googleAuthToken',
          method: 'post',
          body: { accessToken: googleToken },
        }
      },
    }),
    bindGoogle: builder.query({
      query: (googleToken: string) => {
        return {
          url: '/private/bindGoogleAccount',
          method: 'post',
          body: { accessToken: googleToken },
        }
      },
    }),
    bindTelegram: builder.query({
      query: (data) => {
        return {
          url: '/private/bindTelegramUser',
          method: 'post',
          body: data,
        }
      },
    }),
    walletLogin: builder.query({
      query: ({ address, signature, message }: WalletLoginParams) => {
        return {
          url: '/authToken',
          method: 'post',
          body: {
            userAddress: address,
            signature,
            message,
          },
        }
      },
    }),
    bindWallet: builder.query({
      query: ({ address, signature, message, oldWalletAddress }: WalletLoginParams & { oldWalletAddress?: string }) => {
        return {
          url: '/private/bindWallet',
          method: 'post',
          body: {
            userAddress: address,
            signature,
            message,
            ...(oldWalletAddress && { oldWalletAddress }),
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
  useLazyBindWalletQuery,
} = postsApi
export default postsApi
