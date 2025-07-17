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
    getAgentMarketplaceList: builder.query<any, { searchStr?: string }>({
      query: ({ searchStr }) => {
        if (searchStr) {
          const queryParams = new URLSearchParams({
            keyword: searchStr || '',
          })

          return {
            url: `/search_agents?${queryParams.toString()}`,
            method: 'GET',
          }
        }

        return {
          url: `/agent_marketplace`,
          method: 'GET',
        }
      },
    }),

    subscribeAgent: builder.query<any, { agentId: string; userId: string }>({
      query: ({ agentId, userId }) => {
        const formData = new URLSearchParams()
        formData.append('user_id', userId)
        formData.append('task_ids', JSON.stringify([agentId]))
        console.log('formData', formData, agentId, userId)

        return {
          url: '/subscribe_agents',
          method: 'POST',
          body: formData,
        }
      },
    }),

    unsubscribeAgent: builder.query<any, { agentId: string; userId: string }>({
      query: ({ agentId, userId }) => {
        const formData = new URLSearchParams()
        formData.append('user_id', userId)
        formData.append('task_ids', JSON.stringify([agentId]))
        console.log('formData', formData, agentId, userId)

        return {
          url: '/unsubscribe_agents',
          method: 'POST',
          body: formData,
        }
      },
    }),

    getSubscribedAgents: builder.query<any, { userId: string }>({
      query: ({ userId }) => {
        const queryParams = new URLSearchParams({
          page: '1',
          page_size: '1000',
          user_id: userId,
        })

        return {
          url: `/subscribed_agents?${queryParams.toString()}`,
          method: 'GET',
        }
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
  useSubscribeAgentQuery,
  useLazySubscribeAgentQuery,
  useUnsubscribeAgentQuery,
  useLazyUnsubscribeAgentQuery,
  useGetSubscribedAgentsQuery,
  useLazyGetSubscribedAgentsQuery,
} = agentHubApi

export default agentHubApi
