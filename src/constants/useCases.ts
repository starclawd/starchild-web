import { t } from '@lingui/core/macro'

export enum USE_CASES_TAB_KEY {
  TA = 'ta',
  RISK = 'risk',
  MARKET = 'market',
  SIGNAL = 'signal',
  BRIEF = 'brief',
  BACKTEST = 'backtest',
  RESEARCH = 'research',
}

export enum QUERY_TYPE {
  TA = 'ta_analysis',
  RISK = 'positions_analysis',
  MARKET = 'liquidity_analysis',
  SIGNAL = 'signal_alert',
  BRIEF = 'auto_summary',
  BACKTEST = 'strategy_backtest',
  RESEARCH = 'kalshi_project_analysis',
}

export const TAB_CONFIG = [
  { key: USE_CASES_TAB_KEY.TA, text: t`Technical Analysis (TA)`, value: USE_CASES_TAB_KEY.TA },
  { key: USE_CASES_TAB_KEY.RISK, text: t`Risk Management`, value: USE_CASES_TAB_KEY.RISK },
  { key: USE_CASES_TAB_KEY.MARKET, text: t`Market Data`, value: USE_CASES_TAB_KEY.MARKET },
  { key: USE_CASES_TAB_KEY.SIGNAL, text: t`Signals & Alerts`, value: USE_CASES_TAB_KEY.SIGNAL },
  { key: USE_CASES_TAB_KEY.BRIEF, text: t`Auto Summary`, value: USE_CASES_TAB_KEY.BRIEF },
  { key: USE_CASES_TAB_KEY.BACKTEST, text: t`Backtesting`, value: USE_CASES_TAB_KEY.BACKTEST },
  { key: USE_CASES_TAB_KEY.RESEARCH, text: t`Deep Research`, value: USE_CASES_TAB_KEY.RESEARCH },
]

// Tab内容配置
export const TAB_CONTENT_CONFIG = {
  [USE_CASES_TAB_KEY.TA]: {
    title: t`Technical Analysis (TA)`,
    description: t`Get instant, in-depth technical insights on any token.`,
    icon: 'icon-backtest',
    prompt: t`ta BTC`,
    queryType: QUERY_TYPE.TA,
  },
  [USE_CASES_TAB_KEY.RISK]: {
    title: t`Risk Management`,
    description: t`You should add your wallet address before using this feature.`,
    icon: 'icon-shield',
    prompt: t`My positions analysis?`,
    queryType: QUERY_TYPE.RISK,
  },
  [USE_CASES_TAB_KEY.MARKET]: {
    title: t`Market Data`,
    description: t`Stay ahead of the market with multi-source intelligence.`,
    icon: 'icon-market-pulse',
    prompt: t`liquidity BTC`,
    queryType: QUERY_TYPE.MARKET,
  },
  [USE_CASES_TAB_KEY.SIGNAL]: {
    title: t`Signals & Alerts`,
    description: t`Never miss a critical move again. Create your own agent or subscribe to existing agents in the Marketplace.`,
    icon: 'icon-auto-briefing',
    prompt: t`Track the SOL price and immediately alert if the price breaks through the upper or lower boundary of the current consolidation range.`,
    queryType: QUERY_TYPE.SIGNAL,
  },
  [USE_CASES_TAB_KEY.BRIEF]: {
    title: t`Auto Summary`,
    description: t`Wake up to ready-made market intelligence. Create your own agent or subscribe to existing agents in the Marketplace.`,
    icon: 'icon-token-deep-dive',
    prompt: t`Generate daily expert-level crypto market report at 00:00 UTC.`,
    queryType: QUERY_TYPE.BRIEF,
  },
  [USE_CASES_TAB_KEY.BACKTEST]: {
    title: t`Backtesting`,
    description: t`Validate your trading ideas before risking capital.`,
    icon: 'icon-signal-scanner',
    prompt: t`Backtest: DCA into BTC — buy a fixed amount daily over the past 365 days.`,
    queryType: QUERY_TYPE.BACKTEST,
  },
  [USE_CASES_TAB_KEY.RESEARCH]: {
    title: t`Deep Research`,
    description: t`Get deep-dive insights on any token or protocol.`,
    icon: 'icon-deep-research',
    prompt: t`What’s the background of the Kalshi project?`,
    queryType: QUERY_TYPE.RESEARCH,
  },
} as const

// 定义类型
export type TabKey = USE_CASES_TAB_KEY
export type TabContent = (typeof TAB_CONTENT_CONFIG)[TabKey]

// ==================== 动画时间配置 ====================
// 所有动画时间统一管理，单位：毫秒(ms)
// 这些配置在主组件和子组件中共享，确保动画时间的一致性

/** GlowInput 淡入动画时间 */
export const GLOW_INPUT_FADE_IN_DURATION = 300

/** GlowInput 向上移出动画时间 */
export const GLOW_INPUT_MOVE_UP_DURATION = 500

/** 打字机效果开始前的延迟时间 */
export const TYPEWRITER_START_DELAY = 500

/** 打字机效果每个字符的显示间隔 */
export const TYPEWRITER_CHAR_INTERVAL = 50

/** 光标从右下角移动到按钮的动画时间 */
export const CURSOR_MOVE_DURATION = 1000

/** 按钮放大/缩小的过渡时间 */
export const BUTTON_SCALE_DURATION = 300

/** 背景图片淡出的过渡时间 */
export const BACKGROUND_FADE_DURATION = 500

// ==================== 动画时序配置 ====================
// 控制各个动画阶段的触发时机

/** 打字完成后，光标移动到按钮的时间 */
export const DELAY_CURSOR_REACH_BUTTON = 1000

/** 光标到达按钮后，按钮保持放大状态的时间 */
export const DELAY_BUTTON_SCALE_UP = 200

/** 光标/GlowInput 开始消失后，背景图淡出的延迟时间 */
export const DELAY_BACKGROUND_FADE = 500
