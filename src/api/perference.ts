import { chatApi } from './baseChat'

const postsApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreference: builder.query({
      query: () => {
        return {
          url: `/user_settings?user_id=`,
          method: 'get',
        }
      },
    }),
    updatePreference: builder.query({
      query: ({
        timezone,
        tradingExperience,
        aiExperience,
        watchlist,
        personalProfile,
      }: {
        timezone: string
        tradingExperience: string
        aiExperience: string
        watchlist: string
        personalProfile: string
      }) => {
        return {
          url: `/v1/user_settings`,
          method: 'put',
          body: {
            user_id: '',
            timezone,
            agent_level: aiExperience,
            trading_level: tradingExperience,
            token_list: watchlist,
            long_term_memory: personalProfile,
          },
        }
      },
    }),

    changeNickname: builder.query({
      query: ({ nickname }: { nickname: string }) => {
        return {
          url: `/v1/user_settings`,
          method: 'put',
          body: {
            user_name: nickname,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyGetPreferenceQuery, useLazyUpdatePreferenceQuery, useLazyChangeNicknameQuery } = postsApi
export default postsApi
