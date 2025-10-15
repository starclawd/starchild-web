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
    // 编辑MyAgent
    editMyAgent: builder.mutation<any, { taskId: string; telegramUserId: string; description: string }>({
      query: ({ taskId, telegramUserId, description }) => {
        return {
          url: '/tasks/update',
          method: 'POST',
          body: {
            task_id: taskId,
            user_id: telegramUserId,
            description,
          },
        }
      },
    }),
    getTriggerHistory: builder.query({
      query: ({ taskId, pageSize, page }: { taskId: string; pageSize: number; page: number }) => {
        return {
          url: `/trigger_history?task_id=${taskId}&page_size=${pageSize}&page=${page}`,
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
  useGetMyAgentsOverviewListPaginatedQuery,
  useLazyGetMyAgentsOverviewListPaginatedQuery,
  useDeleteMyAgentMutation,
  useEditMyAgentMutation,
  useLazyGetTriggerHistoryQuery,
} = myAgentApi

// 类型定义已从 hooks/usePagination 导入

export default myAgentApi
