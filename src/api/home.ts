import { baseApi } from './baseStarchild'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCandidateStatus: builder.query({
      query: ({ account }) => {
        return {
          url: `/private/candidateStatus?account=${account}`,
          method: 'get',
        }
      },
    }),
    mintNft: builder.query({
      query: ({ account, message, signature }) => {
        return {
          url: `/private/nftMint`,
          method: 'post',
          body: {
            account,
            message,
            signature,
          },
        }
      },
    }),
    bindNft: builder.query({
      query: ({ account, message, signature }) => {
        return {
          url: `/private/burnNFT`,
          method: 'post',
          body: {
            account,
            message,
            signature,
          },
        }
      },
    }),
    collectWhitelist: builder.query({
      query: ({ account, telegramUserName }) => {
        return {
          url: '/private/candidates',
          method: 'post',
          body: {
            account,
            telegramUserName,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetCandidateStatusQuery,
  useLazyMintNftQuery,
  useLazyBindNftQuery,
  useLazyCollectWhitelistQuery,
} = postsApi
export default postsApi
