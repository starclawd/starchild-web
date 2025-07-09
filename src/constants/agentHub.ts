export interface AgentCategory {
  id: string
  titleKey: string
  descriptionKey: string
  hasCustomComponent: boolean
  icon: string
}

export const DISCOVER_AGENTS: AgentCategory = {
  id: 'discover-agents',
  titleKey: 'Discover agents',
  descriptionKey: '',
  hasCustomComponent: false,
  icon: 'icon-agent'
}

export const INDICATOR_HUB: AgentCategory = {
  id: 'indicator-hub', 
  titleKey: 'Indicator hub', 
  descriptionKey: 'Track key metrics. Stay ahead of the trend', 
  hasCustomComponent: false,
  icon: 'icon-chat-thinking'
}

export const STRATEGY_HUB: AgentCategory = {
  id: 'strategy-hub', 
  titleKey: 'Strategy lab', 
  descriptionKey: 'Build, test, and refine your trading edge', 
  hasCustomComponent: false,
  icon: 'icon-backtest'
}

export const SIGNAL_SCANNER: AgentCategory = {
  id: 'signal-scanner', 
  titleKey: 'Signal scanner', 
  descriptionKey: 'Scan the market. Spot real-time opportunities', 
  hasCustomComponent: true,
  icon: 'icon-task'
}

export const KOL_RADAR: AgentCategory = {
  id: 'kol-radar', 
  titleKey: 'KOL radar', 
  descriptionKey: 'Follow top voices. Act on expert insights', 
  hasCustomComponent: false,
  icon: 'icon-portfolio'
}

export const AUTO_BRIEFING: AgentCategory = {
  id: 'auto-briefing', 
  titleKey: 'Auto briefing', 
  descriptionKey: 'Your daily market intel. Fully automated', 
  hasCustomComponent: false,
  icon: 'icon-leaderboard'
}

export const MARKET_PULSE: AgentCategory = {
  id: 'market-pulse', 
  titleKey: 'Market pulse', 
  descriptionKey: 'Live sentiment. Real-time momentum', 
  hasCustomComponent: false,
  icon: 'icon-marketplace'
}

export const TOKEN_DEEP_DIVE: AgentCategory = {
  id: 'token-deep-dive', 
  titleKey: 'Token deep dive', 
  descriptionKey: 'Uncover the fundamentals behind the tokens', 
  hasCustomComponent: false,
  icon: 'icon-chat-other'
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