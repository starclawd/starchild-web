/**
 * 解析 Python 策略代码，提取关键信息用于 React Flow 可视化
 * 支持新旧两种代码生成格式，保持向下兼容
 */

export interface StrategyConfig {
  name: string
  signal_symbol: string // 用于分析信号的币种
  trading_symbol: string // 实际交易的币种
  timeframe: string
  leverage: string | number
  take_profit: string
  stop_loss: string
  polling_mode: string
  // 非对称仓位配置
  long_margin_pct?: number
  short_margin_pct?: number
  // 高级风控参数
  max_roe_loss?: number
  max_drawdown?: number
  max_account_risk?: number
  // 新版代码生成格式 - 轮询配置
  base_interval?: number
  min_interval?: number
  // 新版代码生成格式 - 调度配置
  schedule_type?: string
  schedule_timeframe?: string
  schedule_cron?: string
  // 新版代码生成格式 - 状态管理
  needs_state_reset?: boolean
  reset_trigger?: string
  // 新版代码生成格式 - 仓位大小
  position_size?: string
}

// ============================================
// 新版代码格式 - K线模式分析
// ============================================

export interface CandlePatternInfo {
  type: 'consecutive_color' | 'pattern' | 'custom'
  name: string
  description: string
  requiredCandles: number
  // 连续颜色模式
  colorPattern?: ('green' | 'red')[]
  // 入场/出场条件
  entryCondition?: string
  exitCondition?: string
}

// 状态管理配置
export interface StateManagementInfo {
  needsState: boolean
  fields: string[]
  resetTrigger?: string
}

export interface DataSourceNode {
  id: string
  type: 'datasource'
  api: string
  fields: string[]
}

export interface IndicatorNode {
  id: string
  type: 'indicator'
  name: string
  params: string
}

export interface ConditionNode {
  id: string
  type: 'condition'
  direction: 'long' | 'short' | 'both'
  category: 'entry' | 'exit'
  triggerType: 'signal' | 'take_profit' | 'stop_loss' | 'reversal' | 'crossover' | 'indicator'
  conditions: string[]
  description: string
}

export interface ActionNode {
  id: string
  type: 'action'
  action: 'buy' | 'sell' | 'hold'
  description: string
}

// 分析节点 - 展示数据处理逻辑
export interface AnalyzeStep {
  id: string
  label: string
  description: string
}

// 决策节点 - 展示决策逻辑
export interface DecisionBranch {
  condition: string
  action: string
  description: string
}

export interface ParsedStrategy {
  name: string
  strategyType: string
  config: StrategyConfig
  dataSources: DataSourceNode[]
  indicators: IndicatorNode[]
  entryConditions: ConditionNode[]
  exitConditions: ConditionNode[]
  riskParams: {
    takeProfit: string
    stopLoss: string
    leverage: string
    positionSize: string
    // 非对称仓位大小
    longPositionSize?: string
    shortPositionSize?: string
    // 高级风控
    maxRoeLoss?: string
    maxDrawdown?: string
    maxAccountRisk?: string
    // 新版 - hard stops
    hardStops?: string[]
  }
  // Cross-Asset 信息
  crossAssetInfo?: {
    signalSymbol: string
    tradingSymbol: string
    signalAsset: string
    tradingAsset: string
  }
  // 详细的执行逻辑
  analyzeSteps: AnalyzeStep[]
  decisionLogic: {
    hasPosition: DecisionBranch[]
    noPosition: DecisionBranch[]
  }
  // ============================================
  // 新版代码格式 - 扩展字段
  // ============================================
  // K线模式分析
  candlePattern?: CandlePatternInfo
  // 状态管理
  stateManagement?: StateManagementInfo
  // 策略描述/vibe
  vibe?: string
  // 数据层计算
  calculations?: string[]
  // 轮询配置
  pollingConfig?: {
    mode: string
    baseInterval: number
    minInterval: number
  }
}

/**
 * 从 Python 代码中提取文档字符串
 */
function extractDocstring(code: string): string {
  const match = code.match(/"""([\s\S]*?)"""/)?.[1] || ''
  return match.trim()
}

/**
 * 推断策略类型
 * 支持新旧两种代码格式
 */
function inferStrategyType(code: string): string {
  const lower = code.toLowerCase()

  // 检测 Cross-Asset 策略 (使用一个币的信号交易另一个币)
  const isCrossAsset =
    (code.includes('signal_symbol') &&
      code.includes('trading_symbol') &&
      code.match(/"signal_symbol":\s*"([^"]+)"/)?.[1] !== code.match(/"trading_symbol":\s*"([^"]+)"/)?.[1]) ||
    lower.includes('cross_asset') ||
    lower.includes('cross-asset')

  // ============================================
  // 新版代码格式 - K线模式策略类型
  // ============================================

  // 连续绿线动量策略 (3-green momentum 等)
  if (
    lower.includes('consecutive_green') ||
    lower.includes('3_green') ||
    lower.includes('3-green') ||
    (lower.includes('candle_colors') && lower.includes('green'))
  ) {
    const countMatch = code.match(/(\d+)[\s_-]*green/i)
    const count = countMatch ? countMatch[1] : '3'
    return `${count}-Green Momentum`
  }

  // 连续红线策略
  if (
    lower.includes('consecutive_red') ||
    lower.includes('3_red') ||
    lower.includes('3-red')
  ) {
    const countMatch = code.match(/(\d+)[\s_-]*red/i)
    const count = countMatch ? countMatch[1] : '3'
    return `${count}-Red Reversal`
  }

  // K线模式策略
  if (lower.includes('candle_colors') || lower.includes('candlestick pattern')) {
    return 'Candle Pattern'
  }

  // ============================================
  // 旧版代码格式 - 保持向下兼容
  // ============================================

  if (lower.includes('fibonacci') || lower.includes('fib_level') || lower.includes('fib_retracement'))
    return 'Fibonacci Retracement'
  if (lower.includes('vcp') || lower.includes('volatility contraction')) return 'VCP Breakout'
  if (
    (lower.includes('sma') || lower.includes('ema') || lower.includes('ma5') || lower.includes('ma10')) &&
    (lower.includes('cross') || lower.includes('golden_cross') || lower.includes('death_cross'))
  ) {
    return isCrossAsset ? 'Cross-Asset MA Crossover' : 'MA Crossover'
  }
  // RSI Crossover (区分于简单的 RSI Reversal)
  if (
    lower.includes('rsi') &&
    (lower.includes('crossover') || lower.includes('oversold_crossover') || lower.includes('overbought_crossover'))
  ) {
    return 'RSI Crossover'
  }
  if (lower.includes('rsi') && (lower.includes('oversold') || lower.includes('overbought'))) return 'RSI Reversal'
  if (lower.includes('momentum')) return 'Momentum'
  if (lower.includes('scalp')) return 'Scalping'
  if (lower.includes('breakout')) return 'Breakout'
  if (isCrossAsset) return 'Cross-Asset Strategy'
  return 'Custom Strategy'
}

/**
 * 提取策略配置
 */
function extractConfig(code: string): StrategyConfig {
  const configMatch = code.match(/CONFIG\s*=\s*\{([\s\S]*?)\n\}/)?.[1] || ''

  const extractStr = (field: string): string => {
    const match = configMatch.match(new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, 'i'))?.[1]
    return match || ''
  }

  const extractNum = (field: string): number | null => {
    const match = configMatch.match(new RegExp(`"${field}"\\s*:\\s*([\\d.]+)`, 'i'))?.[1]
    return match ? parseFloat(match) : null
  }

  // 提取数组格式的 timeframes，如 "timeframes": ["4h", "5m"]
  const extractArray = (field: string): string[] => {
    const match = configMatch.match(new RegExp(`"${field}"\\s*:\\s*\\[([^\\]]*?)\\]`, 'i'))?.[1]
    if (!match) return []
    // 提取数组中的字符串元素
    const items = match.match(/"([^"]*)"/g) || []
    return items.map((item) => item.replace(/"/g, ''))
  }

  // 从代码中提取 TP/SL 数值（如 pnl_pct >= 4.0）
  let takeProfit = extractStr('take_profit')
  let stopLoss = extractStr('stop_loss')

  // 如果 CONFIG 中没有具体值，尝试从代码逻辑中提取
  if (!takeProfit || takeProfit.trim() === '') {
    // 检测 pnl_pct >= X.X 格式
    const tpMatch = code.match(/pnl_pct\s*>=\s*(\d+\.?\d*)/)?.[1]
    if (tpMatch) {
      takeProfit = `+${tpMatch}%`
    }
  }

  if (!stopLoss || stopLoss.trim() === '') {
    // 检测 pnl_pct <= -X.X 格式
    const slMatch = code.match(/pnl_pct\s*<=\s*-(\d+\.?\d*)/)?.[1]
    if (slMatch) {
      stopLoss = `-${slMatch}%`
    }
  }

  // 提取 position_size
  let positionSize = extractStr('position_size') || extractStr('position_sizing')
  if (!positionSize) {
    const posSizeNum = extractNum('position_size_pct')
    if (posSizeNum) {
      positionSize = `${(posSizeNum * 100).toFixed(0)}%`
    }
  }

  // 提取 timeframe - 支持单个字符串或数组格式
  let timeframe = extractStr('timeframe')
  if (!timeframe) {
    // 尝试提取数组格式的 timeframes
    const timeframesArray = extractArray('timeframes')
    if (timeframesArray.length > 0) {
      timeframe = timeframesArray.join(', ')
    }
  }

  // 提取非对称仓位配置
  const longMarginPct = extractNum('long_margin_pct')
  const shortMarginPct = extractNum('short_margin_pct')

  // 提取高级风控参数 - 支持数字和字符串格式
  const maxRoeLoss = extractNum('max_roe_loss')
  // max_drawdown 支持 "-20%" 字符串格式或 0.2 数字格式
  let maxDrawdown: number | null = extractNum('max_drawdown')
  if (maxDrawdown === null) {
    const maxDrawdownStr = extractStr('max_drawdown')
    if (maxDrawdownStr) {
      // 从 "-20%" 或 "20%" 提取数字
      const numMatch = maxDrawdownStr.match(/-?([\d.]+)/)?.[1]
      if (numMatch) {
        maxDrawdown = parseFloat(numMatch) / 100 // 转换为小数
      }
    }
  }
  const maxAccountRisk = extractNum('max_account_risk')

  // 新版代码格式 - 轮询配置
  const baseInterval = extractNum('base_interval')
  const minInterval = extractNum('min_interval')

  // 新版代码格式 - 调度配置
  const scheduleType = extractStr('schedule_type')
  const scheduleTimeframe = extractStr('schedule_timeframe')
  const scheduleCron = extractStr('schedule_cron')

  // 新版代码格式 - 状态管理
  const needsStateReset = configMatch.includes('"needs_state_reset": true') || configMatch.includes('"needs_state_reset": True')
  const resetTrigger = extractStr('reset_trigger')

  // 新版代码格式 - 仓位大小字符串
  const positionSizeStr = extractStr('position_size')

  return {
    name: extractStr('name'),
    signal_symbol: extractStr('signal_symbol'),
    trading_symbol: extractStr('trading_symbol') || extractStr('signal_symbol'),
    timeframe,
    leverage: extractNum('leverage') || extractStr('leverage') || '10',
    take_profit: takeProfit,
    stop_loss: stopLoss,
    polling_mode: extractStr('polling_mode') || 'adaptive',
    long_margin_pct: longMarginPct ?? undefined,
    short_margin_pct: shortMarginPct ?? undefined,
    max_roe_loss: maxRoeLoss ?? undefined,
    max_drawdown: maxDrawdown ?? undefined,
    max_account_risk: maxAccountRisk ?? undefined,
    // 新版字段
    base_interval: baseInterval ?? undefined,
    min_interval: minInterval ?? undefined,
    schedule_type: scheduleType || undefined,
    schedule_timeframe: scheduleTimeframe || undefined,
    schedule_cron: scheduleCron || undefined,
    needs_state_reset: needsStateReset || undefined,
    reset_trigger: resetTrigger || undefined,
    position_size: positionSizeStr || undefined,
  }
}

/**
 * 提取数据源
 */
function extractDataSources(code: string): DataSourceNode[] {
  const sources: DataSourceNode[] = []

  if (code.includes('coingecko') || code.includes('COINGECKO')) {
    const fields: string[] = []
    if (code.includes('current_price') || code.includes('simple/price')) fields.push('Price')
    if (code.includes('ohlc')) fields.push('OHLC')
    if (code.includes('volume')) fields.push('Volume')
    if (code.includes('market_chart')) fields.push('Chart')
    sources.push({
      id: 'ds-coingecko',
      type: 'datasource',
      api: 'CoinGecko',
      fields: fields.length ? fields : ['Price'],
    })
  }

  // 只有当代码实际调用了 TAAPI API 时才添加（检查 api.taapi.io 调用）
  if (code.includes('api.taapi.io') || code.includes('taapi.io/bulk')) {
    const fields: string[] = []
    if (code.includes('sma') || code.includes('"sma"')) fields.push('SMA')
    if (code.includes('rsi') || code.includes('"rsi"')) fields.push('RSI')
    if (code.includes('fibonacci') || code.includes('"fib"')) fields.push('Fib')
    if (code.includes('ema') || code.includes('"ema"')) fields.push('EMA')
    // 新增：ROC (Rate of Change) 检测
    if (code.includes('roc') || code.includes('"roc"')) fields.push('ROC')
    // 新增：Candle/OHLCV 检测
    if (code.includes('"candle"') || code.includes('candle')) fields.push('Candle')
    // 新增：MACD 检测
    if (code.includes('macd') || code.includes('"macd"')) fields.push('MACD')
    // 新增：Bollinger Bands 检测
    if (code.includes('bbands') || code.includes('"bbands"')) fields.push('BB')
    sources.push({ id: 'ds-taapi', type: 'datasource', api: 'TAAPI', fields: fields.length ? fields : ['Indicators'] })
  }

  // Orderly Network - 检测 API URL 或关键字
  const hasOrderly =
    code.includes('orderly.org') ||
    code.includes('orderly.network') ||
    code.includes('api-evm.orderly') ||
    code.includes('ORDERLY') ||
    code.includes('PERP_') ||
    code.includes('_USDC')

  if (hasOrderly) {
    const fields: string[] = []
    if (code.includes('mark_price') || code.includes('futures') || code.includes('/futures/')) fields.push('Price')
    // 增强 klines 检测
    if (
      code.includes('kline') ||
      code.includes('klines') ||
      code.includes('ohlc') ||
      code.includes('/v1/public/kline') ||
      code.includes('last_3_candles')
    ) {
      fields.push('Klines')
    }
    // 检测 24h ticker
    if (code.includes('ticker/24hr') || code.includes('24h_')) fields.push('24h Stats')
    // 检测保证金
    if (code.includes('margin') || code.includes('available_margin')) fields.push('Margin')
    sources.push({ id: 'ds-orderly', type: 'datasource', api: 'Orderly', fields: fields.length ? fields : ['Price'] })
  }

  if (sources.length === 0) {
    sources.push({ id: 'ds-default', type: 'datasource', api: 'Exchange API', fields: ['Price', 'Volume'] })
  }

  return sources
}

/**
 * 提取技术指标
 */
function extractIndicators(code: string): IndicatorNode[] {
  const indicators: IndicatorNode[] = []

  // SMA - 动态检测所有 SMA 周期
  // 检测 ma5, ma10, sma9, sma21 等各种格式
  const smaMatches = code.match(/(?:sma|ma)[\s_]*(\d+)/gi) || []
  const smaPeriods = new Set<number>()
  smaMatches.forEach((match) => {
    const period = match.match(/\d+/)?.[0]
    if (period) smaPeriods.add(parseInt(period))
  })

  // 也检测 TAAPI SMA 调用中的 period 参数
  const taapiPeriodMatches = code.match(/"period":\s*(\d+)/g) || []
  if (code.includes('taapi.io/sma') || code.includes('api.taapi.io/sma')) {
    taapiPeriodMatches.forEach((match) => {
      const period = match.match(/\d+/)?.[0]
      if (period) smaPeriods.add(parseInt(period))
    })
  }

  if (smaPeriods.size > 0) {
    const periods = Array.from(smaPeriods).sort((a, b) => a - b)
    indicators.push({
      id: 'ind-sma',
      type: 'indicator',
      name: 'SMA',
      params: `Period: ${periods.join(', ')}`,
    })
  }

  // EMA - 同样动态检测
  const emaMatches = code.match(/ema[\s_]*(\d+)/gi) || []
  const emaPeriods = new Set<number>()
  emaMatches.forEach((match) => {
    const period = match.match(/\d+/)?.[0]
    if (period) emaPeriods.add(parseInt(period))
  })
  if (emaPeriods.size > 0) {
    const periods = Array.from(emaPeriods).sort((a, b) => a - b)
    indicators.push({
      id: 'ind-ema',
      type: 'indicator',
      name: 'EMA',
      params: `Period: ${periods.join(', ')}`,
    })
  }

  // RSI - 检测各种 RSI 使用模式
  const hasRsiLogic =
    (code.includes('taapi.io') && code.toLowerCase().includes('/rsi')) ||
    /rsi[\s_]*[<>=]/.test(code.toLowerCase()) ||
    code.includes('rsi_value') ||
    code.includes('rsi_data') ||
    code.includes('current_rsi') ||
    code.includes('previous_rsi') ||
    code.includes('oversold_crossover') ||
    code.includes('overbought_crossover') ||
    code.includes('rsi_long_threshold') ||
    code.includes('rsi_short_threshold') ||
    code.includes('rsi_long_exit') ||
    code.includes('rsi_short_exit')
  if (hasRsiLogic) {
    const period = code.match(/rsi.*?period["\s:]*(\d+)/i)?.[1] ||
      code.match(/["']rsi_period["']\s*:\s*(\d+)/)?.[1] ||
      '14'
    // 提取 RSI 阈值 - 支持多种格式
    const oversoldLevel = code.match(/rsi_oversold["\s:]*(\d+)/i)?.[1] ||
      code.match(/["']rsi_short_threshold["']\s*:\s*(\d+)/)?.[1] ||
      '30'
    const overboughtLevel = code.match(/rsi_overbought["\s:]*(\d+)/i)?.[1] ||
      code.match(/["']rsi_long_threshold["']\s*:\s*(\d+)/)?.[1] ||
      '70'
    const hasThresholds = code.includes('rsi_oversold') || code.includes('rsi_overbought') ||
      code.includes('rsi_long_threshold') || code.includes('rsi_short_threshold')
    indicators.push({
      id: 'ind-rsi',
      type: 'indicator',
      name: 'RSI',
      params: hasThresholds ? `Period: ${period}` : `Period: ${period}`,
    })
  }

  // Fibonacci
  if (code.includes('fibonacci') || code.includes('fib_level') || code.includes('calculate_fibonacci')) {
    // 提取实际使用的 Fib 级别
    const fibLevels: string[] = []
    if (code.includes('38.2%') || code.includes('0.382')) fibLevels.push('38.2%')
    if (code.includes('50.0%') || code.includes('50%') || code.includes('0.5')) fibLevels.push('50%')
    if (code.includes('61.8%') || code.includes('0.618')) fibLevels.push('61.8%')
    if (code.includes('78.6%') || code.includes('0.786')) fibLevels.push('78.6%')
    indicators.push({
      id: 'ind-fib',
      type: 'indicator',
      name: 'Fibonacci',
      params: fibLevels.length > 0 ? fibLevels.join(', ') : '38.2%, 50%, 61.8%',
    })
  }

  // Volatility
  if (code.includes('volatility') || code.includes('contraction_ratio')) {
    indicators.push({ id: 'ind-vol', type: 'indicator', name: 'Volatility', params: '30-period range' })
  }

  // Volume Analysis - 增强检测
  const hasVolumeLogic =
    code.includes('volume_confirmed') ||
    code.includes('avg_volume') ||
    code.includes('current_volume') ||
    code.includes('volume_ratio') ||
    code.includes('volume_ma') ||
    code.includes('volume_multiplier') ||
    (code.includes('volume') && code.includes('average'))
  if (hasVolumeLogic) {
    // 尝试提取 volume 周期
    const volumePeriod = code.match(/volumes?\[-(\d+):\]/)?.[1] ||
      code.match(/["']volume_ma_period["']\s*:\s*(\d+)/)?.[1] ||
      '20'
    indicators.push({ id: 'ind-volume', type: 'indicator', name: 'Volume', params: `${volumePeriod}-period average` })
  }

  // Momentum - 检测各种动量计算方式
  if (code.includes('momentum_pct') || code.includes('momentum_threshold') || code.includes('price_change_pct')) {
    // 尝试提取 timeframe
    const timeframe = code.match(/"timeframe":\s*"(\d+[hmd])"/i)?.[1] || '1H'
    indicators.push({
      id: 'ind-momentum',
      type: 'indicator',
      name: 'Momentum',
      params: `${timeframe.toUpperCase()} change %`,
    })
  }

  return indicators
}

/**
 * 从文档字符串提取条件
 */
function extractConditionsFromDocstring(docstring: string): { entry: string[]; exit: string[] } {
  const entry: string[] = []
  const exit: string[] = []

  const entrySection = docstring.match(/Entry Logic:([\s\S]*?)(?=Exit Logic:|$)/i)?.[1] || ''
  const exitSection = docstring.match(/Exit Logic:([\s\S]*?)(?=Data Sources?:|Timeframe:|$)/i)?.[1] || ''

  entrySection.split('\n').forEach((line) => {
    const content = line.replace(/^-\s*/, '').trim()
    if (content && content.length > 5) entry.push(content)
  })

  exitSection.split('\n').forEach((line) => {
    const content = line.replace(/^-\s*/, '').trim()
    if (content && content.length > 5) exit.push(content)
  })

  return { entry, exit }
}

/**
 * 提取入场条件
 */
function extractEntryConditions(code: string, docstring: string): ConditionNode[] {
  const conditions: ConditionNode[] = []
  const docConditions = extractConditionsFromDocstring(docstring)

  // 从文档中提取
  docConditions.entry.forEach((desc, i) => {
    const isLong = desc.toLowerCase().includes('long') || desc.toLowerCase().includes('buy')
    const isShort = desc.toLowerCase().includes('short') || desc.toLowerCase().includes('sell')

    let triggerType: ConditionNode['triggerType'] = 'signal'
    if (desc.toLowerCase().includes('cross')) triggerType = 'crossover'

    if (isLong || isShort) {
      conditions.push({
        id: `entry-${i}`,
        type: 'condition',
        direction: isLong ? 'long' : 'short',
        category: 'entry',
        triggerType,
        conditions: desc.split(/\s*\+\s*/).filter(Boolean),
        description: desc,
      })
    }
  })

  // 如果没有从文档提取到，从代码推断
  if (conditions.length === 0) {
    // ============================================
    // K 线颜色模式 - 3-Green Momentum 等
    // ============================================
    const hasConsecutiveGreens =
      code.includes('consecutive_greens') ||
      code.includes('current_has_3_greens') ||
      code.includes('3_green') ||
      code.includes('3-green') ||
      (code.includes('candle_colors') && code.includes('green'))

    const hasLastCandleRed =
      code.includes('last_candle_red') ||
      (code.includes('candle_colors[-1]') && code.includes('red'))

    if (hasConsecutiveGreens) {
      // 提取连续绿线数量
      const countMatch = code.match(/consecutive_greens\s*>=?\s*(\d+)/i) ||
        code.match(/(\d+)[_-]?green/i) ||
        code.match(/(\d+)\s*consecutive\s*green/i)
      const count = countMatch ? countMatch[1] : '3'

      conditions.push({
        id: 'entry-long-green',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: [`${count} consecutive green candles (Close > Open)`],
        description: `${count}-Green Momentum entry`,
      })
    }

    // 连续红线入场（做空策略）
    const hasConsecutiveReds =
      code.includes('consecutive_reds') ||
      code.includes('current_has_3_reds') ||
      code.includes('3_red') ||
      code.includes('3-red')

    if (hasConsecutiveReds) {
      const countMatch = code.match(/consecutive_reds?\s*>=?\s*(\d+)/i) ||
        code.match(/(\d+)[_-]?red/i)
      const count = countMatch ? countMatch[1] : '3'

      conditions.push({
        id: 'entry-short-red',
        type: 'condition',
        direction: 'short',
        category: 'entry',
        triggerType: 'signal',
        conditions: [`${count} consecutive red candles (Close < Open)`],
        description: `${count}-Red Reversal entry`,
      })
    }

    // MA Crossover - 检测各种格式 (ma5_above_ma10, ma9_above_ma21, golden_cross 等)
    const maCrossPattern = /(?:ma|sma|ema)(\d+)_above_(?:ma|sma|ema)(\d+)/i
    const maCrossMatch = code.match(maCrossPattern)

    // 也检测 prev_maX_above_maY 模式 (用于 crossover 检测)
    const hasCrossoverLogic =
      code.includes('prev_ma') ||
      code.includes('golden_cross') ||
      code.includes('death_cross') ||
      code.includes('crossed above') ||
      code.includes('crossed below')

    if (maCrossMatch || hasCrossoverLogic) {
      // 提取 MA 周期
      let shortPeriod = '5'
      let longPeriod = '10'
      if (maCrossMatch) {
        shortPeriod = maCrossMatch[1]
        longPeriod = maCrossMatch[2]
      } else {
        // 尝试从 ma5, ma10 等变量名提取
        const maVars = code.match(/ma(\d+)/g) || []
        const periods = maVars.map((v) => parseInt(v.replace('ma', ''))).sort((a, b) => a - b)
        if (periods.length >= 2) {
          shortPeriod = periods[0].toString()
          longPeriod = periods[1].toString()
        }
      }

      conditions.push({
        id: 'entry-long-ma',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'crossover',
        conditions: [`MA${shortPeriod} crosses above MA${longPeriod}`],
        description: `Golden Cross (MA${shortPeriod}/MA${longPeriod})`,
      })
      conditions.push({
        id: 'entry-short-ma',
        type: 'condition',
        direction: 'short',
        category: 'entry',
        triggerType: 'crossover',
        conditions: [`MA${shortPeriod} crosses below MA${longPeriod}`],
        description: `Death Cross (MA${shortPeriod}/MA${longPeriod})`,
      })
    }

    // Fibonacci - 动态提取 Fib 级别，不硬编码 RSI/Volume
    if (code.includes('61.8%') || code.includes('78.6%') || code.includes('50.0%') || code.includes('38.2%')) {
      // 提取实际使用的 Fib 级别
      const fibLevels: string[] = []
      if (code.includes('38.2%')) fibLevels.push('38.2%')
      if (code.includes('50.0%') || code.includes('50%')) fibLevels.push('50%')
      if (code.includes('61.8%')) fibLevels.push('61.8%')
      if (code.includes('78.6%')) fibLevels.push('78.6%')

      const fibConditions = [`Price touches Fib level (${fibLevels.join(', ')})`]

      // 只有当代码实际使用了这些指标才添加
      if (code.toLowerCase().includes('rsi') && code.includes('< 35')) {
        fibConditions.push('RSI < 35')
      }
      if (code.includes('volume') && (code.includes('spike') || code.includes('expansion'))) {
        fibConditions.push('Volume confirmation')
      }

      conditions.push({
        id: 'entry-long-fib',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: fibConditions,
        description: 'Fibonacci retracement entry',
      })
    }

    // VCP
    if (code.includes('volatility_contraction')) {
      conditions.push({
        id: 'entry-long-vcp',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: ['Volatility contraction', 'Price breaks 5-period high', 'Volume expansion 2x'],
        description: 'VCP breakout entry',
      })
    }

    // Momentum / Price Change Scalper - 多种检测模式
    const hasMomentumLogic =
      code.includes('momentum_pct') ||
      code.includes('price_change_pct') ||
      code.includes('price_change') ||
      code.includes('bullish_signal') ||
      code.includes('abs_change_pct')

    if (hasMomentumLogic) {
      // 提取阈值
      const thresholdMatch = code.match(/["'](?:threshold_percent|momentum_threshold)["']\s*:\s*([\d.]+)/)?.[1]
      const threshold = thresholdMatch || '0.5'

      // 检测多种入场条件模式
      const hasBullishEntry =
        code.includes('>= threshold') ||
        code.includes('>= momentum_threshold') ||
        code.includes('abs_change_pct >= momentum_threshold') ||
        code.includes('bullish_signal') ||
        code.includes('price_change >= threshold') ||
        code.includes('price_change_pct > 0') ||
        code.includes(`>= ${threshold}`)

      const hasBearishEntry =
        code.includes('<= -threshold') ||
        code.includes('<= -momentum_threshold') ||
        code.includes('bearish_signal') ||
        code.includes('price_change <= -threshold') ||
        code.includes('price_change_pct < 0') ||
        code.includes(`<= -${threshold}`)

      // 检测双向入场（同时有 long 和 short 入场）
      const hasBidirectionalEntry =
        code.includes('abs_change_pct >= momentum_threshold') ||
        (code.includes('OPEN_LONG') && code.includes('OPEN_SHORT'))

      if (hasBidirectionalEntry) {
        // 双向动量策略
        conditions.push({
          id: 'entry-long-mom',
          type: 'condition',
          direction: 'long',
          category: 'entry',
          triggerType: 'signal',
          conditions: [`Price change >= +${threshold}%`],
          description: `Bullish momentum entry (+${threshold}%)`,
        })
        conditions.push({
          id: 'entry-short-mom',
          type: 'condition',
          direction: 'short',
          category: 'entry',
          triggerType: 'signal',
          conditions: [`Price change <= -${threshold}%`],
          description: `Bearish momentum entry (-${threshold}%)`,
        })
      } else {
        if (hasBullishEntry) {
          conditions.push({
            id: 'entry-long-mom',
            type: 'condition',
            direction: 'long',
            category: 'entry',
            triggerType: 'signal',
            conditions: [`Price change >= +${threshold}%`],
            description: `Bullish momentum entry (+${threshold}%)`,
          })
        }
        if (hasBearishEntry) {
          conditions.push({
            id: 'entry-short-mom',
            type: 'condition',
            direction: 'short',
            category: 'entry',
            triggerType: 'signal',
            conditions: [`Price change <= -${threshold}%`],
            description: `Bearish momentum entry (-${threshold}%)`,
          })
        }
      }
    }

    // RSI 超卖入场策略 - 检测 RSI < threshold 的单向入场
    const hasRsiOversoldEntry =
      code.includes('rsi_oversold') ||
      code.includes('rsi < CONFIG["rsi_threshold"]') ||
      code.includes("rsi < CONFIG['rsi_threshold']") ||
      code.includes('RSI oversold') ||
      (code.includes('rsi <') && code.includes('rsi_threshold'))

    if (hasRsiOversoldEntry) {
      // 提取 RSI 阈值
      const rsiThresholdMatch = code.match(/["']rsi_threshold["']\s*:\s*(\d+)/)?.[1] ||
        code.match(/rsi\s*<\s*(\d+)/)?.[1]
      const rsiThreshold = rsiThresholdMatch || '30'

      conditions.push({
        id: 'entry-long-rsi-oversold',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: [`RSI < ${rsiThreshold} (oversold)`],
        description: `Long when RSI drops into oversold zone`,
      })
    }

    // RSI 超买入场策略（做空）- 检测 RSI > threshold 的单向入场
    const hasRsiOverboughtEntry =
      code.includes('rsi_overbought') ||
      code.includes('rsi > CONFIG["rsi_threshold"]') ||
      code.includes("rsi > CONFIG['rsi_threshold']") ||
      code.includes('RSI overbought')

    if (hasRsiOverboughtEntry && !hasRsiOversoldEntry) {
      const rsiThresholdMatch = code.match(/["']rsi_threshold["']\s*:\s*(\d+)/)?.[1] ||
        code.match(/rsi\s*>\s*(\d+)/)?.[1]
      const rsiThreshold = rsiThresholdMatch || '70'

      conditions.push({
        id: 'entry-short-rsi-overbought',
        type: 'condition',
        direction: 'short',
        category: 'entry',
        triggerType: 'signal',
        conditions: [`RSI > ${rsiThreshold} (overbought)`],
        description: `Short when RSI rises into overbought zone`,
      })
    }

    // RSI 区间策略 - 检测 RSI Oscillator 等基于 RSI 区间的双向策略
    const hasRsiZoneStrategy =
      code.includes('should_be_long') ||
      code.includes('should_be_short') ||
      code.includes('REVERSE_TO_SHORT') ||
      code.includes('REVERSE_TO_LONG') ||
      code.includes('rsi_reversal') ||
      (code.includes('rsi <=') && code.includes('rsi >'))

    if (hasRsiZoneStrategy && !hasRsiOversoldEntry && !hasRsiOverboughtEntry) {
      // 提取 RSI 阈值（默认 50 为分界点）
      const rsiThresholdMatch = code.match(/rsi\s*[<>=]+\s*(\d+)/)?.[1]
      const rsiThreshold = rsiThresholdMatch || '50'

      // RSI 区间入场
      conditions.push({
        id: 'entry-long-rsi-zone',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: [`RSI <= ${rsiThreshold} (oversold/neutral zone)`],
        description: `Long when RSI in oversold zone`,
      })

      conditions.push({
        id: 'entry-short-rsi-zone',
        type: 'condition',
        direction: 'short',
        category: 'entry',
        triggerType: 'signal',
        conditions: [`RSI > ${rsiThreshold} (overbought zone)`],
        description: `Short when RSI in overbought zone`,
      })
    }

    // RSI Crossover - 检测超卖/超买反弹
    const hasRsiCrossover =
      code.includes('oversold_crossover') ||
      code.includes('overbought_crossover') ||
      (code.includes('previous_rsi') && code.includes('current_rsi'))

    if (hasRsiCrossover && !hasRsiZoneStrategy) {
      // 提取 RSI 阈值
      const oversoldLevel = code.match(/rsi_oversold["\s:]*(\d+)/i)?.[1] || '30'
      const overboughtLevel = code.match(/rsi_overbought["\s:]*(\d+)/i)?.[1] || '70'

      // RSI 超卖反弹 -> Long
      if (code.includes('oversold_crossover') || code.includes('> 30') || code.includes(`> ${oversoldLevel}`)) {
        const entryConditions: string[] = [`RSI crosses above ${oversoldLevel}`]
        // 检测 volume 确认
        if (code.includes('volume_confirmed')) {
          entryConditions.push('Volume confirmation')
        }
        conditions.push({
          id: 'entry-long-rsi',
          type: 'condition',
          direction: 'long',
          category: 'entry',
          triggerType: 'crossover',
          conditions: entryConditions,
          description: `RSI oversold bounce (>${oversoldLevel})`,
        })
      }

      // RSI 超买反转 -> Short
      if (code.includes('overbought_crossover') || code.includes('< 70') || code.includes(`< ${overboughtLevel}`)) {
        const entryConditions: string[] = [`RSI crosses below ${overboughtLevel}`]
        if (code.includes('volume_confirmed')) {
          entryConditions.push('Volume confirmation')
        }
        conditions.push({
          id: 'entry-short-rsi',
          type: 'condition',
          direction: 'short',
          category: 'entry',
          triggerType: 'crossover',
          conditions: entryConditions,
          description: `RSI overbought reversal (<${overboughtLevel})`,
        })
      }
    }

    // Volume 确认作为独立条件 (用于 MA Scalp 等策略)
    if (code.includes('volume_confirmed') && !hasRsiCrossover && conditions.length > 0) {
      // 为已有的入场条件添加 volume 确认
      conditions.forEach((cond) => {
        if (cond.category === 'entry' && !cond.conditions.includes('Volume confirmation')) {
          cond.conditions.push('Volume > Average')
        }
      })
    }

    // RSI + MA + Volume 组合入场策略 (Momentum Wave Rider 类型)
    const hasRsiMaVolumeCombo =
      (code.includes('rsi_long_threshold') || code.includes('rsi_short_threshold')) &&
      (code.includes('ma20') || code.includes('sma') || code.includes('price > ma')) &&
      (code.includes('volume_multiplier') || code.includes('volume_ma') || code.includes('volume >'))

    if (hasRsiMaVolumeCombo) {
      // 提取 RSI 阈值
      const rsiLongThreshold = code.match(/["']rsi_long_threshold["']\s*:\s*(\d+)/)?.[1] || '60'
      const rsiShortThreshold = code.match(/["']rsi_short_threshold["']\s*:\s*(\d+)/)?.[1] || '40'
      // 提取 MA 周期
      const maPeriod = code.match(/["']ma_period["']\s*:\s*(\d+)/)?.[1] || '20'
      // 提取 Volume 乘数
      const volumeMultiplier = code.match(/["']volume_multiplier["']\s*:\s*([\d.]+)/)?.[1] || '1.5'

      // Long Entry: RSI > threshold + Price > MA + Volume
      conditions.push({
        id: 'entry-long-rsi-ma-vol',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: [
          `RSI > ${rsiLongThreshold}`,
          `Price > MA${maPeriod}`,
          `Volume > ${volumeMultiplier}x avg`,
        ],
        description: `Long when RSI strong + price above MA + high volume`,
      })

      // Short Entry: RSI < threshold + Price < MA + Volume
      conditions.push({
        id: 'entry-short-rsi-ma-vol',
        type: 'condition',
        direction: 'short',
        category: 'entry',
        triggerType: 'signal',
        conditions: [
          `RSI < ${rsiShortThreshold}`,
          `Price < MA${maPeriod}`,
          `Volume > ${volumeMultiplier}x avg`,
        ],
        description: `Short when RSI weak + price below MA + high volume`,
      })
    }

    // Momentum Breakout / MA Breakout 策略 - 检测价格突破 MA + 成交量确认模式
    const hasMaBreakout =
      code.includes('ma_breakout') ||
      code.includes('price_above_ma') ||
      code.includes('price_above_sma') ||
      (code.includes('current_price > sma') && code.includes('prev_price_above_ma'))

    const hasVolumeConfirmation =
      code.includes('volume_confirmation') ||
      code.includes('buy_volume_ratio') ||
      code.includes('mfi') // Money Flow Index

    const hasTrendStrength =
      code.includes('consecutive_rises') ||
      code.includes('trend_strength') ||
      code.includes('trend_confirmed')

    // 检测是否有明确的 buy action 在无持仓逻辑中
    const hasBuyAction =
      code.includes('"action": "buy"') ||
      code.includes("'action': 'buy'") ||
      code.includes('"action":"buy"')

    if (hasMaBreakout && (hasVolumeConfirmation || hasTrendStrength || hasBuyAction)) {
      const entryConditions: string[] = []

      // 提取 MA 周期
      const smaPeriodMatch = code.match(/sma[_\s]*(\d+)/i)
      const maPeriod = smaPeriodMatch ? smaPeriodMatch[1] : '24'

      entryConditions.push(`Price breaks above ${maPeriod}H MA`)

      if (code.includes('seven_day_high') || code.includes('above_7d_high') || code.includes('price_above_7d_high')) {
        entryConditions.push('Price > 7-day high')
      }

      if (hasVolumeConfirmation) {
        if (code.includes('buy_volume_ratio') || code.includes('mfi')) {
          entryConditions.push('Volume confirmation (MFI > 60)')
        } else {
          entryConditions.push('Volume confirmation')
        }
      }

      if (hasTrendStrength) {
        const risesMatch = code.match(/consecutive_rises\s*>=?\s*(\d+)/i)
        const rises = risesMatch ? risesMatch[1] : '3'
        entryConditions.push(`${rises}+ consecutive price rises`)
      }

      conditions.push({
        id: 'entry-long-breakout',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: entryConditions,
        description: 'Momentum breakout entry',
      })
    }
  }

  return conditions
}

/**
 * 提取出场条件
 */
function extractExitConditions(code: string, config: StrategyConfig): ConditionNode[] {
  const conditions: ConditionNode[] = []

  // Take Profit - 检查是否有实际的 TP 逻辑
  const hasTpLogic = code.includes('profit_target') || code.includes('Take profit') || /pnl_pct\s*>=/.test(code)
  if (config.take_profit && config.take_profit.trim() !== '') {
    conditions.push({
      id: 'exit-tp',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'take_profit',
      conditions: [`Profit >= ${config.take_profit}`],
      description: `Take Profit: ${config.take_profit}`,
    })
  } else if (hasTpLogic) {
    // 尝试从代码中提取具体数值
    const tpMatch = code.match(/pnl_pct\s*>=\s*(\d+\.?\d*)/)?.[1]
    const tpValue = tpMatch ? `+${tpMatch}%` : 'Dynamic'
    conditions.push({
      id: 'exit-tp',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'take_profit',
      conditions: [tpMatch ? `Profit >= ${tpValue}` : 'Profit target reached'],
      description: `Take Profit: ${tpValue}`,
    })
  }

  // Stop Loss - 检查是否有实际的 SL 逻辑
  const hasSlLogic = code.includes('Stop loss') || code.includes('stop_loss_price') || /pnl_pct\s*<=\s*-/.test(code)
  if (config.stop_loss && config.stop_loss.trim() !== '') {
    conditions.push({
      id: 'exit-sl',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'stop_loss',
      conditions: [`Loss >= ${config.stop_loss.replace('-', '')}`],
      description: `Stop Loss: ${config.stop_loss}`,
    })
  } else if (hasSlLogic) {
    // 尝试从代码中提取具体数值
    const slMatch = code.match(/pnl_pct\s*<=\s*-(\d+\.?\d*)/)?.[1]
    const slValue = slMatch ? `-${slMatch}%` : 'Dynamic'
    conditions.push({
      id: 'exit-sl',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'stop_loss',
      conditions: [slMatch ? `Loss >= ${slMatch}%` : 'Stop loss triggered'],
      description: `Stop Loss: ${slValue}`,
    })
  }

  // ============================================
  // K 线颜色退出条件 - 红蜡烛退出等
  // ============================================
  const hasRedCandleExit =
    code.includes('last_candle_red') ||
    code.includes('CLOSE_LONG') ||
    (code.includes('candle_colors[-1]') && code.includes('red'))

  // 检测是否是 K 线颜色策略
  const isCandleColorStrategy =
    code.includes('candle_colors') ||
    code.includes('consecutive_greens') ||
    code.includes('3_green') ||
    code.includes('3-green')

  if (hasRedCandleExit && isCandleColorStrategy) {
    conditions.push({
      id: 'exit-red-candle',
      type: 'condition',
      direction: 'long',
      category: 'exit',
      triggerType: 'indicator',
      conditions: ['First red candle (Close <= Open)'],
      description: 'Exit on red candle reversal',
    })
  }

  // 绿蜡烛退出（做空策略）
  const hasGreenCandleExit =
    code.includes('last_candle_green') ||
    code.includes('CLOSE_SHORT') ||
    (code.includes('candle_colors[-1]') && code.includes('green') && code.includes('SHORT'))

  const isShortCandleStrategy =
    code.includes('consecutive_reds') ||
    code.includes('3_red') ||
    code.includes('3-red')

  if (hasGreenCandleExit && isShortCandleStrategy) {
    conditions.push({
      id: 'exit-green-candle',
      type: 'condition',
      direction: 'short',
      category: 'exit',
      triggerType: 'indicator',
      conditions: ['First green candle (Close >= Open)'],
      description: 'Exit on green candle reversal',
    })
  }

  // Fibonacci break
  if (code.includes('fibonacci_break') || code.includes('triggered_fib_level')) {
    conditions.push({
      id: 'exit-fib-break',
      type: 'condition',
      direction: 'long',
      category: 'exit',
      triggerType: 'stop_loss',
      conditions: ['Price breaks below Fib level'],
      description: 'Fibonacci level break stop',
    })
  }

  // Contraction zone
  if (code.includes('contraction_zone')) {
    conditions.push({
      id: 'exit-zone',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'stop_loss',
      conditions: ['Price returns to contraction zone'],
      description: 'Dynamic zone stop',
    })
  }

  // Reverse signal - 检测各种关闭仓位的变体
  if (
    code.includes('reverse') ||
    code.includes('momentum_reversal') ||
    code.includes('momentum_reverse') ||
    code.includes('CLOSE_LONG_OPEN_SHORT') ||
    code.includes('CLOSE_SHORT_OPEN_LONG') ||
    code.includes('CLOSE_LONG') ||
    code.includes('CLOSE_SHORT')
  ) {
    // 提取具体的反转条件
    const reversalConditions: string[] = []

    // 动量策略 - 提取具体阈值（支持多种变量名）
    const hasMomentumReverse =
      code.includes('momentum_pct') ||
      code.includes('momentum_reversal') ||
      code.includes('momentum_reverse') ||
      code.includes('price_change_pct')

    if (hasMomentumReverse) {
      const thresholdMatch = code.match(/["']momentum_threshold["']\s*:\s*([\d.]+)/)?.[1] ||
        code.match(/momentum_pct\s*[<>=]+\s*-?([\d.]+)/)?.[1]
      const threshold = thresholdMatch || '0.5'

      // LONG 持仓的退出条件
      if (code.includes('CLOSE_LONG') || code.includes('CLOSE_LONG_OPEN_SHORT')) {
        reversalConditions.push(`LONG: Momentum <= -${threshold}%`)
      }
      // SHORT 持仓的退出条件
      if (code.includes('CLOSE_SHORT') || code.includes('CLOSE_SHORT_OPEN_LONG')) {
        reversalConditions.push(`SHORT: Momentum >= +${threshold}%`)
      }
      // 如果没有具体检测到，显示通用条件
      if (reversalConditions.length === 0) {
        reversalConditions.push(`Momentum reverses ±${threshold}%`)
      }
    }
    // MA 交叉策略
    else if (code.includes('golden_cross') || code.includes('death_cross')) {
      reversalConditions.push('LONG: Death cross (MA短 < MA长)')
      reversalConditions.push('SHORT: Golden cross (MA短 > MA长)')
    }
    // RSI 策略
    else if (code.includes('rsi') && (code.includes('oversold') || code.includes('overbought'))) {
      const oversoldLevel = code.match(/rsi_oversold["\s:]*(\d+)/i)?.[1] || '30'
      const overboughtLevel = code.match(/rsi_overbought["\s:]*(\d+)/i)?.[1] || '70'
      reversalConditions.push(`LONG: RSI < ${overboughtLevel} (overbought exit)`)
      reversalConditions.push(`SHORT: RSI > ${oversoldLevel} (oversold exit)`)
    }
    // 通用反转
    else {
      reversalConditions.push('Opposite entry signal triggered')
    }

    conditions.push({
      id: 'exit-reverse',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'reversal',
      conditions: reversalConditions,
      description: 'Exit on reversal signal',
    })
  }

  // RSI Crossover 退出 - 检测 RSI 反转信号
  if (code.includes('oversold_crossover') || code.includes('overbought_crossover')) {
    // 如果已经添加了 reversal 条件，不重复添加
    const hasReversalExit = conditions.some((c) => c.triggerType === 'reversal')
    if (!hasReversalExit) {
      conditions.push({
        id: 'exit-rsi-reverse',
        type: 'condition',
        direction: 'both',
        category: 'exit',
        triggerType: 'reversal',
        conditions: ['RSI reversal signal'],
        description: 'Exit on RSI crossover reversal',
      })
    }
  }

  // RSI + MA 组合退出条件 (Momentum Wave Rider 类型)
  const hasRsiMaExit =
    (code.includes('rsi_long_exit') || code.includes('rsi_short_exit')) &&
    (code.includes('price < ma') || code.includes('price > ma') || code.includes('should_exit'))

  if (hasRsiMaExit) {
    // 提取 RSI 退出阈值
    const rsiLongExit = code.match(/["']rsi_long_exit["']\s*:\s*(\d+)/)?.[1] || '50'
    const rsiShortExit = code.match(/["']rsi_short_exit["']\s*:\s*(\d+)/)?.[1] || '50'
    // 提取 MA 周期
    const maPeriod = code.match(/["']ma_period["']\s*:\s*(\d+)/)?.[1] || '20'

    // 检查是否已经添加了 reversal 条件
    const hasReversalExit = conditions.some((c) => c.triggerType === 'reversal')

    if (!hasReversalExit) {
      conditions.push({
        id: 'exit-rsi-ma-reversal',
        type: 'condition',
        direction: 'both',
        category: 'exit',
        triggerType: 'reversal',
        conditions: [
          `LONG: RSI < ${rsiLongExit} OR Price < MA${maPeriod}`,
          `SHORT: RSI > ${rsiShortExit} OR Price > MA${maPeriod}`,
        ],
        description: 'Exit on RSI/MA reversal',
      })
    }
  }

  // Fibonacci 退出 - 检测 profit target (如 entry_price * 1.05)
  if (code.includes('entry_price * 1.') || code.includes('target_price')) {
    const tpMultMatch = code.match(/entry_price\s*\*\s*1\.(\d+)/)?.[1]
    const tpPct = tpMultMatch ? `+${parseInt(tpMultMatch)}%` : '+5%'
    // 避免重复添加 TP 条件
    const hasTpExit = conditions.some((c) => c.triggerType === 'take_profit')
    if (!hasTpExit) {
      conditions.push({
        id: 'exit-fib-tp',
        type: 'condition',
        direction: 'long',
        category: 'exit',
        triggerType: 'take_profit',
        conditions: [`Price >= Entry × 1.${tpMultMatch || '05'}`],
        description: `Take Profit: ${tpPct}`,
      })
    }
  }

  // 检测 max_roe_loss 风控退出
  if (code.includes('max_roe_loss') || code.includes('roe_loss')) {
    const roeLossMatch = code.match(/max_roe_loss["\s:]*-?([\d.]+)/i)?.[1]
    conditions.push({
      id: 'exit-roe-limit',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'stop_loss',
      conditions: [`ROE Loss >= ${roeLossMatch ? `${parseFloat(roeLossMatch) * 100}%` : '80%'}`],
      description: 'Hard stop on ROE loss',
    })
  }

  // MA Breakdown 退出 - 价格跌破 MA (技术指标触发，非传统止损)
  const hasMaBreakdown =
    code.includes('MA_BREAKDOWN') ||
    code.includes('ma_breakdown') ||
    (code.includes('price_above_ma') && code.includes('not price_above_ma')) ||
    (code.includes('prev_price_above_ma') && code.includes('not price_above_ma'))

  if (hasMaBreakdown) {
    const smaPeriodMatch = code.match(/sma[_\s]*(\d+)/i)
    const maPeriod = smaPeriodMatch ? smaPeriodMatch[1] : '24'
    conditions.push({
      id: 'exit-ma-breakdown',
      type: 'condition',
      direction: 'long',
      category: 'exit',
      triggerType: 'indicator',
      conditions: [`Price drops below ${maPeriod}H MA`],
      description: `MA Breakdown: Price < ${maPeriod}H SMA`,
    })
  }

  // Volume Weakness 退出 - 成交量/买盘力度减弱 (技术指标触发，非传统止损)
  const hasVolumeWeakness =
    code.includes('VOLUME_WEAKNESS') ||
    code.includes('volume_weakness') ||
    code.includes('buy_volume_ratio < 0.4') ||
    (code.includes('buy_volume_ratio') && code.includes('< 0.4'))

  if (hasVolumeWeakness) {
    conditions.push({
      id: 'exit-volume-weakness',
      type: 'condition',
      direction: 'long',
      category: 'exit',
      triggerType: 'indicator',
      conditions: ['Buy volume ratio < 0.4'],
      description: 'Weak buying pressure exit',
    })
  }

  return conditions
}

/**
 * 检测新版代码格式 - K线模式分析
 * 支持连续绿/红线、K线形态等模式
 */
function extractCandlePattern(code: string, docstring: string): CandlePatternInfo | undefined {
  // 检测连续绿线模式 (如 3-green momentum)
  const consecutiveGreenMatch = code.match(/consecutive_greens?\s*>=?\s*(\d+)/i) ||
    code.match(/(\d+)\s*consecutive\s*green/i) ||
    docstring.match(/(\d+)\s*consecutive\s*green/i) ||
    code.match(/last_(\d+)_candles_green/i)

  if (consecutiveGreenMatch) {
    const count = parseInt(consecutiveGreenMatch[1])
    return {
      type: 'consecutive_color',
      name: `${count}-Green Momentum`,
      description: `${count} consecutive green candles (Close > Open)`,
      requiredCandles: count,
      colorPattern: Array(count).fill('green') as ('green' | 'red')[],
      entryCondition: `Last ${count} candles are ALL green`,
      exitCondition: 'First red candle (Close <= Open)',
    }
  }

  // 检测连续红线模式
  const consecutiveRedMatch = code.match(/consecutive_reds?\s*>=?\s*(\d+)/i) ||
    code.match(/(\d+)\s*consecutive\s*red/i) ||
    docstring.match(/(\d+)\s*consecutive\s*red/i)

  if (consecutiveRedMatch) {
    const count = parseInt(consecutiveRedMatch[1])
    return {
      type: 'consecutive_color',
      name: `${count}-Red Reversal`,
      description: `${count} consecutive red candles (Close < Open)`,
      requiredCandles: count,
      colorPattern: Array(count).fill('red') as ('green' | 'red')[],
      entryCondition: `Last ${count} candles are ALL red`,
      exitCondition: 'First green candle (Close >= Open)',
    }
  }

  // 检测 candle_colors 分析模式
  if (code.includes('candle_colors') || code.includes('candle["close"] > candle["open"]')) {
    // 尝试从 docstring 提取更多信息
    const entryMatch = docstring.match(/Entry[:\s]*(.*?)(?=Exit|$)/i)?.[1]?.trim()
    const exitMatch = docstring.match(/Exit[:\s]*(.*?)(?=Timeframe|Data|$)/i)?.[1]?.trim()

    return {
      type: 'pattern',
      name: 'Candle Color Pattern',
      description: 'Strategy based on candle color analysis',
      requiredCandles: 3,
      entryCondition: entryMatch || 'Specific candle color pattern',
      exitCondition: exitMatch || 'Reversal candle detected',
    }
  }

  return undefined
}

/**
 * 检测新版代码格式 - 状态管理配置
 */
function extractStateManagement(code: string): StateManagementInfo | undefined {
  // 检测 state 使用
  const hasState = code.includes('state = state or {}') ||
    code.includes('state.get(') ||
    code.includes('"state":') ||
    code.includes('needs_state_reset')

  if (!hasState) return undefined

  const fields: string[] = []

  // 提取状态字段
  if (code.includes('had_3_greens') || code.includes('"had_3_greens"')) {
    fields.push('had_3_greens')
  }
  if (code.includes('candle_colors') || code.includes('"candle_colors"')) {
    fields.push('candle_colors')
  }
  if (code.includes('consecutive_greens') || code.includes('"consecutive_greens"')) {
    fields.push('consecutive_greens')
  }
  if (code.includes('consecutive_reds') || code.includes('"consecutive_reds"')) {
    fields.push('consecutive_reds')
  }
  if (code.includes('last_signal') || code.includes('"last_signal"')) {
    fields.push('last_signal')
  }
  if (code.includes('entry_candle') || code.includes('"entry_candle"')) {
    fields.push('entry_candle')
  }
  if (code.includes('used_levels') || code.includes('"used_levels"')) {
    fields.push('used_levels')
  }

  // 提取 reset_trigger
  const resetTriggerMatch = code.match(/"reset_trigger":\s*"([^"]+)"/)?.[1]

  return {
    needsState: true,
    fields: fields.length > 0 ? fields : ['state'],
    resetTrigger: resetTriggerMatch,
  }
}

/**
 * 提取数据层计算 - 新版代码格式
 */
function extractCalculations(code: string, docstring: string): string[] {
  const calculations: string[] = []

  // 从 docstring 提取
  if (docstring.includes('candle')) {
    const candleMatch = docstring.match(/last\s*(\d+).*?candle/i)
    if (candleMatch) {
      calculations.push(`Last ${candleMatch[1]} candles: Close vs Open comparison`)
    }
  }

  // 从代码提取计算逻辑
  if (code.includes('candle["close"] > candle["open"]')) {
    calculations.push('Candle color determination (green/red)')
  }
  if (code.includes('consecutive_greens') || code.includes('consecutive greens')) {
    calculations.push('Consecutive green candle count')
  }
  if (code.includes('last_candle_red')) {
    calculations.push('Last candle color check')
  }
  if (code.includes('proximity')) {
    calculations.push('Signal proximity calculation')
  }

  return calculations
}

/**
 * 提取分析步骤 - 从 analyze 函数中提取数据处理逻辑
 * 支持新旧两种代码格式
 */
function extractAnalyzeSteps(code: string, docstring: string): AnalyzeStep[] {
  const steps: AnalyzeStep[] = []

  // 1. 数据提取步骤
  if (code.includes('current_price') || code.includes('data.get')) {
    steps.push({
      id: 'step-extract',
      label: 'Extract Data',
      description: 'Get price and indicator values from fetched data',
    })
  }

  // ============================================
  // 新版代码格式 - K线模式分析步骤
  // ============================================

  // K线数据获取 (新版格式)
  if (code.includes('last_3_candles') || code.includes('kline_resp') || code.includes('ohlcv')) {
    steps.push({
      id: 'step-fetch-candles',
      label: 'Fetch Candle Data',
      description: 'Get OHLCV candles from exchange API',
    })
  }

  // K线颜色分析 (新版格式)
  if (code.includes('candle_colors') || code.includes('candle["close"] > candle["open"]')) {
    steps.push({
      id: 'step-analyze-colors',
      label: 'Analyze Candle Colors',
      description: 'Determine if candles are green (Close > Open) or red',
    })
  }

  // 连续绿线计数 (新版格式)
  if (code.includes('consecutive_greens') || code.includes('consecutive green')) {
    const countMatch = code.match(/consecutive_greens?\s*>=?\s*(\d+)/i) || docstring.match(/(\d+)\s*consecutive/i)
    const count = countMatch ? countMatch[1] : '3'
    steps.push({
      id: 'step-count-greens',
      label: 'Count Consecutive Greens',
      description: `Track consecutive green candles (target: ${count})`,
    })
  }

  // 连续红线计数 (新版格式)
  if (code.includes('consecutive_reds') || code.includes('consecutive red')) {
    steps.push({
      id: 'step-count-reds',
      label: 'Count Consecutive Reds',
      description: 'Track consecutive red candles',
    })
  }

  // Proximity 计算 (新版格式)
  if (code.includes('proximity =') || code.includes('"proximity":')) {
    steps.push({
      id: 'step-calc-proximity',
      label: 'Calculate Proximity',
      description: 'Determine signal proximity (0.0-1.0) for adaptive polling',
    })
  }

  // 状态更新 (新版格式)
  if (code.includes('"state":') && (code.includes('had_3_greens') || code.includes('candle_colors'))) {
    steps.push({
      id: 'step-update-state',
      label: 'Update State',
      description: 'Persist candle analysis state between polls',
    })
  }

  // ============================================
  // 旧版代码格式 - 保持向下兼容
  // ============================================

  // 2. 计算步骤 - 根据策略类型
  if (code.includes('momentum_pct') || code.includes('price_change_pct') || code.includes('price_change_percent')) {
    // 尝试提取具体阈值
    const thresholdMatch = code.match(/["'](?:momentum_threshold|threshold_percent)["']\s*:\s*([\d.]+)/)?.[1]
    const threshold = thresholdMatch ? `${thresholdMatch}%` : '0.5%'
    steps.push({
      id: 'step-calc-momentum',
      label: 'Calculate Momentum',
      description: `Compute price change % (threshold: ±${threshold})`,
    })
  }

  // ROC (Rate of Change) 指标
  if (code.includes('"roc"') || code.includes('rate of change') || code.includes('roc_data')) {
    steps.push({
      id: 'step-calc-roc',
      label: 'Calculate ROC',
      description: 'Get rate of change (price momentum) from TAAPI',
    })
  }

  // 信号方向判断
  if (code.includes('bullish_signal') && code.includes('bearish_signal')) {
    steps.push({
      id: 'step-signal-direction',
      label: 'Determine Signal Direction',
      description: 'Check if bullish (buy) or bearish (sell) signal',
    })
  }

  // MA 比较 - 支持各种 MA 周期组合
  const maMatches = code.match(/ma(\d+)/g) || []
  const maPeriods = [...new Set(maMatches.map((m) => parseInt(m.replace('ma', ''))))].sort((a, b) => a - b)
  if (maPeriods.length >= 2) {
    steps.push({
      id: 'step-calc-ma',
      label: 'Compare MAs',
      description: `Check MA${maPeriods[0]} vs MA${maPeriods[1]} relationship`,
    })
  } else if (code.includes('ma5') && code.includes('ma10')) {
    steps.push({
      id: 'step-calc-ma',
      label: 'Compare MAs',
      description: 'Check MA5 vs MA10 relationship',
    })
  }

  // RSI 计算和 crossover 检测
  if (code.includes('current_rsi') || code.includes('previous_rsi')) {
    const oversoldLevel = code.match(/rsi_oversold["\s:]*(\d+)/i)?.[1] || '30'
    const overboughtLevel = code.match(/rsi_overbought["\s:]*(\d+)/i)?.[1] || '70'
    steps.push({
      id: 'step-calc-rsi',
      label: 'RSI Crossover Detection',
      description: `Monitor RSI crossing ${oversoldLevel}/${overboughtLevel} levels`,
    })
  }

  // Fibonacci 步骤 - 增强检测
  if (code.includes('fibonacci') || code.includes('fib_level') || code.includes('calculate_fibonacci')) {
    steps.push({
      id: 'step-calc-fib',
      label: 'Check Fib Levels',
      description: 'Compare price to Fibonacci retracement levels',
    })
  }

  // Fibonacci 状态管理 (used_levels) - 只在 Fibonacci 策略中添加
  // 注意：triggered_level 作为输出字段名在其他策略中也可能出现，需要更精确检测
  const isFibonacciStrategy = code.includes('fibonacci') || code.includes('fib_level') || code.includes('calculate_fibonacci')
  if (isFibonacciStrategy && (code.includes('used_levels') || code.includes('state["triggered_level"]') || code.includes('state.get("triggered_level")'))) {
    steps.push({
      id: 'step-fib-state',
      label: 'Track Used Levels',
      description: 'Manage which Fib levels have been triggered',
    })
  }

  // Swing 检测 (new_swing_detected)
  if (code.includes('new_swing') || code.includes('swing_high') || code.includes('swing_low')) {
    steps.push({
      id: 'step-swing-detect',
      label: 'Detect New Swing',
      description: 'Check for new weekly high/low range',
    })
  }

  // Volume 确认
  if (code.includes('volume_confirmed') || (code.includes('current_volume') && code.includes('avg_volume'))) {
    steps.push({
      id: 'step-volume-check',
      label: 'Volume Confirmation',
      description: 'Verify current volume exceeds average',
    })
  }

  // Cross-Asset 信号映射
  const signalSymbol = code.match(/"signal_symbol":\s*"([^"]+)"/)?.[1]
  const tradingSymbol = code.match(/"trading_symbol":\s*"([^"]+)"/)?.[1]
  if (signalSymbol && tradingSymbol && signalSymbol !== tradingSymbol) {
    const signalAsset = signalSymbol.replace(/PERP_|_USDC/g, '')
    const tradingAsset = tradingSymbol.replace(/PERP_|_USDC/g, '')
    steps.push({
      id: 'step-cross-asset',
      label: 'Cross-Asset Signal',
      description: `Map ${signalAsset} signal to ${tradingAsset} trade`,
    })
  }

  if (code.includes('pnl_pct')) {
    steps.push({
      id: 'step-calc-pnl',
      label: 'Calculate PnL',
      description: 'Compute profit/loss percentage from entry',
    })
  }

  // 3. Proximity 计算 - 避免重复添加
  const hasProximityStep = steps.some((s) => s.id === 'step-calc-proximity')
  if (!hasProximityStep && code.includes('proximity')) {
    steps.push({
      id: 'step-calc-proximity',
      label: 'Calculate Proximity',
      description: 'Determine how close to trigger threshold',
    })
  }

  // 如果没有提取到步骤，添加默认步骤
  if (steps.length === 0) {
    steps.push({
      id: 'step-analyze',
      label: 'Analyze Market',
      description: 'Process market data and indicators',
    })
  }

  return steps
}

/**
 * 提取决策逻辑 - 从 analyze 函数中提取分支逻辑
 * 支持新旧两种代码格式
 */
function extractDecisionLogic(
  code: string,
  config: StrategyConfig,
): {
  hasPosition: DecisionBranch[]
  noPosition: DecisionBranch[]
} {
  const hasPosition: DecisionBranch[] = []
  const noPosition: DecisionBranch[] = []

  // ============================================
  // 新版代码格式 - K线模式决策逻辑
  // ============================================

  // 检测 K 线模式入场逻辑 (3-green momentum 等)
  const hasGreenMomentum =
    code.includes('current_has_3_greens') ||
    code.includes('consecutive_greens >= 3') ||
    code.includes('consecutive_greens >=') ||
    code.includes('3 consecutive green') ||
    code.includes('3_green') ||
    code.includes('3-green') ||
    (code.includes('OPEN_LONG') && code.includes('candle_colors'))

  if (hasGreenMomentum) {
    // 提取连续绿线数量
    const countMatch = code.match(/consecutive_greens?\s*>=?\s*(\d+)/i) ||
      code.match(/(\d+)[_-]?green/i)
    const count = countMatch ? countMatch[1] : '3'

    noPosition.push({
      condition: `${count} consecutive green candles`,
      action: 'BUY',
      description: `Open long on ${count}-green momentum signal`,
    })
  }

  // 检测红线模式入场（做空）
  const hasRedMomentum =
    code.includes('current_has_3_reds') ||
    code.includes('consecutive_reds >= 3') ||
    code.includes('consecutive_reds >=') ||
    code.includes('3 consecutive red') ||
    code.includes('3_red') ||
    code.includes('3-red')

  if (hasRedMomentum) {
    const countMatch = code.match(/consecutive_reds?\s*>=?\s*(\d+)/i) ||
      code.match(/(\d+)[_-]?red/i)
    const count = countMatch ? countMatch[1] : '3'

    noPosition.push({
      condition: `${count} consecutive red candles`,
      action: 'SELL',
      description: `Open short on ${count}-red reversal signal`,
    })
  }

  // 检测红线退出逻辑
  const hasRedExit =
    code.includes('last_candle_red') ||
    code.includes('candle_colors[-1] == "red"') ||
    code.includes('red candle') ||
    (code.includes('CLOSE_LONG') && code.includes('candle'))

  // 检测持仓变量的各种格式
  const hasLongPosition =
    code.includes('position == "LONG"') ||
    code.includes("position == 'LONG'") ||
    code.includes('current_position == "long"') ||
    code.includes("current_position == 'long'") ||
    code.includes('current_position_side == "BUY"')

  const hasShortPosition =
    code.includes('position == "SHORT"') ||
    code.includes("position == 'SHORT'") ||
    code.includes('current_position == "short"') ||
    code.includes("current_position == 'short'") ||
    code.includes('current_position_side == "SELL"')

  // 新版格式 - LONG 持仓退出 (红线退出)
  if (hasLongPosition && hasRedExit) {
    hasPosition.push({
      condition: 'LONG + Red candle detected',
      action: 'SELL',
      description: 'Exit long on first red candle',
    })
  }

  // Momentum Breakout 策略 - LONG 持仓退出条件
  const hasMaBreakdownExit =
    code.includes('MA_BREAKDOWN') ||
    code.includes('ma_breakdown') ||
    (code.includes('prev_price_above_ma') && code.includes('not price_above_ma'))

  const hasVolumeWeaknessExit =
    code.includes('VOLUME_WEAKNESS') ||
    code.includes('volume_weakness') ||
    code.includes('buy_volume_ratio < 0.4')

  if (hasLongPosition && hasMaBreakdownExit) {
    hasPosition.push({
      condition: 'LONG + Price < MA',
      action: 'SELL',
      description: 'Exit long on MA breakdown',
    })
  }

  if (hasLongPosition && hasVolumeWeaknessExit) {
    hasPosition.push({
      condition: 'LONG + Weak volume',
      action: 'SELL',
      description: 'Exit long on volume weakness',
    })
  }

  // 新版格式 - SHORT 持仓退出 (绿线入场覆盖)
  if (hasShortPosition && hasGreenMomentum) {
    hasPosition.push({
      condition: 'SHORT + Green momentum signal',
      action: 'BUY',
      description: 'Cover short on bullish momentum',
    })
  }

  // 从代码中提取持仓时的决策逻辑
  // Long position exit
  if (hasLongPosition) {
    // Check for TP
    if (code.includes('pnl_pct >=') || code.includes('profit_target') || code.includes('target_price')) {
      const tpMatch = code.match(/pnl_pct\s*>=\s*(\d+\.?\d*)/)?.[1]
      // 也检测 entry_price * 1.05 格式
      const tpMultMatch = code.match(/entry_price\s*\*\s*1\.(\d+)/)?.[1]
      const tpValue = tpMatch ? `${tpMatch}%` : tpMultMatch ? `${parseInt(tpMultMatch)}%` : 'target'
      hasPosition.push({
        condition: `LONG + Profit ≥ ${tpValue}`,
        action: 'SELL',
        description: 'Take profit on long position',
      })
    }
    // Check for SL
    if (code.includes('pnl_pct <=') || code.includes('stop_loss')) {
      const slMatch = code.match(/pnl_pct\s*<=\s*-(\d+\.?\d*)/)?.[1]
      hasPosition.push({
        condition: `LONG + Loss ≥ ${slMatch ? `${slMatch}%` : 'limit'}`,
        action: 'SELL',
        description: 'Stop loss on long position',
      })
    }
    // Check for reversal - 各种模式
    if (
      code.includes('momentum_pct <= -') ||
      code.includes('CLOSE_LONG') ||
      code.includes('death_cross') ||
      code.includes('overbought_crossover') ||
      code.includes('REVERSE_TO_SHORT') ||
      code.includes('should_be_short')
    ) {
      hasPosition.push({
        condition: 'LONG + Bearish signal',
        action: 'SELL',
        description: 'Close long on reversal',
      })
    }
  }

  // Short position exit
  if (hasShortPosition) {
    // Check for TP
    if (code.includes('pnl_pct >=') || code.includes('profit_target')) {
      const tpMatch = code.match(/pnl_pct\s*>=\s*(\d+\.?\d*)/)?.[1]
      hasPosition.push({
        condition: `SHORT + Profit ≥ ${tpMatch ? `${tpMatch}%` : 'target'}`,
        action: 'BUY',
        description: 'Take profit on short position',
      })
    }
    // Check for SL
    if (code.includes('pnl_pct <=') || code.includes('stop_loss')) {
      const slMatch = code.match(/pnl_pct\s*<=\s*-(\d+\.?\d*)/)?.[1]
      hasPosition.push({
        condition: `SHORT + Loss ≥ ${slMatch ? `${slMatch}%` : 'limit'}`,
        action: 'BUY',
        description: 'Stop loss on short position',
      })
    }
    // Check for reversal
    if (
      code.includes('momentum_pct >=') ||
      code.includes('CLOSE_SHORT') ||
      code.includes('golden_cross') ||
      code.includes('oversold_crossover') ||
      code.includes('REVERSE_TO_LONG') ||
      code.includes('should_be_long')
    ) {
      hasPosition.push({
        condition: 'SHORT + Bullish signal',
        action: 'BUY',
        description: 'Close short on reversal',
      })
    }
  }

  // 无持仓时的入场逻辑

  // RSI 超卖入场策略
  const hasRsiOversoldEntry =
    code.includes('rsi_oversold') ||
    code.includes('rsi < CONFIG["rsi_threshold"]') ||
    code.includes("rsi < CONFIG['rsi_threshold']") ||
    code.includes('RSI oversold') ||
    (code.includes('rsi <') && code.includes('rsi_threshold') && !code.includes('should_be_short'))

  if (hasRsiOversoldEntry) {
    const rsiThresholdMatch = code.match(/["']rsi_threshold["']\s*:\s*(\d+)/)?.[1] ||
      code.match(/rsi\s*<\s*(\d+)/)?.[1]
    const rsiThreshold = rsiThresholdMatch || '30'

    noPosition.push({
      condition: `RSI < ${rsiThreshold}`,
      action: 'BUY',
      description: 'Open long when RSI oversold',
    })
  }

  // RSI 超买入场策略（做空）
  const hasRsiOverboughtEntry =
    code.includes('rsi_overbought') ||
    code.includes('rsi > CONFIG["rsi_threshold"]') ||
    code.includes("rsi > CONFIG['rsi_threshold']") ||
    code.includes('RSI overbought')

  if (hasRsiOverboughtEntry && !hasRsiOversoldEntry) {
    const rsiThresholdMatch = code.match(/["']rsi_threshold["']\s*:\s*(\d+)/)?.[1] ||
      code.match(/rsi\s*>\s*(\d+)/)?.[1]
    const rsiThreshold = rsiThresholdMatch || '70'

    noPosition.push({
      condition: `RSI > ${rsiThreshold}`,
      action: 'SELL',
      description: 'Open short when RSI overbought',
    })
  }

  // RSI 区间双向策略入场逻辑
  const hasRsiZoneEntry =
    code.includes('should_be_long') ||
    code.includes('should_be_short') ||
    code.includes('REVERSE_TO_SHORT') ||
    code.includes('REVERSE_TO_LONG') ||
    code.includes('rsi_reversal')

  if (hasRsiZoneEntry && !hasRsiOversoldEntry && !hasRsiOverboughtEntry) {
    // 提取 RSI 阈值
    const rsiThresholdMatch = code.match(/rsi\s*[<>=]+\s*(\d+)/)?.[1]
    const rsiThreshold = rsiThresholdMatch || '50'

    noPosition.push({
      condition: `RSI <= ${rsiThreshold}`,
      action: 'BUY',
      description: 'Open long in oversold/neutral zone',
    })
    noPosition.push({
      condition: `RSI > ${rsiThreshold}`,
      action: 'SELL',
      description: 'Open short in overbought zone',
    })
  }

  // RSI + MA + Volume 组合策略入场 (Momentum Wave Rider 类型)
  const hasRsiMaVolumeEntry =
    (code.includes('rsi_long_threshold') || code.includes('rsi_short_threshold')) &&
    (code.includes('ma20') || code.includes('price > ma') || code.includes('price < ma')) &&
    (code.includes('volume_multiplier') || code.includes('volume_ma') || code.includes('volume >'))

  if (hasRsiMaVolumeEntry) {
    const rsiLongThreshold = code.match(/["']rsi_long_threshold["']\s*:\s*(\d+)/)?.[1] || '60'
    const rsiShortThreshold = code.match(/["']rsi_short_threshold["']\s*:\s*(\d+)/)?.[1] || '40'
    const volumeMultiplier = code.match(/["']volume_multiplier["']\s*:\s*([\d.]+)/)?.[1] || '1.5'

    noPosition.push({
      condition: `RSI > ${rsiLongThreshold} + Price > MA + Vol > ${volumeMultiplier}x`,
      action: 'BUY',
      description: 'Open long on momentum confirmation',
    })
    noPosition.push({
      condition: `RSI < ${rsiShortThreshold} + Price < MA + Vol > ${volumeMultiplier}x`,
      action: 'SELL',
      description: 'Open short on weakness confirmation',
    })
  }

  // RSI + MA 组合策略退出
  const hasRsiMaExit =
    (code.includes('rsi_long_exit') || code.includes('rsi_short_exit')) &&
    (code.includes('should_exit') || code.includes('price < ma') || code.includes('price > ma'))

  if (hasRsiMaExit && hasLongPosition) {
    const rsiLongExit = code.match(/["']rsi_long_exit["']\s*:\s*(\d+)/)?.[1] || '50'
    hasPosition.push({
      condition: `LONG + (RSI < ${rsiLongExit} OR Price < MA)`,
      action: 'SELL',
      description: 'Exit long on weakness signal',
    })
  }

  if (hasRsiMaExit && hasShortPosition) {
    const rsiShortExit = code.match(/["']rsi_short_exit["']\s*:\s*(\d+)/)?.[1] || '50'
    hasPosition.push({
      condition: `SHORT + (RSI > ${rsiShortExit} OR Price > MA)`,
      action: 'BUY',
      description: 'Exit short on strength signal',
    })
  }

  // Momentum strategy - 多种检测模式
  const hasMomentumEntry =
    code.includes('momentum_pct >= threshold') ||
    code.includes('momentum_pct >=') ||
    code.includes('abs_change_pct >= momentum_threshold') ||
    code.includes('OPEN_LONG') ||
    code.includes('price_change_pct > 0')

  const hasMomentumShortEntry =
    code.includes('momentum_pct <= -threshold') ||
    code.includes('momentum_pct <= -') ||
    code.includes('OPEN_SHORT') ||
    code.includes('price_change_pct < 0')

  const thresholdMatch = code.match(/["']momentum_threshold["']\s*:\s*([\d.]+)/)?.[1]
  const threshold = thresholdMatch || '0.5'

  // 只有在没有 RSI 区间策略时才添加动量入场
  if (hasMomentumEntry && !hasRsiZoneEntry && !hasRsiMaVolumeEntry) {
    noPosition.push({
      condition: `Momentum ≥ +${threshold}%`,
      action: 'BUY',
      description: 'Open long on bullish momentum',
    })
  }
  if (hasMomentumShortEntry && !hasRsiZoneEntry && !hasRsiMaVolumeEntry) {
    noPosition.push({
      condition: `Momentum ≤ -${threshold}%`,
      action: 'SELL',
      description: 'Open short on bearish momentum',
    })
  }

  // MA Crossover - 增强检测
  if (
    code.includes('golden_cross') ||
    (code.includes('ma5_above_ma10') && code.includes('not prev')) ||
    (code.includes('prev_ma5_above_ma10') && !code.includes('and prev_ma5_above_ma10'))
  ) {
    // 提取 MA 周期
    const maMatches = code.match(/ma(\d+)/g) || []
    const maPeriods = [...new Set(maMatches.map((m) => parseInt(m.replace('ma', ''))))].sort((a, b) => a - b)
    const shortPeriod = maPeriods[0] || 5
    const longPeriod = maPeriods[1] || 10
    noPosition.push({
      condition: `MA${shortPeriod} crosses above MA${longPeriod}`,
      action: 'BUY',
      description: 'Open long on golden cross',
    })
  }
  if (
    code.includes('death_cross') ||
    (code.includes('not ma5_above_ma10') && code.includes('prev')) ||
    (code.includes('prev_ma5_above_ma10') && code.includes('and not'))
  ) {
    const maMatches = code.match(/ma(\d+)/g) || []
    const maPeriods = [...new Set(maMatches.map((m) => parseInt(m.replace('ma', ''))))].sort((a, b) => a - b)
    const shortPeriod = maPeriods[0] || 5
    const longPeriod = maPeriods[1] || 10
    noPosition.push({
      condition: `MA${shortPeriod} crosses below MA${longPeriod}`,
      action: 'SELL',
      description: 'Open short on death cross',
    })
  }

  // RSI Crossover 入场逻辑
  if (code.includes('oversold_crossover')) {
    const oversoldLevel = code.match(/rsi_oversold["\s:]*(\d+)/i)?.[1] || '30'
    noPosition.push({
      condition: `RSI crosses above ${oversoldLevel}`,
      action: 'BUY',
      description: 'Open long on oversold bounce',
    })
  }
  if (code.includes('overbought_crossover')) {
    const overboughtLevel = code.match(/rsi_overbought["\s:]*(\d+)/i)?.[1] || '70'
    noPosition.push({
      condition: `RSI crosses below ${overboughtLevel}`,
      action: 'SELL',
      description: 'Open short on overbought reversal',
    })
  }

  // Fibonacci
  if (code.includes('triggered_level') && (code.includes('fib') || code.includes('fibonacci'))) {
    // 提取使用的 Fib 级别
    const fibLevels: string[] = []
    if (code.includes('38.2%')) fibLevels.push('38.2%')
    if (code.includes('50.0%') || code.includes('50%')) fibLevels.push('50%')
    if (code.includes('61.8%')) fibLevels.push('61.8%')
    noPosition.push({
      condition: `Price touches Fib level (${fibLevels.join(', ') || '38.2%, 50%, 61.8%'})`,
      action: 'BUY',
      description: 'Enter long at Fibonacci support',
    })
  }

  // Momentum Breakout 策略入场 - MA 突破 + 成交量确认 + 趋势强度
  const hasMaBreakoutEntry =
    code.includes('ma_breakout') ||
    (code.includes('price_above_ma') && code.includes('prev_price_above_ma'))

  const hasBreakoutVolumeConfirm =
    code.includes('volume_confirmation') ||
    code.includes('buy_volume_ratio > 0.6') ||
    code.includes('volume_confirmed')

  const hasBreakoutTrendConfirm =
    code.includes('trend_strength') ||
    code.includes('trend_confirmed') ||
    code.includes('consecutive_rises >= 3')

  if (hasMaBreakoutEntry && (hasBreakoutVolumeConfirm || hasBreakoutTrendConfirm)) {
    const entryDesc: string[] = ['MA breakout']
    if (code.includes('seven_day_high') || code.includes('above_7d_high')) {
      entryDesc.push('7D high')
    }
    if (hasBreakoutVolumeConfirm) {
      entryDesc.push('volume')
    }
    if (hasBreakoutTrendConfirm) {
      entryDesc.push('momentum')
    }
    noPosition.push({
      condition: entryDesc.join(' + '),
      action: 'BUY',
      description: 'Open long on momentum breakout',
    })
  }

  // 检测 CLOSE_LONG_OPEN_SHORT 和 CLOSE_SHORT_OPEN_LONG 反转逻辑
  if (code.includes('CLOSE_LONG_OPEN_SHORT')) {
    hasPosition.push({
      condition: 'LONG + Reverse signal',
      action: 'CLOSE → SHORT',
      description: 'Close long and open short on reversal',
    })
  }
  if (code.includes('CLOSE_SHORT_OPEN_LONG')) {
    hasPosition.push({
      condition: 'SHORT + Reverse signal',
      action: 'CLOSE → LONG',
      description: 'Close short and open long on reversal',
    })
  }

  // 如果没有提取到，添加默认逻辑
  if (hasPosition.length === 0) {
    hasPosition.push({
      condition: 'Exit condition met',
      action: 'CLOSE',
      description: 'Close existing position',
    })
  }
  if (noPosition.length === 0) {
    noPosition.push({
      condition: 'Entry signal triggered',
      action: 'OPEN',
      description: 'Open new position',
    })
  }

  return { hasPosition, noPosition }
}

/**
 * 主解析函数
 */
export function parseStrategyCode(code: string): ParsedStrategy | null {
  if (!code || typeof code !== 'string') return null

  try {
    const docstring = extractDocstring(code)
    const config = extractConfig(code)
    const strategyType = inferStrategyType(code)
    const dataSources = extractDataSources(code)
    const indicators = extractIndicators(code)
    const entryConditions = extractEntryConditions(code, docstring)
    const exitConditions = extractExitConditions(code, config)

    // 提取仓位大小 - 支持对称和非对称配置
    const posSizeMatch = code.match(/"position_size_pct"\s*:\s*([\d.]+)/)?.[1]
    const posSize = posSizeMatch ? `${(parseFloat(posSizeMatch) * 100).toFixed(0)}%` : '10%'

    // 非对称仓位大小
    let longPositionSize: string | undefined
    let shortPositionSize: string | undefined
    if (config.long_margin_pct !== undefined) {
      longPositionSize = `${(config.long_margin_pct * 100).toFixed(0)}%`
    }
    if (config.short_margin_pct !== undefined) {
      shortPositionSize = `${(config.short_margin_pct * 100).toFixed(0)}%`
    }

    // 高级风控参数
    let maxRoeLoss: string | undefined
    let maxDrawdown: string | undefined
    let maxAccountRisk: string | undefined
    if (config.max_roe_loss !== undefined) {
      maxRoeLoss = `${(Math.abs(config.max_roe_loss) * 100).toFixed(0)}%`
    }
    if (config.max_drawdown !== undefined) {
      maxDrawdown = `${(config.max_drawdown * 100).toFixed(0)}%`
    }
    if (config.max_account_risk !== undefined) {
      maxAccountRisk = `${(config.max_account_risk * 100).toFixed(0)}%`
    }

    if (!config.name && entryConditions.length === 0 && indicators.length === 0) {
      return null
    }

    // 处理 leverage 显示 - 如果已经包含 'x' 则不再添加
    const leverageStr = String(config.leverage)
    const leverageDisplay = leverageStr.toLowerCase().includes('x') ? leverageStr : `${leverageStr}x`

    // 提取详细的执行逻辑
    const analyzeSteps = extractAnalyzeSteps(code, docstring)
    const decisionLogic = extractDecisionLogic(code, config)

    // Cross-Asset 信息
    let crossAssetInfo: ParsedStrategy['crossAssetInfo'] = undefined
    if (config.signal_symbol && config.trading_symbol && config.signal_symbol !== config.trading_symbol) {
      const signalAsset = config.signal_symbol.replace(/PERP_|_USDC/g, '')
      const tradingAsset = config.trading_symbol.replace(/PERP_|_USDC/g, '')
      crossAssetInfo = {
        signalSymbol: config.signal_symbol,
        tradingSymbol: config.trading_symbol,
        signalAsset,
        tradingAsset,
      }
    }

    // ============================================
    // 新版代码格式 - 扩展字段
    // ============================================

    // K线模式分析
    const candlePattern = extractCandlePattern(code, docstring)

    // 状态管理
    const stateManagement = extractStateManagement(code)

    // 数据层计算
    const calculations = extractCalculations(code, docstring)

    // 策略 vibe/描述 (从 docstring 提取)
    const vibeMatch = docstring.match(/vibe[:\s]*(.*?)(?=\n|$)/i)?.[1]?.trim() ||
      docstring.split('\n')[0]?.trim()

    // 轮询配置
    let pollingConfig: ParsedStrategy['pollingConfig'] = undefined
    if (config.base_interval || config.min_interval) {
      pollingConfig = {
        mode: config.polling_mode || 'adaptive',
        baseInterval: config.base_interval || 30,
        minInterval: config.min_interval || 5,
      }
    }

    // 提取 hard stops (从代码中)
    const hardStops: string[] = []
    if (code.includes('max_roe_loss') || maxRoeLoss) {
      hardStops.push(`Total ROE < -${maxRoeLoss || '80%'}`)
    }
    if (code.includes('max_drawdown') || maxDrawdown) {
      hardStops.push(`Max Drawdown: ${maxDrawdown || '20%'}`)
    }
    if (code.includes('max_account_risk') || maxAccountRisk) {
      hardStops.push(`Account Risk > ${maxAccountRisk || '80%'}`)
    }

    return {
      name: config.name || 'Trading Strategy',
      strategyType,
      config,
      dataSources,
      indicators,
      entryConditions,
      exitConditions,
      riskParams: {
        takeProfit: config.take_profit || 'Dynamic',
        stopLoss: config.stop_loss || 'Dynamic',
        leverage: leverageDisplay,
        positionSize: posSize,
        longPositionSize,
        shortPositionSize,
        maxRoeLoss,
        maxDrawdown,
        maxAccountRisk,
        hardStops: hardStops.length > 0 ? hardStops : undefined,
      },
      analyzeSteps,
      decisionLogic,
      crossAssetInfo,
      // 新版扩展字段
      candlePattern,
      stateManagement,
      vibe: vibeMatch || undefined,
      calculations: calculations.length > 0 ? calculations : undefined,
      pollingConfig,
    }
  } catch (error) {
    console.error('Failed to parse strategy code:', error)
    return null
  }
}
