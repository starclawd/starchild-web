import { lazy } from 'react'

export const ROUTER = {
  INSIGHTS: '/insights',
  TRADE_AI: '/agent',
  PORTFOLIO: '/portfolio',
  CONNECT: '/connect',
  DOWNLOAD: '/download',
  TASKS: '/tasks',
  BACK_TEST: '/backtest',
}

export const MobileTradeAi = lazy(() => import('./Mobile/MobileTradeAi'))
export const MobileInsights = lazy(() => import('./Mobile/MobileInsights'))
export const MobileBackTest = lazy(() => import('./Mobile/MobileBackTest'))
export const MobileDownload = lazy(() => import('./Download'))