import { tradeAiApi } from './baseTradeAi'
import { AgentThreadInfoListResponse, AgentThreadInfoListParams } from 'store/agenthub/agenthub'
import { generateAndFilterMockData, mockSubscribeToggle } from './agentHub.mockData'

const agentHubApi = tradeAiApi.injectEndpoints({
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

    getAgentMarketplaceThreadList: builder.query<any, void>({
      query: () => ({
        url: '/agent_marketplace',
        method: 'GET',
      }),
    }),

    toggleSubscribe: builder.mutation<
      { success: boolean; subscribed: boolean },
      { threadId: string; currentSubscribed: boolean }
    >({
      async queryFn({ threadId, currentSubscribed }) {
        const result = await mockSubscribeToggle(threadId, currentSubscribed)
        return { data: result }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAgentHubThreadListQuery,
  useLazyGetAgentHubThreadListQuery,
  useGetAgentMarketplaceThreadListQuery,
  useLazyGetAgentMarketplaceThreadListQuery,
  useToggleSubscribeMutation,
} = agentHubApi

export default agentHubApi
