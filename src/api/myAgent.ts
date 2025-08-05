import { chatApi } from './baseChat'

const myAgentApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取agents推荐列表
    getAgentsRecommendList: builder.query<any, void>({
      query: () => {
        return {
          url: `/agents/recommend`,
          method: 'GET',
        }
      },
    }),

    // 获取myAgentsOverview列表
    getMyAgentsOverviewList: builder.query<any, void>({
      query: () => {
        return {
          url: `/my-agents/overview`,
          method: 'GET',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAgentsRecommendListQuery,
  useLazyGetAgentsRecommendListQuery,
  useGetMyAgentsOverviewListQuery,
  useLazyGetMyAgentsOverviewListQuery,
} = myAgentApi

export default myAgentApi
