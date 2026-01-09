/**
 * 解析 Python 策略代码，提取关键信息用于 React Flow 可视化
 */

export interface StrategyConfig {
  name: string
  trading_symbol: string
  timeframe: string
  leverage: string | number
  take_profit: string
  stop_loss: string
  polling_mode: string
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
  if (lower.includes('fibonacci') || lower.includes('fib_level')) return 'Fibonacci Retracement'
  if (lower.includes('vcp') || lower.includes('volatility contraction')) return 'VCP Breakout'
  if ((lower.includes('sma') || lower.includes('ema')) && lower.includes('cross')) return 'MA Crossover'
  if (lower.includes('rsi') && lower.includes('oversold')) return 'RSI Reversal'
  if (lower.includes('momentum')) return 'Momentum'
  if (lower.includes('scalp')) return 'Scalping'
  if (lower.includes('breakout')) return 'Breakout'
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
    return items.map(item => item.replace(/"/g, ''))
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

  return {
    name: extractStr('name'),
    trading_symbol: extractStr('trading_symbol') || extractStr('signal_symbol'),
    timeframe,
    leverage: extractNum('leverage') || extractStr('leverage') || '10',
    take_profit: takeProfit,
    stop_loss: stopLoss,
    polling_mode: extractStr('polling_mode') || 'adaptive',
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
    sources.push({ id: 'ds-coingecko', type: 'datasource', api: 'CoinGecko', fields: fields.length ? fields : ['Price'] })
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
    if (code.includes('kline') || code.includes('ohlc')) fields.push('Klines')
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
  if (code.includes('taapi.io/sma') || code.includes("api.taapi.io/sma")) {
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

  // RSI - 只有当代码实际计算或使用 RSI 指标时才添加
  const hasRsiLogic =
    (code.includes('taapi.io') && code.toLowerCase().includes('/rsi')) ||
    /rsi[\s_]*[<>=]/.test(code.toLowerCase()) ||
    code.includes('rsi_value') ||
    code.includes('rsi_data')
  if (hasRsiLogic) {
    const period = code.match(/rsi.*?period["\s:]*(\d+)/i)?.[1] || '14'
    indicators.push({ id: 'ind-rsi', type: 'indicator', name: 'RSI', params: `Period: ${period}` })
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

  // Volume Analysis
  if (code.includes('volume_confirmed') || code.includes('avg_volume')) {
    indicators.push({ id: 'ind-volume', type: 'indicator', name: 'Volume', params: 'vs Average' })
  }

  // Momentum - 检测各种动量计算方式
  if (code.includes('momentum_pct') || code.includes('momentum_threshold') || code.includes('price_change_pct')) {
    // 尝试提取 timeframe
    const timeframe = code.match(/"timeframe":\s*"(\d+[hmd])"/i)?.[1] || '1H'
    indicators.push({ id: 'ind-momentum', type: 'indicator', name: 'Momentum', params: `${timeframe.toUpperCase()} change %` })
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
      (code.includes('crossed above') || code.includes('crossed below'))

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
  if (code.includes('reverse') || code.includes('momentum_reversal') || 
      code.includes('CLOSE_LONG_OPEN_SHORT') || code.includes('CLOSE_SHORT_OPEN_LONG') ||
      code.includes('CLOSE_LONG') || code.includes('CLOSE_SHORT')) {
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

  return conditions
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

    // 提取仓位大小
    const posSizeMatch = code.match(/"position_size_pct"\s*:\s*([\d.]+)/)?.[1]
    const posSize = posSizeMatch ? `${(parseFloat(posSizeMatch) * 100).toFixed(0)}%` : '10%'

    if (!config.name && entryConditions.length === 0 && indicators.length === 0) {
      return null
    }

    // 处理 leverage 显示 - 如果已经包含 'x' 则不再添加
    const leverageStr = String(config.leverage)
    const leverageDisplay = leverageStr.toLowerCase().includes('x') ? leverageStr : `${leverageStr}x`

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
      },
    }
  } catch (error) {
    console.error('Failed to parse strategy code:', error)
    return null
  }
}
