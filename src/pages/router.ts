import { lazy } from 'react'

export const ROUTER = {
  HOME: '/',
  SIGNALS: '/signals',
  LIVECHAT: '/livechat',
  CHAT: '/chat',
  PORTFOLIO: '/portfolio',
  CONNECT: '/connect',
  DOWNLOAD: '/download',
  BACK_TEST: '/backtest',
  TASK_DETAIL: '/taskdetail',
  AGENT_HUB: '/agentmarket',
  MY_AGENTS: '/myagents',
  AGENT_DETAIL: '/agentdetail',
  DEMO: '/demo',
  USE_CASES: '/usecases',
  DOCUMENTS: '/documents',
  VAULTS: '/vaults',
  VAULT_DETAIL: '/vaultdetail',
  MY_FUND_AGENT: '/myfundagent',
  CREATE_STRATEGY: '/createstrategy',
  // Agent Hub sub pages
  AGENT_HUB_INDICATOR: '/agentmarket/indicator-hub',
  AGENT_HUB_STRATEGY: '/agentmarket/strategy-hub',
  AGENT_HUB_SIGNAL: '/agentmarket/signal-scanner',
  AGENT_HUB_KOL: '/agentmarket/kol-radar',
  AGENT_HUB_BRIEFING: '/agentmarket/auto-briefing',
  AGENT_HUB_PULSE: '/agentmarket/market-pulse',
  AGENT_HUB_DEEP_DIVE: '/agentmarket/token-deep-dive',
}

// 桌面端页面组件 - lazy 加载
export const Home = lazy(() => import('./Home'))
export const Insights = lazy(() => import('./Insights/SignalsPage'))
export const LiveChat = lazy(() => import('./Insights/LiveChatPage'))
export const Chat = lazy(() => import('./Chat'))
export const Portfolio = lazy(() => import('./Portfolio'))
export const Connect = lazy(() => import('./Connect'))
export const MyAgent = lazy(() => import('./MyAgent'))
export const AgentDetail = lazy(() => import('./AgentDetail'))
export const DemoPage = lazy(() => import('./DemoPage'))
export const AgentRoutes = lazy(() => import('./AgentRoutes'))
export const UseCases = lazy(() => import('./UseCases'))
export const Documents = lazy(() => import('./Documents'))
export const Vaults = lazy(() => import('./Vaults'))
export const VaultDetail = lazy(() => import('./VaultDetail'))
export const Mobile = lazy(() => import('./Mobile'))

// 移动端页面组件 - lazy 加载
export const MobileDemoPage = lazy(() => import('./Mobile/MobileDemoPage'))
export const MobileChat = lazy(() => import('./Mobile/MobileChat'))
export const MobileDownload = lazy(() => import('./Download'))
export const MobileAgentDetail = lazy(() => import('./Mobile/MobileAgentDetail'))
export const MobileAgentHub = lazy(() => import('./Mobile/MobileAgentHub'))
export const MobileAgentKolRadar = lazy(() => import('./Mobile/MobileAgentHub/MobileKolRadar'))
export const MobileAgentTokenDeepDive = lazy(() => import('./Mobile/MobileAgentHub/MobileTokenDeepDive'))
export const MobileMyAgent = lazy(() => import('./Mobile/MobileMyAgent'))
export const MobileUseCases = lazy(() => import('./Mobile/MobileUseCases'))
export const MobileDocuments = lazy(() => import('./Mobile/MobileDocuments'))
export const MobileInsights = lazy(() => import('./Mobile/MobileSignals'))
export const MobileLiveChat = lazy(() => import('./Mobile/MobileLiveChat'))
