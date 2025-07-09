import { Navigate, Route, Routes } from 'react-router-dom'
import AgentHub from './AgentHub'
import DiscoverAgents from './AgentHub/DiscoverAgents'
import IndicatorHub from './AgentHub/IndicatorHub'
import StrategyHub from './AgentHub/StrategyHub'
import SignalScanner from './AgentHub/SignalScanner'
import KolRadar from './AgentHub/KolRadar'
import AutoBriefing from './AgentHub/AutoBriefing'
import MarketPulse from './AgentHub/MarketPulse'
import TokenDeepDive from './AgentHub/TokenDeepDive'
import { memo } from 'react'
import { ROUTER } from './router'

const AgentRoutes = memo(() => {
  return (
    <Routes>
      <Route index element={<AgentHub />} />
      <Route path='discover-agents' element={<DiscoverAgents />} />
      <Route path='indicator-hub' element={<IndicatorHub />} />
      <Route path='strategy-hub' element={<StrategyHub />} />
      <Route path='signal-scanner' element={<SignalScanner />} />
      <Route path='kol-radar' element={<KolRadar />} />
      <Route path='auto-briefing' element={<AutoBriefing />} />
      <Route path='market-pulse' element={<MarketPulse />} />
      <Route path='token-deep-dive' element={<TokenDeepDive />} />
      <Route path='*' element={<Navigate to={ROUTER.AGENT_HUB} replace />} />
    </Routes>
  )
})

AgentRoutes.displayName = 'AgentRoutes'

export default AgentRoutes
