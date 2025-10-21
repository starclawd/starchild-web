import { t } from '@lingui/core/macro'

export const TAB_CONFIG = [
  { key: 'ta', text: t`Technical Analysis (TA)`, value: 'ta' },
  { key: 'risk', text: t`Risk management`, value: 'risk' },
  { key: 'market', text: t`Market Data`, value: 'market' },
  { key: 'signal', text: t`Signal & Alert`, value: 'signal' },
  { key: 'brief', text: t`Auto Summary`, value: 'brief' },
  { key: 'backtest', text: t`Strategy Backtest`, value: 'backtest' },
  { key: 'research', text: t`Deep research`, value: 'research' },
]

// Tab内容配置
export const TAB_CONTENT_CONFIG = {
  ta: {
    title: t`Technical Analysis (TA)`,
    description: t`Get instant, in-depth technical insights on any token.`,
    icon: 'icon-backtest',
  },
  risk: {
    title: t`Risk Management`,
    description: t`You should add your wallet address before using this feature.`,
    icon: 'icon-chat-analyze-agent', // FIXME
  },
  market: {
    title: t`Market Data`,
    description: t`Stay ahead of the market with multi-source intelligence.`,
    icon: 'icon-market-pulse',
  },
  signal: {
    title: t`Signal & Alert`,
    description: t`Never miss a critical move again. Create your own agent or subscribe to existing agents in the Marketplace.`,
    icon: 'icon-auto-briefing',
  },
  brief: {
    title: t`Auto Summary`,
    description: t`Wake up to ready-made market intelligence. Create your own agent or subscribe to existing agents in the Marketplace.`,
    icon: 'icon-token-deep-dive',
  },
  backtest: {
    title: t`Strategy Backtest`,
    description: t`Validate your trading ideas before risking capital.`,
    icon: 'icon-signal-scanner',
  },
  research: {
    title: t`Deep Research`,
    description: t`Get deep-dive insights on any token or protocol.`,
    icon: 'icon-chat-default-ui', // FIXME
  },
} as const

// 定义类型
export type TabKey = keyof typeof TAB_CONTENT_CONFIG
export type TabContent = (typeof TAB_CONTENT_CONFIG)[TabKey]
