import { AgentCategory, AgentThreadInfo } from 'store/agenthub/agenthub'

export enum AGENT_HUB_TYPE {
  INDICATOR = 'indicator',
  STRATEGY = 'strategy',
  SIGNAL_SCANNER = 'signal-scanner',
  KOL_RADAR = 'kol-radar',
  AUTO_BRIEFING = 'auto-briefing',
  MARKET_PULSE = 'market-pulse',
  TOKEN_DEEP_DIVE = 'token-deep-dive',
  OTHERS = 'others',
}

export const DISCOVER_AGENTS: AgentCategory = {
  id: 'discover-agents',
  titleKey: 'Discover agents',
  descriptionKey: '',
  hasCustomComponent: false,
  icon: 'icon-agent',
  maxDisplayCountOnMarketPlace: 6,
}

export const INDICATOR_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.INDICATOR,
  titleKey: 'Indicator hub',
  descriptionKey: 'Track key metrics. Stay ahead of the trend',
  hasCustomComponent: true,
  icon: 'icon-chat-thinking',
  maxDisplayCountOnMarketPlace: 6,
}

export const STRATEGY_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.STRATEGY,
  titleKey: 'Strategy lab',
  descriptionKey: 'Build, test, and refine your trading edge',
  hasCustomComponent: false,
  icon: 'icon-backtest',
  maxDisplayCountOnMarketPlace: 6,
}

export const SIGNAL_SCANNER: AgentCategory = {
  id: AGENT_HUB_TYPE.SIGNAL_SCANNER,
  titleKey: 'Signal scanner',
  descriptionKey: 'Scan the market. Spot real-time opportunities',
  hasCustomComponent: true,
  icon: 'icon-task',
  maxDisplayCountOnMarketPlace: 6,
}

export const KOL_RADAR: AgentCategory = {
  id: AGENT_HUB_TYPE.KOL_RADAR,
  titleKey: 'KOL radar',
  descriptionKey: 'Follow top voices. Act on expert insights',
  hasCustomComponent: false,
  icon: 'icon-portfolio',
  maxDisplayCountOnMarketPlace: 6,
}

export const AUTO_BRIEFING: AgentCategory = {
  id: AGENT_HUB_TYPE.AUTO_BRIEFING,
  titleKey: 'Auto briefing',
  descriptionKey: 'Your daily market intel. Fully automated',
  hasCustomComponent: false,
  icon: 'icon-leaderboard',
  maxDisplayCountOnMarketPlace: 6,
}

export const MARKET_PULSE: AgentCategory = {
  id: AGENT_HUB_TYPE.MARKET_PULSE,
  titleKey: 'Market pulse',
  descriptionKey: 'Live sentiment. Real-time momentum',
  hasCustomComponent: false,
  icon: 'icon-marketplace',
  maxDisplayCountOnMarketPlace: 6,
}

export const TOKEN_DEEP_DIVE: AgentCategory = {
  id: AGENT_HUB_TYPE.TOKEN_DEEP_DIVE,
  titleKey: 'Token deep dive',
  descriptionKey: 'Uncover the fundamentals behind the tokens',
  hasCustomComponent: false,
  icon: 'icon-chat-other',
  maxDisplayCountOnMarketPlace: 6,
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
