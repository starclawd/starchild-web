import { chatApi } from './baseChat'
import type { PaginationParams } from 'hooks/usePagination'

const myAgentApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取agents推荐列表
    getAgentsRecommendList: builder.query<any, void>({
      query: () => {
        return {
          url: `/recommend_agents`,
          method: 'GET',
        }
      },
    }),
    // 获取myAgentsOverview列表 - 分页版本
    getMyAgentsOverviewListPaginated: builder.query<any, { params: PaginationParams; telegramUserId: string }>({
      query: ({ params, telegramUserId }) => {
        const { page, pageSize } = params
        // Build query parameters
        const queryParams = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
          user_id: telegramUserId,
        })

        return {
          url: `/agent_trigger_history?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),
    // 删除MyAgent - Mock实现
    deleteMyAgent: builder.mutation<any, { agentId: number; telegramUserId: string }>({
      query: ({ agentId, telegramUserId }) => {
        const queryParams = new URLSearchParams({
          task_id: String(agentId),
          user_id: telegramUserId,
        })

        return {
          url: `/agent?${queryParams.toString()}`,
          method: 'DELETE',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAgentsRecommendListQuery,
  useLazyGetAgentsRecommendListQuery,
  useGetMyAgentsOverviewListPaginatedQuery,
  useLazyGetMyAgentsOverviewListPaginatedQuery,
  useDeleteMyAgentMutation,
} = myAgentApi

// 类型定义已从 hooks/usePagination 导入

export default myAgentApi
