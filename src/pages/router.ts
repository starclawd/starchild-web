import { lazy } from 'react'

export const ROUTER = {
  HOME: '/',
  // INSIGHTS: '/insights',
  CHAT: '/chat',
  PORTFOLIO: '/portfolio',
  CONNECT: '/connect',
  DOWNLOAD: '/download',
  BACK_TEST: '/backtest',
  TASK_DETAIL: '/taskdetail',
  AGENT_HUB: '/agenthub',
  MY_AGENT: '/myagent',
  AGENT_DETAIL: '/agentdetail',
  DEMO: '/demo',
  // Agent Hub sub pages
  AGENT_HUB_INDICATOR: '/agenthub/indicator-hub',
  AGENT_HUB_STRATEGY: '/agenthub/strategy-hub',
  AGENT_HUB_SIGNAL: '/agenthub/signal-scanner',
  AGENT_HUB_KOL: '/agenthub/kol-radar',
  AGENT_HUB_BRIEFING: '/agenthub/auto-briefing',
  AGENT_HUB_PULSE: '/agenthub/market-pulse',
  AGENT_HUB_DEEP_DIVE: '/agenthub/token-deep-dive',
}

export const DemoPage = lazy(() => import('./DemoPage'))
export const Home = lazy(() => import('./Home'))
export const MobileDemoPage = lazy(() => import('./Mobile/MobileDemoPage'))
export const MobileChat = lazy(() => import('./Mobile/MobileChat'))
export const MobileDownload = lazy(() => import('./Download'))
export const MobileAgentDetail = lazy(() => import('./Mobile/MobileAgentDetail'))
export const MobileAgentHub = lazy(() => import('./Mobile/MobileAgentHub'))
export const MobileIndicatorHub = lazy(() => import('./Mobile/MobileAgentHub/MobileIndicatorHub'))
export const MobileAgentStrategyHub = lazy(() => import('./Mobile/MobileAgentHub/MobileStrategyHub'))
export const MobileAgentSignalScanner = lazy(() => import('./Mobile/MobileAgentHub/MobileSignalScanner'))
export const MobileAgentKolRadar = lazy(() => import('./Mobile/MobileAgentHub/MobileKolRadar'))
export const MobileAgentAutoBriefing = lazy(() => import('./Mobile/MobileAgentHub/MobileAutoBriefing'))
export const MobileAgentMarketPulse = lazy(() => import('./Mobile/MobileAgentHub/MobileMarketPulse'))
export const MobileAgentTokenDeepDive = lazy(() => import('./Mobile/MobileAgentHub/MobileTokenDeepDive'))
