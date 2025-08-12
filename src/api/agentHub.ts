import { chatApi } from './baseChat'
import { AgentInfoListResponse, AgentInfoListParams } from 'store/agenthub/agenthub'

const agentHubApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    getAgentHubList: builder.query<any, AgentInfoListParams>({
      query: (params) => {
        const { page = 1, pageSize = 20, filterType, tag } = params

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
        })

        if (filterType) {
          queryParams.append('category', filterType)
        }

        if (tag) {
          queryParams.append('tag', tag)
        }

        return {
          url: `/agents?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),

    getAgentMarketplaceList: builder.query<any, void>({
      query: () => {
        return {
          url: `/agent_marketplace`,
          method: 'GET',
        }
      },
    }),

    searchAgents: builder.query<any, { searchStr: string; category?: string; tag?: string }>({
      query: ({ searchStr, category, tag }) => {
        const queryParams = new URLSearchParams({
          keyword: searchStr,
        })

        if (category) {
          queryParams.append('category', category)
        }

        if (tag) {
          queryParams.append('tag', tag)
        }

        return {
          url: `/search_agents?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),

    subscribeAgent: builder.query<any, { agentId: string; userId: string }>({
      query: ({ agentId, userId }) => {
        const formData = new URLSearchParams()
        formData.append('user_id', userId)
        formData.append('task_ids', JSON.stringify([agentId]))

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

    getKolsList: builder.query<any, AgentInfoListParams>({
      query: (params) => {
        const { page = 1, pageSize = 20, tag } = params

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
        })

        if (tag) {
          queryParams.append('tag', tag)
        }

        return {
          url: `/kols?${queryParams.toString()}`,
          method: 'GET',
        }
      },
    }),

    getTokensList: builder.query<any, AgentInfoListParams>({
      query: (params) => {
        const { page = 1, pageSize = 20, tag } = params

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: String(page),
          page_size: String(pageSize),
        })

        if (tag) {
          queryParams.append('tag', tag)
        }

        return {
          url: `/agent_tokens?${queryParams.toString()}`,
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
  useSearchAgentsQuery,
  useLazySearchAgentsQuery,
  useSubscribeAgentQuery,
  useLazySubscribeAgentQuery,
  useUnsubscribeAgentQuery,
  useLazyUnsubscribeAgentQuery,
  useGetSubscribedAgentsQuery,
  useLazyGetSubscribedAgentsQuery,
  useGetKolsListQuery,
  useLazyGetKolsListQuery,
  useGetTokensListQuery,
  useLazyGetTokensListQuery,
} = agentHubApi

export default agentHubApi
