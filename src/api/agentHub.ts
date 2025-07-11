import { baseApi } from './baseHolominds'
import { AgentThreadInfoListResponse, AgentThreadInfoListParams } from 'store/agenthub/agenthub'
import { generateAndFilterMockData } from './agentHub.mockData'

const agentHubApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentHubThreadList: builder.query<AgentThreadInfoListResponse, AgentThreadInfoListParams>({
      async queryFn(params) {
        const { page = 1, pageSize = 20, filterString, filterType } = params

        // Total available items (for testing load more)
        const totalCount = 36

        // Generate and filter mock data
        const result = generateAndFilterMockData(page, pageSize, totalCount, filterString, filterType)

        // delay 1 second to simulate
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return {
          data: {
            data: result.data,
            total: result.total,
            page,
            pageSize,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useGetAgentHubThreadListQuery, useLazyGetAgentHubThreadListQuery } = agentHubApi

export default agentHubApi
