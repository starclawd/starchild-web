import { tradeAiApi } from './baseTradeAi'
import { AgentInfoListResponse, AgentInfoListParams } from 'store/agenthub/agenthub'
import { generateAndFilterMockData, mockSubscribeToggle } from './agentHub.mockData'

const agentHubApi = tradeAiApi.injectEndpoints({
  endpoints: (builder) => ({
    // TODO: 等接口稳定后，移除mock数据
    // getAgentHubList: builder.query<AgentThreadInfoListResponse, AgentThreadInfoListParams>({
    //   async queryFn(params) {
    //     const { page = 1, pageSize = 20, filterString, filterType } = params

    //     // Total available items (for testing load more)
    //     const totalCount = 36

    //     // Generate and filter mock data
    //     const result = generateAndFilterMockData(page, pageSize, totalCount, filterString, filterType)

    //     // delay 1 second to simulate
    //     await new Promise((resolve) => setTimeout(resolve, 2000))

    //     return {
    //       data: {
    //         data: result.data,
    //         total: result.total,
    //         page,
    //         pageSize,
    //       },
    //     }
    //   },
    // }),
    getAgentHubList: builder.query<any, AgentInfoListParams>({
      query: (params) => {
        const { page = 1, pageSize = 20, filterString, filterType } = params

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
        })

        if (filterType) {
          queryParams.append('category', filterType)
        }

        if (filterString) {
          queryParams.append('filter', filterString)
        }

        return {
          url: `/agents?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),
    getAgentMarketplaceList: builder.query<any, void>({
      query: () => ({
        url: '/agent_marketplace',
        method: 'GET',
      }),
    }),

    toggleSubscribe: builder.mutation<{ success: boolean }, { agentId: string; currentSubscribed: boolean }>({
      async queryFn({ agentId, currentSubscribed }) {
        const result = await mockSubscribeToggle(agentId, currentSubscribed)
        return { data: { success: result.success } }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAgentHubListQuery,
  useLazyGetAgentHubListQuery,
  useGetAgentMarketplaceListQuery,
  useLazyGetAgentMarketplaceListQuery,
  useToggleSubscribeMutation,
} = agentHubApi

export default agentHubApi
