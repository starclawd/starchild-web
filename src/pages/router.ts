import { lazy } from 'react'

export const ROUTER = {
  INSIGHTS: '/insights',
  TRADE_AI: '/agent',
  PORTFOLIO: '/portfolio',
  CONNECT: '/connect',
}

export const TradeAi = lazy(() => import('./TradeAi'))
export const Insights = lazy(() => import('./Insights'))
export const Portfolio = lazy(() => import('./Portfolio'))

export const MobileTradeAi = lazy(() => import('./Mobile/MobileTradeAi'))
export const MobileInsights = lazy(() => import('./Mobile/MobileInsights'))