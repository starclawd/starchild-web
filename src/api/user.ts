import { WalletLoginParams } from 'store/login/hooks/useWalletLogin'
import { baseApi } from './baseStarchild'

// 头像上传相关类型定义
export interface AvatarPresignRequest {
  contentType: string
  fileSize: number
}

export interface AvatarPresignResponse {
  signedUrl: string
  publicUrl: string
  expiresAt: string
}

export interface AvatarConfirmRequest {
  avatarUrl: string
}

export interface AvatarConfirmResponse {
  avatarUrl: string
}

export interface DeleteAvatarResponse {
  status: string
}

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
    // 获取头像上传签名 URL
    avatarPresign: builder.mutation<AvatarPresignResponse, AvatarPresignRequest>({
      query: (data) => ({
        url: '/private/user/avatar/presign',
        method: 'post',
        body: data,
      }),
    }),
    // 确认头像上传完成
    avatarConfirm: builder.mutation<AvatarConfirmResponse, AvatarConfirmRequest>({
      query: (data) => ({
        url: '/private/user/avatar/confirm',
        method: 'post',
        body: data,
      }),
    }),
    // 删除头像
    deleteAvatar: builder.mutation<DeleteAvatarResponse, void>({
      query: () => ({
        url: '/private/user/avatar',
        method: 'delete',
      }),
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
  useAvatarPresignMutation,
  useAvatarConfirmMutation,
  useDeleteAvatarMutation,
} = postsApi
export default postsApi
