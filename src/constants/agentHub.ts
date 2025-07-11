import { IndicatorAgent } from 'pages/AgentHub/components/IndicatorHubSection'
import { AgentCategory } from 'store/agenthub/agenthub'

export enum AGENT_HUB_TYPE {
  INDICATOR = 'indicator',
  STRATEGY = 'strategy',
  SIGNAL_SCANNER = 'signal-scanner',
  KOL_RADAR = 'kol-radar',
  AUTO_BRIEFING = 'auto-briefing',
  MARKET_PULSE = 'market-pulse',
  TOKEN_DEEP_DIVE = 'token-deep-dive',
}

export const DISCOVER_AGENTS: AgentCategory = {
  id: 'discover-agents',
  titleKey: 'Discover agents',
  descriptionKey: '',
  hasCustomComponent: false,
  icon: 'icon-agent',
}

export const INDICATOR_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.INDICATOR,
  titleKey: 'Indicator hub',
  descriptionKey: 'Track key metrics. Stay ahead of the trend',
  hasCustomComponent: true,
  icon: 'icon-chat-thinking',
}

export const STRATEGY_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.STRATEGY,
  titleKey: 'Strategy lab',
  descriptionKey: 'Build, test, and refine your trading edge',
  hasCustomComponent: false,
  icon: 'icon-backtest',
}

export const SIGNAL_SCANNER: AgentCategory = {
  id: AGENT_HUB_TYPE.SIGNAL_SCANNER,
  titleKey: 'Signal scanner',
  descriptionKey: 'Scan the market. Spot real-time opportunities',
  hasCustomComponent: true,
  icon: 'icon-task',
}

export const KOL_RADAR: AgentCategory = {
  id: AGENT_HUB_TYPE.KOL_RADAR,
  titleKey: 'KOL radar',
  descriptionKey: 'Follow top voices. Act on expert insights',
  hasCustomComponent: false,
  icon: 'icon-portfolio',
}

export const AUTO_BRIEFING: AgentCategory = {
  id: AGENT_HUB_TYPE.AUTO_BRIEFING,
  titleKey: 'Auto briefing',
  descriptionKey: 'Your daily market intel. Fully automated',
  hasCustomComponent: false,
  icon: 'icon-leaderboard',
}

export const MARKET_PULSE: AgentCategory = {
  id: AGENT_HUB_TYPE.MARKET_PULSE,
  titleKey: 'Market pulse',
  descriptionKey: 'Live sentiment. Real-time momentum',
  hasCustomComponent: false,
  icon: 'icon-marketplace',
}

export const TOKEN_DEEP_DIVE: AgentCategory = {
  id: AGENT_HUB_TYPE.TOKEN_DEEP_DIVE,
  titleKey: 'Token deep dive',
  descriptionKey: 'Uncover the fundamentals behind the tokens',
  hasCustomComponent: false,
  icon: 'icon-chat-other',
}

export const AGENT_CATEGORIES: AgentCategory[] = [
  INDICATOR_HUB,
  STRATEGY_HUB,
  SIGNAL_SCANNER,
  KOL_RADAR,
  AUTO_BRIEFING,
  MARKET_PULSE,
  TOKEN_DEEP_DIVE,
]

// 模拟 IndicatorHub 数据
export const mockIndicatorAgents: IndicatorAgent[] = [
  {
    id: '1',
    title: 'Overbought Signal Tracker',
    description: 'Be alerted when RSI hits overbought or oversold zones across major assets.',
    creator: 'Sage Porter',
    subscriberCount: 1394,
    wins: 94,
    apr: '+8,400%',
    tokens: ['SOL', 'ETH', 'BTC'],
    subscribed: false,
  },
  {
    id: '2',
    title: 'Volatility Spike Detector',
    description: 'Identify Bollinger Band breakouts and sharp price moves in real-time.',
    creator: 'Cassian Trent',
    subscriberCount: 194,
    wins: 83,
    apr: '+8,400%',
    tokens: ['ETH', 'BTC'],
    subscribed: false,
  },
  {
    id: '3',
    title: 'RSI Strategy Signal',
    description: 'Generate entry and exit signals using RSI-based trading strategies.',
    creator: 'Astra Wells',
    subscriberCount: 24,
    wins: 77,
    apr: '+400%',
    tokens: ['BTC'],
    subscribed: true,
  },
  {
    id: '4',
    title: 'RSI Strategy Signal RSI Strategy Signal RSI Strategy Signal RSI Strategy Signal RSI Strategy Signal',
    description:
      'Generate entry and exit signals using RSI-based trading strategies. Generate entry and exit signals using RSI-based trading strategies.',
    creator: 'Astra Wells2',
    subscriberCount: 242,
    wins: 58,
    apr: '+300%',
    tokens: ['SOL'],
    subscribed: false,
  },
]
