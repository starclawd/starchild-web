import { chatApi } from './baseChat'
import type { PaginationParams } from 'hooks/usePagination'

const insightApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取系统信号概览列表 - 分页版本
    getSystemSignalOverviewListPaginated: builder.query<any, { params: PaginationParams }>({
      query: ({ params }) => {
        const { page, pageSize } = params
        // Build query parameters
        const queryParams = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
          all_agents: 'true',
          user_id: '',
        })

        return {
          url: `/agent_trigger_history?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),

    getSystemSignalAgents: builder.query<any, void>({
      query: () => {
        const queryParams = new URLSearchParams({
          page: '1',
          page_size: '1000',
        })

        return {
          url: `/triggered_agents?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),

    getLiveChat: builder.query<any, void>({
      query: () => {
        return {
          url: `/live_chat_contents`,
          method: 'GET',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetSystemSignalOverviewListPaginatedQuery,
  useLazyGetSystemSignalOverviewListPaginatedQuery,
  useGetSystemSignalAgentsQuery,
  useLazyGetSystemSignalAgentsQuery,
  useLazyGetLiveChatQuery,
} = insightApi

export default insightApi
