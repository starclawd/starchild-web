/**
 * 解析 Python 策略代码，提取关键信息用于 React Flow 可视化
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
  triggerType: 'signal' | 'take_profit' | 'stop_loss' | 'reversal' | 'crossover'
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

  // 提取高级风控参数
  const maxRoeLoss = extractNum('max_roe_loss')
  const maxDrawdown = extractNum('max_drawdown')
  const maxAccountRisk = extractNum('max_account_risk')

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
    if (code.includes('sma')) fields.push('SMA')
    if (code.includes('rsi')) fields.push('RSI')
    if (code.includes('fibonacci')) fields.push('Fib')
    if (code.includes('ema')) fields.push('EMA')
    sources.push({ id: 'ds-taapi', type: 'datasource', api: 'TAAPI', fields: fields.length ? fields : ['Indicators'] })
  }

  // Orderly Network - 检测 API URL 或关键字
  if (code.includes('orderly.org') || code.includes('orderly.network') || code.includes('ORDERLY')) {
    const fields: string[] = []
    if (code.includes('mark_price') || code.includes('futures')) fields.push('Price')
    // 增强 klines 检测
    if (
      code.includes('kline') ||
      code.includes('klines') ||
      code.includes('ohlc') ||
      code.includes('/v1/public/klines')
    ) {
      fields.push('Klines')
    }
    // 检测 24h ticker
    if (code.includes('ticker/24hr') || code.includes('24h_')) fields.push('24h Stats')
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
    code.includes('overbought_crossover')
  if (hasRsiLogic) {
    const period = code.match(/rsi.*?period["\s:]*(\d+)/i)?.[1] || '14'
    // 提取 RSI 阈值
    const oversoldLevel = code.match(/rsi_oversold["\s:]*(\d+)/i)?.[1] || '30'
    const overboughtLevel = code.match(/rsi_overbought["\s:]*(\d+)/i)?.[1] || '70'
    const hasThresholds = code.includes('rsi_oversold') || code.includes('rsi_overbought')
    indicators.push({
      id: 'ind-rsi',
      type: 'indicator',
      name: 'RSI',
      params: hasThresholds ? `Period: ${period}, Levels: ${oversoldLevel}/${overboughtLevel}` : `Period: ${period}`,
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
    (code.includes('volume') && code.includes('average'))
  if (hasVolumeLogic) {
    // 尝试提取 volume 周期
    const volumePeriod = code.match(/volumes?\[-(\d+):\]/)?.[1] || '20'
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

    // Momentum
    if (code.includes('momentum_pct') && code.includes('>= threshold')) {
      conditions.push({
        id: 'entry-long-mom',
        type: 'condition',
        direction: 'long',
        category: 'entry',
        triggerType: 'signal',
        conditions: ['Momentum >= +0.5%'],
        description: 'Positive momentum entry',
      })
    }
    if (code.includes('momentum_pct') && code.includes('<= -threshold')) {
      conditions.push({
        id: 'entry-short-mom',
        type: 'condition',
        direction: 'short',
        category: 'entry',
        triggerType: 'signal',
        conditions: ['Momentum <= -0.5%'],
        description: 'Negative momentum entry',
      })
    }

    // RSI Crossover - 检测超卖/超买反弹
    const hasRsiCrossover =
      code.includes('oversold_crossover') ||
      code.includes('overbought_crossover') ||
      (code.includes('previous_rsi') && code.includes('current_rsi'))

    if (hasRsiCrossover) {
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
    code.includes('CLOSE_LONG_OPEN_SHORT') ||
    code.includes('CLOSE_SHORT_OPEN_LONG') ||
    code.includes('CLOSE_LONG') ||
    code.includes('CLOSE_SHORT')
  ) {
    conditions.push({
      id: 'exit-reverse',
      type: 'condition',
      direction: 'both',
      category: 'exit',
      triggerType: 'reversal',
      conditions: ['Opposite signal triggered'],
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

  return conditions
}

/**
 * 提取分析步骤 - 从 analyze 函数中提取数据处理逻辑
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

  // 2. 计算步骤 - 根据策略类型
  if (code.includes('momentum_pct') || code.includes('price_change_pct')) {
    // 尝试提取具体阈值
    const thresholdMatch = code.match(/["']momentum_threshold["']\s*:\s*([\d.]+)/)?.[1]
    const threshold = thresholdMatch ? `${thresholdMatch}%` : '0.5%'
    steps.push({
      id: 'step-calc-momentum',
      label: 'Calculate Momentum',
      description: `Compute price change % (threshold: ±${threshold})`,
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

  // Fibonacci 状态管理 (used_levels)
  if (code.includes('used_levels') || code.includes('triggered_level')) {
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

  // 3. Proximity 计算
  if (code.includes('proximity')) {
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
      code.includes('overbought_crossover')
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
      code.includes('oversold_crossover')
    ) {
      hasPosition.push({
        condition: 'SHORT + Bullish signal',
        action: 'BUY',
        description: 'Close short on reversal',
      })
    }
  }

  // 无持仓时的入场逻辑
  // Momentum strategy
  if (code.includes('momentum_pct >= threshold') || code.includes('momentum_pct >=')) {
    const thresholdMatch = code.match(/["']momentum_threshold["']\s*:\s*([\d.]+)/)?.[1]
    noPosition.push({
      condition: `Momentum ≥ +${thresholdMatch || '0.5'}%`,
      action: 'BUY',
      description: 'Open long on bullish momentum',
    })
  }
  if (code.includes('momentum_pct <= -threshold') || code.includes('momentum_pct <= -')) {
    const thresholdMatch = code.match(/["']momentum_threshold["']\s*:\s*([\d.]+)/)?.[1]
    noPosition.push({
      condition: `Momentum ≤ -${thresholdMatch || '0.5'}%`,
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
      },
      analyzeSteps,
      decisionLogic,
      crossAssetInfo,
    }
  } catch (error) {
    console.error('Failed to parse strategy code:', error)
    return null
  }
}
