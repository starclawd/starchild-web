import { Navigate, Route, Routes } from 'react-router-dom'
import AgentHub from './AgentHub'
import KolRadar from './AgentHub/KolRadar'
import TokenDeepDive from './AgentHub/TokenDeepDive'
import { memo } from 'react'
import { ROUTER } from './router'

const AgentRoutes = memo(() => {
  return (
    <Routes>
      <Route index element={<AgentHub />} />
      <Route path='kol-radar' element={<KolRadar />} />
      <Route path='token-deep-dive' element={<TokenDeepDive />} />
      <Route path='*' element={<Navigate to={ROUTER.AGENT_HUB} replace />} />
    </Routes>
  )
})

AgentRoutes.displayName = 'AgentRoutes'

export default AgentRoutes
