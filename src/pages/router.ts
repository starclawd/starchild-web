import { lazy } from 'react'

export const ROUTER = {
  HOME: '/',
  INSIGHTS: '/insights',
  TRADE_AI: '/agent',
  PORTFOLIO: '/portfolio',
  CONNECT: '/connect',
  DOWNLOAD: '/download',
  TASKS: '/tasks',
  BACK_TEST: '/backtest',
  TASK_DETAIL: '/taskdetail',
  AGENT_HUB: '/agenthub',
  DEMO: '/demo',
}

export const DemoPage = lazy(() => import('./DemoPage'))
export const MobileDemoPage = lazy(() => import('./Mobile/MobileDemoPage'))
export const MobileTradeAi = lazy(() => import('./Mobile/MobileTradeAi'))
export const MobileInsights = lazy(() => import('./Mobile/MobileInsights'))
export const MobileBackTest = lazy(() => import('./Mobile/MobileBackTest'))
export const MobileDownload = lazy(() => import('./Download'))
export const MobileTaskDetail = lazy(() => import('./Mobile/MobileTaskDetail'))