import { lazy } from 'react'

export const ROUTER = {
  TRADE_AI: '/',
}

export const TradeAi = lazy(() => import('./TradeAi'))

export const MobileTradeAi = lazy(() => import('./Mobile/MobileTradeAi'))