import { AgentCategory, AgentInfo } from 'store/agenthub/agenthub'

export enum AGENT_HUB_TYPE {
  INDICATOR = 'Indicator Hub',
  STRATEGY = 'Strategy Lab',
  SIGNAL_SCANNER = 'Signal Scanner',
  KOL_RADAR = 'KOL Radar',
  AUTO_BRIEFING = 'Auto Briefing',
  MARKET_PULSE = 'Market Pulse',
  TOKEN_DEEP_DIVE = 'Token Deep Dive',
  OTHERS = 'Others',
}

export const DISCOVER_AGENTS: AgentCategory = {
  id: 'discover-agents',
  titleKey: 'Discover agents',
  descriptionKey: '',
  icon: 'icon-discover-agents',
  maxDisplayCountOnMarketPlace: 6,
}

export const INDICATOR_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.INDICATOR,
  titleKey: 'Indicator hub',
  descriptionKey: 'Track key metrics. Stay ahead of the trend',
  icon: 'icon-indicator-hub',
  maxDisplayCountOnMarketPlace: 6,
}

export const STRATEGY_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.STRATEGY,
  titleKey: 'Strategy lab',
  descriptionKey: 'Build, test, and refine your trading edge',
  icon: 'icon-backtest',
  maxDisplayCountOnMarketPlace: 6,
}

export const SIGNAL_SCANNER: AgentCategory = {
  id: AGENT_HUB_TYPE.SIGNAL_SCANNER,
  titleKey: 'Signal scanner',
  descriptionKey: 'Scan the market. Spot real-time opportunities',
  icon: 'icon-signal-scanner',
  maxDisplayCountOnMarketPlace: 6,
}

export const KOL_RADAR: AgentCategory = {
  id: AGENT_HUB_TYPE.KOL_RADAR,
  titleKey: 'KOL radar',
  descriptionKey: 'Follow top voices. Act on expert insights',
  icon: 'icon-kol-radar',
  maxDisplayCountOnMarketPlace: 6,
}

export const AUTO_BRIEFING: AgentCategory = {
  id: AGENT_HUB_TYPE.AUTO_BRIEFING,
  titleKey: 'Auto briefing',
  descriptionKey: 'Your daily market intel. Fully automated',
  icon: 'icon-auto-briefing',
  maxDisplayCountOnMarketPlace: 6,
}

export const MARKET_PULSE: AgentCategory = {
  id: AGENT_HUB_TYPE.MARKET_PULSE,
  titleKey: 'Market pulse',
  descriptionKey: 'Live sentiment. Real-time momentum',
  icon: 'icon-market-pulse',
  maxDisplayCountOnMarketPlace: 6,
}

export const TOKEN_DEEP_DIVE: AgentCategory = {
  id: AGENT_HUB_TYPE.TOKEN_DEEP_DIVE,
  titleKey: 'Token deep dive',
  descriptionKey: 'Uncover the fundamentals behind the tokens',
  icon: 'icon-token-deep-dive',
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
