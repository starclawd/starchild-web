import { chatApi } from './baseChat'
import { AgentCardProps } from 'store/agenthub/agenthub'
import { AGENT_HUB_TYPE } from 'constants/agentHub'

// Mock data for default agents
const mockDefaultAgents: AgentCardProps[] = [
  {
    id: 1,
    agentId: 'agent-1',
    title: 'Overbought Signal Tracker',
    description: 'Be alerted when RSI hits overbought or oversold zones across major assets.',
    creator: 'Sage Porter',
    subscriberCount: 1394,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    types: [AGENT_HUB_TYPE.SIGNAL_SCANNER],
    agentImageUrl: 'https://placehold.co/200x200/1a1a1a/00ff00?text=Signal',
    stats: {
      wins: 78,
      apr: '12.5%',
      tokens: ['BTC', 'ETH', 'SOL'],
    },
    tags: ['RSI', 'Overbought', 'Technical'],
  },
  {
    id: 2,
    agentId: 'agent-2',
    title: 'Volatility Spike Detector',
    description: 'Identify Bollinger band breakouts and sharp price moves in real-time.',
    creator: 'Cassian Trent',
    subscriberCount: 194,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cassian',
    types: [AGENT_HUB_TYPE.INDICATOR],
    agentImageUrl: 'https://placehold.co/200x200/1a1a1a/ff9900?text=Volatility',
    stats: {
      wins: 65,
      apr: '18.3%',
      tokens: ['BTC', 'ETH'],
    },
    tags: ['Bollinger', 'Volatility', 'Technical'],
  },
  {
    id: 3,
    agentId: 'agent-3',
    title: 'RSI Strategy Signal',
    description: 'Generate entry and exit signals using RSI-based trading strategies.',
    creator: 'Astra Wells',
    subscriberCount: 24,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Astra',
    types: [AGENT_HUB_TYPE.STRATEGY],
    agentImageUrl: 'https://placehold.co/200x200/1a1a1a/0099ff?text=Strategy',
    stats: {
      wins: 45,
      apr: '8.7%',
      tokens: ['SOL', 'AVAX'],
    },
    tags: ['RSI', 'Strategy', 'Entry/Exit'],
  },
]

const myAgentApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取agents推荐列表
    getAgentsRecommendList: builder.query<AgentCardProps[], void>({
      // TODO: Replace with real API endpoint when URL is finalized
      // Using queryFn instead of query to simulate API delay
      queryFn: async () => {
        try {
          // Simulate API delay (2 seconds)
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Return mock data for development
          return { data: mockDefaultAgents }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: 'Failed to fetch agents' } }
        }
      },
    }),
    // 获取myAgentsOverview列表
    getMyAgentsOverviewList: builder.query<any, void>({
      query: () => {
        return {
          url: `/agents/overview`,
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
