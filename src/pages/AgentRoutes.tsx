import { Navigate, Route, Routes } from 'react-router-dom'
import AgentHub from './AgentHub'
import IndicatorHub from './AgentHub/IndicatorHub'
import StrategyHub from './AgentHub/StrategyHub'
import SignalScanner from './AgentHub/SignalScanner'
import KolRadar from './AgentHub/KolRadar'
import AutoBriefing from './AgentHub/AutoBriefing'
import MarketPulse from './AgentHub/MarketPulse'
import TokenDeepDive from './AgentHub/TokenDeepDive'
import { memo } from 'react'
import { ROUTER } from './router'
import KolAgentList from './AgentHub/KolRadar/KolAgentList'
import TokenAgentList from './AgentHub/TokenDeepDive/TokenAgentList'

const AgentRoutes = memo(() => {
  return (
    <Routes>
      <Route index element={<AgentHub />} />
      <Route path='indicator-hub' element={<IndicatorHub />} />
      <Route path='strategy-hub' element={<StrategyHub />} />
      <Route path='signal-scanner' element={<SignalScanner />} />
      <Route path='kol-radar' element={<KolRadar />} />
      <Route path='kol-radar/:kolId' element={<KolAgentList />} />
      <Route path='auto-briefing' element={<AutoBriefing />} />
      <Route path='market-pulse' element={<MarketPulse />} />
      <Route path='token-deep-dive' element={<TokenDeepDive />} />
      <Route path='token-deep-dive/:tokenId' element={<TokenAgentList />} />
      <Route path='*' element={<Navigate to={ROUTER.AGENT_HUB} replace />} />
    </Routes>
  )
})

AgentRoutes.displayName = 'AgentRoutes'

export default AgentRoutes
