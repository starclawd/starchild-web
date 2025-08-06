import { chatApi } from './baseChat'
import { AgentDetailDataType, AGENT_TYPE, AGENT_STATUS, GENERATION_STATUS } from 'store/agentdetail/agentdetail'
import { AGENT_HUB_TYPE } from 'constants/agentHub'

// Mock data for default agents
const mockDefaultAgents: AgentDetailDataType[] = [
  {
    id: 1,
    task_id: 'agent-1',
    title: 'Overbought Signal Tracker',
    description: 'Be alerted when RSI hits overbought or oversold zones across major assets.',
    user_id: 'user-1',
    user_name: 'sage_porter',
    display_user_name: 'Sage Porter',
    subscription_user_count: 1394,
    user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    display_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    categories: [AGENT_HUB_TYPE.SIGNAL_SCANNER],
    image_url: 'https://placehold.co/200x200/1a1a1a/00ff00?text=Signal',
    tags: 'RSI,Overbought,Technical',
    trigger_history: [
      {
        message: 'agent1 RSI is overbought',
        trigger_time: Date.now(),
      },
    ],
    task_type: AGENT_TYPE.AI_TASK,
    check_log: [],
    code: '',
    trigger_time: 0,
    status: AGENT_STATUS.RUNNING,
    created_at: Date.now(),
    updated_at: Date.now(),
    interval: 3600,
    last_checked_at: Date.now(),
    trigger_type: 'condition',
    condition_mode: 'all',
    tokens: '',
    code_description: '',
    generation_msg: '',
    generation_status: GENERATION_STATUS.SUCCESS,
    workflow: '',
  },
  {
    id: 2,
    task_id: 'agent-2',
    title: 'Volatility Spike Detector',
    description: 'Identify Bollinger band breakouts and sharp price moves in real-time.',
    user_id: 'user-2',
    user_name: 'cassian_trent',
    display_user_name: 'Cassian Trent',
    subscription_user_count: 194,
    user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cassian',
    display_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cassian',
    categories: [AGENT_HUB_TYPE.INDICATOR],
    image_url: 'https://placehold.co/200x200/1a1a1a/ff9900?text=Volatility',
    tags: 'Bollinger,Volatility,Technical',
    trigger_history: [
      {
        message: 'agent2 RSI is overbought',
        trigger_time: Date.now(),
      },
    ],
    task_type: AGENT_TYPE.AI_TASK,
    check_log: [],
    code: '',
    trigger_time: 0,
    status: AGENT_STATUS.RUNNING,
    created_at: Date.now(),
    updated_at: Date.now(),
    interval: 3600,
    last_checked_at: Date.now(),
    trigger_type: 'condition',
    condition_mode: 'all',
    tokens: '',
    code_description: '',
    generation_msg: '',
    generation_status: GENERATION_STATUS.SUCCESS,
    workflow: '',
  },
  {
    id: 3,
    task_id: 'agent-3',
    title: 'RSI Strategy Signal',
    description: 'Generate entry and exit signals using RSI-based trading strategies.',
    user_id: 'user-3',
    user_name: 'astra_wells',
    display_user_name: 'Astra Wells',
    subscription_user_count: 24,
    user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Astra',
    display_user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Astra',
    categories: [AGENT_HUB_TYPE.STRATEGY],
    image_url: 'https://placehold.co/200x200/1a1a1a/0099ff?text=Strategy',
    tags: 'RSI,Strategy,Entry/Exit',
    trigger_history: [
      {
        message: 'agent3 RSI is overbought',
        trigger_time: Date.now(),
      },
    ],
    task_type: AGENT_TYPE.AI_TASK,
    check_log: [],
    code: '',
    trigger_time: 0,
    status: AGENT_STATUS.RUNNING,
    created_at: Date.now(),
    updated_at: Date.now(),
    interval: 3600,
    last_checked_at: Date.now(),
    trigger_type: 'condition',
    condition_mode: 'all',
    tokens: '',
    code_description: '',
    generation_msg: '',
    generation_status: GENERATION_STATUS.SUCCESS,
    workflow: '',
  },
]

const myAgentApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取agents推荐列表
    getAgentsRecommendList: builder.query<AgentDetailDataType[], void>({
      // TODO: Replace with real API endpoint when URL is finalized
      // Using queryFn instead of query to simulate API delay
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { data: mockDefaultAgents }
      },
    }),
    // 获取agents推荐列表
    getMyAgentsOverviewList: builder.query<AgentDetailDataType[], void>({
      // TODO: Replace with real API endpoint when URL is finalized
      // Using queryFn instead of query to simulate API delay
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { data: [...mockDefaultAgents, ...mockDefaultAgents, ...mockDefaultAgents] }
      },
    }),
    // // 获取myAgentsOverview列表
    // getMyAgentsOverviewList: builder.query<any, void>({
    //   query: () => {
    //     return {
    //       url: `/agents/overview`,
    //       method: 'GET',
    //     }
    //   },
    // }),
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
