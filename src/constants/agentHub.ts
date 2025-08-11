import { msg } from '@lingui/core/macro'
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
  titleKey: msg`Discover Agents`,
  descriptionKey: '',
  icon: 'icon-discover-agents',
  maxDisplayCountOnMarketPlace: 6,
}

export const INDICATOR_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.INDICATOR,
  titleKey: msg`Indicator Hub`,
  descriptionKey: msg`Track key metrics. Stay ahead of the trend`,
  icon: 'icon-indicator-hub',
  maxDisplayCountOnMarketPlace: 6,
}

export const STRATEGY_HUB: AgentCategory = {
  id: AGENT_HUB_TYPE.STRATEGY,
  titleKey: msg`Strategy Lab`,
  descriptionKey: msg`Build, test, and refine your trading edge`,
  icon: 'icon-backtest',
  maxDisplayCountOnMarketPlace: 6,
}

export const SIGNAL_SCANNER: AgentCategory = {
  id: AGENT_HUB_TYPE.SIGNAL_SCANNER,
  titleKey: msg`Signal Scanner`,
  descriptionKey: msg`Scan the market. Spot real-time opportunities`,
  icon: 'icon-signal-scanner',
  maxDisplayCountOnMarketPlace: 6,
}

export const KOL_RADAR: AgentCategory = {
  id: AGENT_HUB_TYPE.KOL_RADAR,
  titleKey: msg`KOL Radar`,
  descriptionKey: msg`Follow top voices. Act on expert insights`,
  icon: 'icon-kol-radar',
  maxDisplayCountOnMarketPlace: 6,
}

export const AUTO_BRIEFING: AgentCategory = {
  id: AGENT_HUB_TYPE.AUTO_BRIEFING,
  titleKey: msg`Auto Briefing`,
  descriptionKey: msg`Your daily market intel. Fully automated`,
  icon: 'icon-auto-briefing',
  maxDisplayCountOnMarketPlace: 6,
}

export const MARKET_PULSE: AgentCategory = {
  id: AGENT_HUB_TYPE.MARKET_PULSE,
  titleKey: msg`Market Pulse`,
  descriptionKey: msg`Live sentiment. Real-time momentum`,
  icon: 'icon-market-pulse',
  maxDisplayCountOnMarketPlace: 6,
}

export const TOKEN_DEEP_DIVE: AgentCategory = {
  id: AGENT_HUB_TYPE.TOKEN_DEEP_DIVE,
  titleKey: msg`Token Deep Dive`,
  descriptionKey: msg`Uncover the fundamentals behind the tokens`,
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
