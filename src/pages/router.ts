import { lazy } from 'react'

export const ROUTER = {
  HOME: '/',
  // INSIGHTS: '/insights',
  TRADE_AI: '/agent',
  PORTFOLIO: '/portfolio',
  CONNECT: '/connect',
  DOWNLOAD: '/download',
  BACK_TEST: '/backtest',
  TASK_DETAIL: '/taskdetail',
  AGENT_HUB: '/agenthub',
  MY_AGENT: '/myagent',
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
export const MobileDemoPage = lazy(() => import('./Mobile/MobileDemoPage'))
export const MobileTradeAi = lazy(() => import('./Mobile/MobileTradeAi'))
export const MobileInsights = lazy(() => import('./Mobile/MobileInsights'))
export const MobileBackTest = lazy(() => import('./Mobile/MobileBackTest'))
export const MobileDownload = lazy(() => import('./Download'))
export const MobileTaskDetail = lazy(() => import('./Mobile/MobileTaskDetail'))
