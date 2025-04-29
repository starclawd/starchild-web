import { baseApi } from './baseHolominds'

const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllInsights: builder.query({
      query: () => {
        return {
          url: `/`,
          method: 'get',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyGetAllInsightsQuery,
} = postsApi
export default postsApi
