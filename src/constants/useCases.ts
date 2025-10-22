import { t } from '@lingui/core/macro'

export const TAB_CONFIG = [
  { key: 'ta', text: t`Technical Analysis (TA)`, value: 'ta' },
  { key: 'risk', text: t`Risk Management`, value: 'risk' },
  { key: 'market', text: t`Market Data`, value: 'market' },
  { key: 'signal', text: t`Signals & Alerts`, value: 'signal' },
  { key: 'brief', text: t`Auto Summary`, value: 'brief' },
  { key: 'backtest', text: t`Backtesting`, value: 'backtest' },
  { key: 'research', text: t`Deep Research`, value: 'research' },
]

// Tab内容配置
export const TAB_CONTENT_CONFIG = {
  ta: {
    title: t`Technical Analysis (TA)`,
    description: t`Get instant, in-depth technical insights on any token.`,
    icon: 'icon-backtest',
    prompt: 'TA BTC',
  },
  risk: {
    title: t`Risk Management`,
    description: t`You should add your wallet address before using this feature.`,
    icon: 'icon-shield',
    prompt: 'My positions analysis?',
  },
  market: {
    title: t`Market Data`,
    description: t`Stay ahead of the market with multi-source intelligence.`,
    icon: 'icon-market-pulse',
    prompt: 'liquidity BTC',
  },
  signal: {
    title: t`Signals & Alerts`,
    description: t`Never miss a critical move again. Create your own agent or subscribe to existing agents in the Marketplace.`,
    icon: 'icon-auto-briefing',
    prompt:
      'Monitor the BTC whale position long-short ratio and whale account number long-short ratio. Send an alert if either ratio changes by more than 10% within the last 24 hours.',
  },
  brief: {
    title: t`Auto Summary`,
    description: t`Wake up to ready-made market intelligence. Create your own agent or subscribe to existing agents in the Marketplace.`,
    icon: 'icon-token-deep-dive',
    prompt: 'Generate daily expert-level crypto market report at 00:00 UTC.',
  },
  backtest: {
    title: t`Backtesting`,
    description: t`Validate your trading ideas before risking capital.`,
    icon: 'icon-signal-scanner',
    prompt: 'Backtest: DCA into BTC — buy a fixed amount daily over the past 365 days.',
  },
  research: {
    title: t`Deep Research`,
    description: t`Get deep-dive insights on any token or protocol.`,
    icon: 'icon-deep-research',
    prompt: 'What’s the background of the Kalshi project?',
  },
} as const

// 定义类型
export type TabKey = keyof typeof TAB_CONTENT_CONFIG
export type TabContent = (typeof TAB_CONTENT_CONFIG)[TabKey]
