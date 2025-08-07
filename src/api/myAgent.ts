import { chatApi } from './baseChat'
import { AgentDetailDataType, AGENT_TYPE, AGENT_STATUS, GENERATION_STATUS } from 'store/agentdetail/agentdetail'
import { AGENT_HUB_TYPE } from 'constants/agentHub'

// Mock data for default agents
const mockDefaultAgents: AgentDetailDataType[] = [
  {
    id: 293,
    task_id: 'cf74949b-dbb6-42a6-b025-f28acfba95eb',
    title: '回测WOO代币的量化交易策略',
    description: '回测过去一年WOO代币的量化交易策略，包含具体的进出场规则',
    user_id: '5386184059',
    user_name: 'jojo_0xJotaro',
    display_user_name: '',
    subscription_user_count: 1,
    user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    display_user_avatar: '',
    categories: [AGENT_HUB_TYPE.SIGNAL_SCANNER],
    image_url: 'https://storage.googleapis.com/holomind-img-holomind-2025/1754450554_tmp_g01hkcx.png_compressed.jpg',
    tags: 'Custom Backtest',
    trigger_history: [
      {
        message:
          '*WOO Token Backtest Results: 1-Year Quantitative Strategy*\n\n📊 *Overall Performance*\n- *Trading period*: 2024-08-07 ~ 2025-08-06 (369 days)\n- *Trades executed*: 58 (29 buy/sell pairs)\n- *Total return*: -2.01% (*final equity*: $9,799.24 from $10,000)\n- *Annualized return*: -1.99%\n- *Sharpe ratio*: -1.68\n- *Maximum drawdown*: 2.74% ($273.96)\n- *Profit factor*: 0.68\n- *Average winning trade*: $36.06, *average losing trade*: $37.26\n- *Win rate*: 41.4% (12 winners)\n- *Avg trades per day*: 0.16\n\n⚙️ *Strategy Breakdown*\n- *Entry*: Go long when EMA-10 crosses above EMA-50 or EMA-10 > EMA-50, price breaks above previous high (0.5%) or near upper Bollinger Band, with 5-min volume ≥ 1.2× 20-bar average.\n- *Exit*: +2% take profit, -1% stop loss, ATR(14)×1.2 trailing stop, EMA death cross, max 30-day hold, or mean reversion to BB middle.\n- *Position size*: 7.5% of equity per trade\n- *Max account drawdown*: 12%\n\n📈 *Performance Analysis*\n- The strategy triggered frequent trades, but overall market conditions for WOO token led to slightly negative returns. Most losses were kept small due to *risk management* and *drawdown controls*. The win rate and profit factor suggest the setup was moderately effective but struggled in a choppy or downtrending environment.\n\n🛡️ *Risk & Suggestions*\n- *Drawdowns* remained controlled, never breaching the 12% cap.\n- *Improvements*: Consider optimizing entry thresholds, increasing position selectivity, or combining with trend filters to reduce losses in sideways markets.\n- *Backtest limitations*: Results are based on historical, simulated data. Real trading may differ due to slippage, liquidity, and order execution.\n\nFor more details, copy this summary: `WOO Token EMA-10/50 BB strategy: 58 trades, -2.01% 1y return, win rate 41.4%, Sharpe -1.68, max DD 2.74%`',
        trigger_time: Date.now(),
      },
    ],
    task_type: AGENT_TYPE.BACKTEST_TASK,
    check_log: [],
    code: '',
    trigger_time: 0,
    status: AGENT_STATUS.COMPLETED,
    created_at: Date.now(),
    updated_at: Date.now(),
    interval: 3600,
    last_checked_at: Date.now(),
    trigger_type: 'condition',
    condition_mode: 'all',
    tokens: 'WOO',
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
        message:
          '*📊 PUMP Token Dip-Buying Backtest Results (2025-07-14 ~ 2025-08-06)*\n\n*Strategy*: Buy when price dips 5% below $0.003260, sell at a 10% gain. *1 trade executed over 24 days*.\n\n*Performance Summary:*\n- *Total Return*: `1.03%` (final value: $10,102.83 from $10,000)\n- *Annualized Return*: 16.85%\n- *Sharpe Ratio*: 0.72 (moderate risk-adjusted return)\n- *Max Drawdown*: 4.15% ($414.79)\n- *Run-up*: $517.63 (5.40%)\n- *Profit Factor*: 0.00 (no closed winning trade)\n- *Win Rate*: 0.0% (no realized sell at target)\n- *Trades Per Day*: 0.0417\n\n*Trade Details:*\n- *Buy*: 2025-07-24, price: $0.003081, qty: 649,039.41 PUMP\n- *No sell triggered yet (price has not reached 10% gain)*\n\n*Funding Trend*: Portfolio dipped to a low of $9,585.21 but recovered to $10,102.83 by period end.\n\n*Analysis & Insights:*\n- The strategy entered a single position as PUMP dipped below entry criteria, but the 10% profit target was not achieved within the backtest window, resulting in no realized win.\n- *Volatility*: Several swings in portfolio value, but overall risk was contained with a moderate drawdown.\n- *Context*: This performance is highly sensitive to short-term price action and may differ in future periods. \n\n*Backtest Parameters Strictly Followed*: All timestamps are in seconds; fallback CoinGecko IDs ensured robust data retrieval. \n\n*Reminder*: Results are for historical simulation only. Real market performance may differ due to slippage, liquidity, and execution risks.',
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
        message:
          '*📊 PUMP Token Dip-Buying Backtest Results (2025-07-14 ~ 2025-08-06)*\n\n*Strategy*: Buy when price dips 5% below $0.003260, sell at a 10% gain. *1 trade executed over 24 days*.\n\n*Performance Summary:*\n- *Total Return*: `1.03%` (final value: $10,102.83 from $10,000)\n- *Annualized Return*: 16.85%\n- *Sharpe Ratio*: 0.72 (moderate risk-adjusted return)\n- *Max Drawdown*: 4.15% ($414.79)\n- *Run-up*: $517.63 (5.40%)\n- *Profit Factor*: 0.00 (no closed winning trade)\n- *Win Rate*: 0.0% (no realized sell at target)\n- *Trades Per Day*: 0.0417\n\n*Trade Details:*\n- *Buy*: 2025-07-24, price: $0.003081, qty: 649,039.41 PUMP\n- *No sell triggered yet (price has not reached 10% gain)*\n\n*Funding Trend*: Portfolio dipped to a low of $9,585.21 but recovered to $10,102.83 by period end.\n\n*Analysis & Insights:*\n- The strategy entered a single position as PUMP dipped below entry criteria, but the 10% profit target was not achieved within the backtest window, resulting in no realized win.\n- *Volatility*: Several swings in portfolio value, but overall risk was contained with a moderate drawdown.\n- *Context*: This performance is highly sensitive to short-term price action and may differ in future periods. \n\n*Backtest Parameters Strictly Followed*: All timestamps are in seconds; fallback CoinGecko IDs ensured robust data retrieval. \n\n*Reminder*: Results are for historical simulation only. Real market performance may differ due to slippage, liquidity, and execution risks.',
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
    id: 294,
    task_id: 'cf74949b-dbb6-42a6-b025-f28acfba95ec',
    title: '回测WOO代币的量化交易策略',
    description: '回测过去一年WOO代币的量化交易策略，包含具体的进出场规则',
    user_id: '5386184059',
    user_name: 'jojo_0xJotaro',
    display_user_name: '',
    subscription_user_count: 1,
    user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
    display_user_avatar: '',
    categories: [AGENT_HUB_TYPE.SIGNAL_SCANNER],
    image_url: 'https://storage.googleapis.com/holomind-img-holomind-2025/1754450554_tmp_g01hkcx.png_compressed.jpg',
    tags: 'Custom Backtest',
    trigger_history: [
      {
        message:
          '*WOO Token Backtest Results: 1-Year Quantitative Strategy*\n\n📊 *Overall Performance*\n- *Trading period*: 2024-08-07 ~ 2025-08-06 (369 days)\n- *Trades executed*: 58 (29 buy/sell pairs)\n- *Total return*: -2.01% (*final equity*: $9,799.24 from $10,000)\n- *Annualized return*: -1.99%\n- *Sharpe ratio*: -1.68\n- *Maximum drawdown*: 2.74% ($273.96)\n- *Profit factor*: 0.68\n- *Average winning trade*: $36.06, *average losing trade*: $37.26\n- *Win rate*: 41.4% (12 winners)\n- *Avg trades per day*: 0.16\n\n⚙️ *Strategy Breakdown*\n- *Entry*: Go long when EMA-10 crosses above EMA-50 or EMA-10 > EMA-50, price breaks above previous high (0.5%) or near upper Bollinger Band, with 5-min volume ≥ 1.2× 20-bar average.\n- *Exit*: +2% take profit, -1% stop loss, ATR(14)×1.2 trailing stop, EMA death cross, max 30-day hold, or mean reversion to BB middle.\n- *Position size*: 7.5% of equity per trade\n- *Max account drawdown*: 12%\n\n📈 *Performance Analysis*\n- The strategy triggered frequent trades, but overall market conditions for WOO token led to slightly negative returns. Most losses were kept small due to *risk management* and *drawdown controls*. The win rate and profit factor suggest the setup was moderately effective but struggled in a choppy or downtrending environment.\n\n🛡️ *Risk & Suggestions*\n- *Drawdowns* remained controlled, never breaching the 12% cap.\n- *Improvements*: Consider optimizing entry thresholds, increasing position selectivity, or combining with trend filters to reduce losses in sideways markets.\n- *Backtest limitations*: Results are based on historical, simulated data. Real trading may differ due to slippage, liquidity, and order execution.\n\nFor more details, copy this summary: `WOO Token EMA-10/50 BB strategy: 58 trades, -2.01% 1y return, win rate 41.4%, Sharpe -1.68, max DD 2.74%`',
        trigger_time: Date.now(),
      },
    ],
    task_type: AGENT_TYPE.BACKTEST_TASK,
    check_log: [],
    code: '',
    trigger_time: 0,
    status: AGENT_STATUS.COMPLETED,
    created_at: Date.now(),
    updated_at: Date.now(),
    interval: 3600,
    last_checked_at: Date.now(),
    trigger_type: 'condition',
    condition_mode: 'all',
    tokens: 'WOO',
    code_description: '',
    generation_msg: '',
    generation_status: GENERATION_STATUS.SUCCESS,
    workflow: '',
  },
  {
    id: 5,
    task_id: 'agent-5',
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
        message:
          '*📊 PUMP Token Dip-Buying Backtest Results (2025-07-14 ~ 2025-08-06)*\n\n*Strategy*: Buy when price dips 5% below $0.003260, sell at a 10% gain. *1 trade executed over 24 days*.\n\n*Performance Summary:*\n- *Total Return*: `1.03%` (final value: $10,102.83 from $10,000)\n- *Annualized Return*: 16.85%\n- *Sharpe Ratio*: 0.72 (moderate risk-adjusted return)\n- *Max Drawdown*: 4.15% ($414.79)\n- *Run-up*: $517.63 (5.40%)\n- *Profit Factor*: 0.00 (no closed winning trade)\n- *Win Rate*: 0.0% (no realized sell at target)\n- *Trades Per Day*: 0.0417\n\n*Trade Details:*\n- *Buy*: 2025-07-24, price: $0.003081, qty: 649,039.41 PUMP\n- *No sell triggered yet (price has not reached 10% gain)*\n\n*Funding Trend*: Portfolio dipped to a low of $9,585.21 but recovered to $10,102.83 by period end.\n\n*Analysis & Insights:*\n- The strategy entered a single position as PUMP dipped below entry criteria, but the 10% profit target was not achieved within the backtest window, resulting in no realized win.\n- *Volatility*: Several swings in portfolio value, but overall risk was contained with a moderate drawdown.\n- *Context*: This performance is highly sensitive to short-term price action and may differ in future periods. \n\n*Backtest Parameters Strictly Followed*: All timestamps are in seconds; fallback CoinGecko IDs ensured robust data retrieval. \n\n*Reminder*: Results are for historical simulation only. Real market performance may differ due to slippage, liquidity, and execution risks.',
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
    id: 6,
    task_id: 'agent-6',
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
        message:
          '*📊 PUMP Token Dip-Buying Backtest Results (2025-07-14 ~ 2025-08-06)*\n\n*Strategy*: Buy when price dips 5% below $0.003260, sell at a 10% gain. *1 trade executed over 24 days*.\n\n*Performance Summary:*\n- *Total Return*: `1.03%` (final value: $10,102.83 from $10,000)\n- *Annualized Return*: 16.85%\n- *Sharpe Ratio*: 0.72 (moderate risk-adjusted return)\n- *Max Drawdown*: 4.15% ($414.79)\n- *Run-up*: $517.63 (5.40%)\n- *Profit Factor*: 0.00 (no closed winning trade)\n- *Win Rate*: 0.0% (no realized sell at target)\n- *Trades Per Day*: 0.0417\n\n*Trade Details:*\n- *Buy*: 2025-07-24, price: $0.003081, qty: 649,039.41 PUMP\n- *No sell triggered yet (price has not reached 10% gain)*\n\n*Funding Trend*: Portfolio dipped to a low of $9,585.21 but recovered to $10,102.83 by period end.\n\n*Analysis & Insights:*\n- The strategy entered a single position as PUMP dipped below entry criteria, but the 10% profit target was not achieved within the backtest window, resulting in no realized win.\n- *Volatility*: Several swings in portfolio value, but overall risk was contained with a moderate drawdown.\n- *Context*: This performance is highly sensitive to short-term price action and may differ in future periods. \n\n*Backtest Parameters Strictly Followed*: All timestamps are in seconds; fallback CoinGecko IDs ensured robust data retrieval. \n\n*Reminder*: Results are for historical simulation only. Real market performance may differ due to slippage, liquidity, and execution risks.',
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
        return { data: mockDefaultAgents }
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
