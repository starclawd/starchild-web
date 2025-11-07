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
          user_id: '',
        })

        return {
          url: `/agent_trigger_history?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetSystemSignalOverviewListPaginatedQuery, useLazyGetSystemSignalOverviewListPaginatedQuery } =
  insightApi

export default insightApi
