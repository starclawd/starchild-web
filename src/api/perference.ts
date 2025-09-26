import { chatApi } from './baseChat'

const postsApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreference: builder.query({
      query: ({ account }: { account: string }) => {
        return {
          url: `/user_settings?user_id=${account}`,
          method: 'get',
        }
      },
    }),
    updatePreference: builder.query({
      query: ({
        account,
        timezone,
        tradingExperience,
        aiExperience,
        watchlist,
        personalProfile,
        addresses,
      }: {
        account: string
        timezone: string
        tradingExperience: string
        aiExperience: string
        watchlist: string
        personalProfile: string
        addresses: string[]
      }) => {
        return {
          url: `/v1/user_settings`,
          method: 'put',
          body: {
            user_id: account,
            timezone,
            agent_level: aiExperience,
            trading_level: tradingExperience,
            token_list: watchlist,
            long_term_memory: personalProfile,
            addresses,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyGetPreferenceQuery, useLazyUpdatePreferenceQuery } = postsApi
export default postsApi
