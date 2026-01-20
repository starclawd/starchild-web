/**
 * 将 strategy_config 转换为可视化数据
 *
 * 这是最准确的方案：直接使用源数据，不需要解析代码
 */

import type { ParsedStrategy, ConditionNode, DataSourceNode, IndicatorNode, AnalyzeStep } from './parseStrategyCode'

/**
 * 策略配置数据结构（来自后端 API）
 */
export interface StrategyConfig {
  basic_info?: {
    vibe?: string
    title?: string
    name?: string
    description?: string
    symbols?: string[] // 多币种支持
    timeframe?: string // 时间周期
  }
  data_layer?: {
    symbol?: string
    symbols?: string | string[] // 币种描述（可以是字符串或数组）
    timeframe?: string
    calculations?: string[]
    data_sources?: string[]
    macro_indicators?: string[] // 宏观指标
    external_inputs?: string[] // 外部输入（如地缘政治）
    grid_parameters?: {
      // 网格参数
      grid_levels?: number
      price_range?: string
      grid_spacing?: string
    }
    update_frequency?: string // 更新频率
  }
  risk_layer?: {
    sl?: string
    tp?: string
    hard_stop?: string[]
    emergency_exit?: string // 紧急退出条件
    position_limits?: string // 仓位限制
    drawdown_priority?: string // 回撤优先级
    additional_risk?: string[] // 额外风险规则
    grid_risk_management?: string // 网格风险管理
    time_exit?: string // 时间退出
    market_neutral?: string // 市场中性说明
    funding_rate_check?: string // 资金费率检查
  }
  signal_layer?: {
    constraints?: string[]
    exit_trigger?: string[]
    entry_trigger?: string[]
    entry_long?: string[] // 做多入场条件
    entry_short?: string[] // 做空入场条件
    hold_condition?: string | string[] // 持仓条件（可以是字符串或数组）
    exit_conditions?: string[]
    entry_conditions?: string[]
    selection_logic?: string[] // 选币逻辑
    rebalance_trigger?: string[] // 再平衡触发
    accumulation_logic?: string // 累积逻辑
    grid_logic?: string // 网格逻辑
    position_management?: string[] // 仓位管理规则
  }
  capital_layer?: {
    leverage?: string
    position_sizing?: string
    max_position?: string
    max_positions?: string // 最大持仓数量
    margin_type?: string // 保证金类型
    multi_symbol_allocation?: string // 多币种分配
    max_total_exposure?: string // 最大总敞口
    initial_position_size?: string // 初始仓位
    maximum_position_size?: string // 最大仓位
    add_on_condition?: string // 加仓条件
    total_grid_allocation?: string // 网格总分配
    rebalance_rule?: string // 再平衡规则
    total_utilization?: string // 资金利用率
    per_symbol_allocation?: string // 每币种分配
    rebalancing?: string // 再平衡说明
    accumulation_approach?: string // 累积方法
  }
  execution_layer?: {
    exit?: {
      action?: string
      condition?: string
    }
    long_entry?: {
      action?: string
      condition?: string
      position_size?: string
    }
    short_entry?: {
      action?: string
      condition?: string
      position_size?: string
    }
    symbols?: string[] // 执行币种列表
    order_type?: string
    description?: string
    slippage_tolerance?: string
    execution_timing?: string // 执行时机
    exit_timing?: string // 退出时机
    entry_timing?: string // 入场时机
    exit_execution?: string // 退出执行说明
    accumulation_frequency?: string // 累积频率
    grid_management?: string // 网格管理
    timing?: string // 时机
    rebalance_mechanism?: string // 再平衡机制
    selection_execution?: string // 选币执行
    order_logic?: string // 订单逻辑
    execution_frequency?: string // 执行频率
    position_size?: string // 仓位大小
  }
}

/**
 * 从 strategy_config 转换为 ParsedStrategy
 *
 * @param config - 策略配置数据
 * @returns ParsedStrategy 格式的数据
 */
export function strategyConfigToVisualization(config: StrategyConfig): ParsedStrategy {
  // 提取基本信息
  const name = config.basic_info?.title || config.basic_info?.name || 'Trading Strategy'
  const vibe = config.basic_info?.vibe || config.basic_info?.description || ''

  // 提取交易品种（支持多币种，data_layer.symbols 可能是字符串描述）
  const getSymbols = (): string[] => {
    if (config.basic_info?.symbols) return config.basic_info.symbols
    if (config.execution_layer?.symbols) return config.execution_layer.symbols
    if (config.data_layer?.symbols) {
      // data_layer.symbols 可能是字符串描述（如 "Top 50 tokens by market cap"）
      if (typeof config.data_layer.symbols === 'string') {
        return [config.data_layer.symbols]
      }
      return config.data_layer.symbols
    }
    if (config.data_layer?.symbol) return [config.data_layer.symbol]
    return ['BTC']
  }
  const symbols = getSymbols()
  const primarySymbol = symbols[0] || 'BTC'

  // 提取时间周期（多处可能定义）
  const timeframe = config.basic_info?.timeframe || config.data_layer?.timeframe || '1h'

  // 提取数据源
  const dataSources: DataSourceNode[] = (config.data_layer?.data_sources || []).map((src, i) => {
    // 解析数据源字符串，例如 "Market Data (CoinGecko): BTC 1H OHLCV"
    const match = src.match(/^([^(]+)\s*\(([^)]+)\):\s*(.+)$/)
    if (match) {
      return {
        id: `ds-${i}`,
        type: 'datasource' as const,
        api: match[2], // CoinGecko
        fields: [match[3]], // BTC 1H OHLCV
      }
    }
    return {
      id: `ds-${i}`,
      type: 'datasource' as const,
      api: src.split(':')[0] || src,
      fields: [src],
    }
  })

  // 添加外部输入作为数据源（如地缘政治新闻）
  if (config.data_layer?.external_inputs) {
    config.data_layer.external_inputs.forEach((input, i) => {
      dataSources.push({
        id: `ds-ext-${i}`,
        type: 'datasource' as const,
        api: 'External',
        fields: [input],
      })
    })
  }

  // 添加宏观指标作为数据源
  if (config.data_layer?.macro_indicators) {
    config.data_layer.macro_indicators.forEach((indicator, i) => {
      dataSources.push({
        id: `ds-macro-${i}`,
        type: 'datasource' as const,
        api: 'Macro',
        fields: [indicator],
      })
    })
  }

  // 提取指标（从 calculations 推断）
  const indicators: IndicatorNode[] = (config.data_layer?.calculations || []).map((calc, i) => ({
    id: `ind-${i}`,
    type: 'indicator' as const,
    name: extractIndicatorName(calc),
    params: calc,
  }))

  // 提取入场条件
  const entryConditions: ConditionNode[] = []

  // 从 signal_layer.entry_trigger 或 entry_conditions 提取
  const entryTriggers = config.signal_layer?.entry_trigger || config.signal_layer?.entry_conditions || []
  entryTriggers.forEach((trigger, i) => {
    const direction = inferDirection(trigger)
    const triggerType = inferTriggerType(trigger)

    entryConditions.push({
      id: `entry-${i}`,
      type: 'condition' as const,
      direction,
      category: 'entry' as const,
      triggerType,
      conditions: [cleanConditionText(trigger)],
      description: cleanConditionText(trigger),
    })
  })

  // 从 signal_layer.entry_long 提取做多入场条件
  if (config.signal_layer?.entry_long) {
    config.signal_layer.entry_long.forEach((trigger, i) => {
      const triggerType = inferTriggerType(trigger)
      entryConditions.push({
        id: `entry-long-${i}`,
        type: 'condition' as const,
        direction: 'long',
        category: 'entry' as const,
        triggerType,
        conditions: [cleanConditionText(trigger)],
        description: cleanConditionText(trigger),
      })
    })
  }

  // 从 signal_layer.entry_short 提取做空入场条件
  if (config.signal_layer?.entry_short) {
    config.signal_layer.entry_short.forEach((trigger, i) => {
      const triggerType = inferTriggerType(trigger)
      entryConditions.push({
        id: `entry-short-${i}`,
        type: 'condition' as const,
        direction: 'short',
        category: 'entry' as const,
        triggerType,
        conditions: [cleanConditionText(trigger)],
        description: cleanConditionText(trigger),
      })
    })
  }

  // 从 signal_layer.selection_logic 添加选币逻辑作为入场条件
  if (config.signal_layer?.selection_logic) {
    config.signal_layer.selection_logic.forEach((logic, i) => {
      const direction = inferDirection(logic)
      entryConditions.push({
        id: `entry-selection-${i}`,
        type: 'condition' as const,
        direction,
        category: 'entry' as const,
        triggerType: 'signal',
        conditions: [cleanConditionText(logic)],
        description: cleanConditionText(logic),
      })
    })
  }

  // 从 signal_layer.grid_logic 添加网格逻辑
  if (config.signal_layer?.grid_logic) {
    entryConditions.push({
      id: 'entry-grid',
      type: 'condition' as const,
      direction: 'both',
      category: 'entry' as const,
      triggerType: 'signal',
      conditions: [config.signal_layer.grid_logic],
      description: config.signal_layer.grid_logic,
    })
  }

  // 从 execution_layer 补充入场条件
  if (entryConditions.length === 0) {
    if (config.execution_layer?.long_entry?.condition) {
      entryConditions.push({
        id: 'entry-long',
        type: 'condition' as const,
        direction: 'long',
        category: 'entry' as const,
        triggerType: 'signal',
        conditions: [config.execution_layer.long_entry.condition],
        description: config.execution_layer.long_entry.condition,
      })
    }
    if (config.execution_layer?.short_entry?.condition) {
      entryConditions.push({
        id: 'entry-short',
        type: 'condition' as const,
        direction: 'short',
        category: 'entry' as const,
        triggerType: 'signal',
        conditions: [config.execution_layer.short_entry.condition],
        description: config.execution_layer.short_entry.condition,
      })
    }
  }

  // 提取退出条件
  const exitConditions: ConditionNode[] = []

  // 从 signal_layer.exit_trigger 或 exit_conditions 提取
  const exitTriggers = config.signal_layer?.exit_trigger || config.signal_layer?.exit_conditions || []
  exitTriggers.forEach((trigger, i) => {
    const direction = inferDirection(trigger)
    const triggerType = inferExitTriggerType(trigger)

    exitConditions.push({
      id: `exit-${i}`,
      type: 'condition' as const,
      direction,
      category: 'exit' as const,
      triggerType,
      conditions: [cleanConditionText(trigger)],
      description: cleanConditionText(trigger),
    })
  })

  // 从 signal_layer.rebalance_trigger 添加再平衡触发条件
  if (config.signal_layer?.rebalance_trigger) {
    config.signal_layer.rebalance_trigger.forEach((trigger, i) => {
      exitConditions.push({
        id: `exit-rebalance-${i}`,
        type: 'condition' as const,
        direction: 'both',
        category: 'exit' as const,
        triggerType: 'signal',
        conditions: [cleanConditionText(trigger)],
        description: cleanConditionText(trigger),
      })
    })
  }

  // 从 signal_layer.position_management 添加仓位管理规则
  if (config.signal_layer?.position_management) {
    config.signal_layer.position_management.forEach((rule, i) => {
      exitConditions.push({
        id: `exit-mgmt-${i}`,
        type: 'condition' as const,
        direction: 'both',
        category: 'exit' as const,
        triggerType: 'signal',
        conditions: [cleanConditionText(rule)],
        description: cleanConditionText(rule),
      })
    })
  }

  // 从 execution_layer 补充退出条件
  if (config.execution_layer?.exit?.condition) {
    exitConditions.push({
      id: 'exit-signal',
      type: 'condition' as const,
      direction: 'both',
      category: 'exit' as const,
      triggerType: 'signal',
      conditions: [config.execution_layer.exit.condition],
      description: config.execution_layer.exit.condition,
    })
  }

  // 添加 TP/SL 条件
  if (config.risk_layer?.tp && config.risk_layer.tp !== 'N/A' && config.risk_layer.tp !== '') {
    exitConditions.push({
      id: 'exit-tp',
      type: 'condition' as const,
      direction: 'both',
      category: 'exit' as const,
      triggerType: 'take_profit',
      conditions: [`Take Profit: ${config.risk_layer.tp}`],
      description: `Take Profit: ${config.risk_layer.tp}`,
    })
  }

  if (config.risk_layer?.sl && config.risk_layer.sl !== 'N/A' && config.risk_layer.sl !== '') {
    exitConditions.push({
      id: 'exit-sl',
      type: 'condition' as const,
      direction: 'both',
      category: 'exit' as const,
      triggerType: 'stop_loss',
      conditions: [`Stop Loss: ${config.risk_layer.sl}`],
      description: `Stop Loss: ${config.risk_layer.sl}`,
    })
  }

  // 添加时间退出条件
  if (config.risk_layer?.time_exit) {
    exitConditions.push({
      id: 'exit-time',
      type: 'condition' as const,
      direction: 'both',
      category: 'exit' as const,
      triggerType: 'signal',
      conditions: [`Time Exit: ${config.risk_layer.time_exit}`],
      description: `Time Exit: ${config.risk_layer.time_exit}`,
    })
  }

  // 添加紧急退出条件
  if (config.risk_layer?.emergency_exit) {
    exitConditions.push({
      id: 'exit-emergency',
      type: 'condition' as const,
      direction: 'both',
      category: 'exit' as const,
      triggerType: 'stop_loss',
      conditions: [`Emergency Exit: ${config.risk_layer.emergency_exit}`],
      description: `Emergency Exit: ${config.risk_layer.emergency_exit}`,
    })
  }

  // 提取风险参数
  const leverage = config.capital_layer?.leverage || '1x'
  const positionSize =
    config.capital_layer?.position_sizing ||
    config.execution_layer?.position_size || // 支持 execution_layer 中的仓位大小
    config.capital_layer?.initial_position_size ||
    config.capital_layer?.per_symbol_allocation ||
    config.capital_layer?.max_position ||
    '10%'
  const takeProfit = config.risk_layer?.tp && config.risk_layer.tp !== '' ? config.risk_layer.tp : 'Dynamic'
  const stopLoss = config.risk_layer?.sl && config.risk_layer.sl !== '' ? config.risk_layer.sl : 'Dynamic'
  const hardStops = config.risk_layer?.hard_stop || []

  // 提取额外的资本层参数
  const marginType = config.capital_layer?.margin_type
  const maxExposure = config.capital_layer?.max_total_exposure
  const rebalanceRule = config.capital_layer?.rebalance_rule
  const maxPositions = config.capital_layer?.max_positions

  // 构建分析步骤
  const analyzeSteps: AnalyzeStep[] = [
    {
      id: 'step-1',
      label: 'Fetch Data',
      description: dataSources.map((ds) => ds.api).join(', ') || 'Market Data',
    },
    {
      id: 'step-2',
      label: 'Calculate',
      description: (config.data_layer?.calculations || []).slice(0, 3).join(', ') || 'Price Analysis',
    },
    {
      id: 'step-3',
      label: 'Check Signals',
      description: 'Evaluate entry/exit conditions',
    },
  ]

  // 如果有网格参数，添加网格步骤
  if (config.data_layer?.grid_parameters) {
    analyzeSteps.push({
      id: 'step-4',
      label: 'Grid Management',
      description: `${config.data_layer.grid_parameters.grid_levels || 10} levels, ${config.data_layer.grid_parameters.grid_spacing || '2%'} spacing`,
    })
  }

  // 如果有再平衡逻辑，添加再平衡步骤
  if (config.signal_layer?.rebalance_trigger || config.execution_layer?.rebalance_mechanism) {
    analyzeSteps.push({
      id: 'step-rebalance',
      label: 'Rebalance',
      description: config.data_layer?.update_frequency || 'Periodic rebalancing',
    })
  }

  // 构建决策逻辑
  const decisionLogic = {
    noPosition: entryConditions.map((c) => ({
      condition: c.description,
      action: c.direction === 'long' ? 'BUY' : c.direction === 'short' ? 'SELL' : 'TRADE',
      description: c.description,
    })),
    hasPosition: exitConditions.map((c) => ({
      condition: c.description,
      action: c.triggerType === 'take_profit' ? 'TAKE PROFIT' : c.triggerType === 'stop_loss' ? 'STOP LOSS' : 'EXIT',
      description: c.description,
    })),
  }

  // 推断策略类型
  const strategyType = inferStrategyType(name, vibe, config)

  // 构建额外风险参数
  const additionalRiskParams: Record<string, string> = {}
  if (marginType) additionalRiskParams.marginType = marginType
  if (maxExposure) additionalRiskParams.maxExposure = maxExposure
  if (rebalanceRule) additionalRiskParams.rebalanceRule = rebalanceRule
  if (maxPositions) additionalRiskParams.maxPositions = maxPositions
  if (config.risk_layer?.position_limits) additionalRiskParams.positionLimits = config.risk_layer.position_limits
  if (config.risk_layer?.drawdown_priority) additionalRiskParams.drawdownPriority = config.risk_layer.drawdown_priority
  if (config.risk_layer?.market_neutral) additionalRiskParams.marketNeutral = config.risk_layer.market_neutral
  if (config.risk_layer?.funding_rate_check) additionalRiskParams.fundingRateCheck = config.risk_layer.funding_rate_check

  return {
    name,
    strategyType,
    config: {
      name,
      signal_symbol: primarySymbol,
      trading_symbol: primarySymbol,
      symbols: symbols.length > 1 ? symbols : undefined,
      timeframe,
      leverage,
      take_profit: takeProfit,
      stop_loss: stopLoss,
      polling_mode: 'adaptive',
      position_size: positionSize,
      margin_type: marginType,
    },
    dataSources,
    indicators,
    entryConditions,
    exitConditions,
    riskParams: {
      takeProfit,
      stopLoss,
      leverage,
      positionSize,
      hardStops: hardStops.length > 0 ? hardStops : undefined,
      ...additionalRiskParams,
    },
    analyzeSteps,
    decisionLogic,
    vibe,
    calculations: config.data_layer?.calculations,
  }
}

/**
 * 从计算描述中提取指标名称
 */
function extractIndicatorName(calc: string): string {
  const lower = calc.toLowerCase()

  // 特定指标检测（顺序很重要）
  // 复合指标优先检测
  if (lower.includes('volume') && lower.includes('moving average')) return 'Volume MA'
  if (lower.includes('price') && lower.includes('moving average')) return 'Price MA'
  if (lower.includes('buy volume') || lower.includes('sell volume')) return 'Volume Analysis'

  // StochRSI 要在 RSI 之前检测
  if (lower.includes('stochrsi') || lower.includes('stoch rsi')) return 'StochRSI'
  if (lower.includes('rsi')) return 'RSI'
  if (lower.includes('macd')) return 'MACD'
  if (lower.includes('bollinger') || lower.includes('bbands') || lower.includes('bb')) return 'Bollinger Bands'
  if (lower.includes('cci')) return 'CCI'
  if (lower.includes('ema')) return 'EMA'
  if (lower.includes('sma') || lower.includes('simple moving average')) return 'SMA'
  if (lower.includes('24h') && lower.includes('average')) return '24H MA'
  if (lower.includes('ma') || lower.includes('moving average')) return 'Moving Average'
  if (lower.includes('atr')) return 'ATR'
  if (lower.includes('volume')) return 'Volume'
  if (lower.includes('volatility') || lower.includes('standard deviation')) return 'Volatility'
  if (lower.includes('price change') || lower.includes('momentum')) return 'Momentum'
  if (lower.includes('relative strength') && !lower.includes('rsi')) return 'Relative Strength'
  if (lower.includes('candle') || lower.includes('engulfing') || lower.includes('pattern')) return 'Candlestick Pattern'
  if (lower.includes('crossover') || lower.includes('cross')) return 'Crossover Detection'
  if (lower.includes('swing') || lower.includes('high') || lower.includes('low')) return 'Swing Detection'
  if (lower.includes('weight') || lower.includes('deviation')) return 'Weight Calculation'
  if (lower.includes('grid') || lower.includes('boundary')) return 'Grid Calculation'
  if (lower.includes('ranking') || lower.includes('quantile')) return 'Ranking'
  if (lower.includes('trend') || lower.includes('confirmation')) return 'Trend Analysis'
  if (lower.includes('gradual') || lower.includes('amplification')) return 'Amplification Detection'

  // 返回原始文本的简短版本
  const colonIndex = calc.indexOf(':')
  if (colonIndex > 0) {
    return calc.substring(0, colonIndex).trim()
  }
  return calc.length > 25 ? calc.substring(0, 22) + '...' : calc
}

/**
 * 从条件文本推断方向
 */
function inferDirection(text: string): 'long' | 'short' | 'both' {
  const lower = text.toLowerCase()

  // Long 方向关键词
  if (
    lower.startsWith('long:') ||
    lower.startsWith('long entry:') ||
    lower.includes('long entry') ||
    lower.includes('open long') ||
    lower.includes('long signal')
  ) {
    return 'long'
  }

  // Short 方向关键词
  if (
    lower.startsWith('short:') ||
    lower.startsWith('short entry:') ||
    lower.includes('short entry') ||
    lower.includes('open short') ||
    lower.includes('short signal')
  ) {
    return 'short'
  }

  // 看涨信号
  if (
    lower.includes('increases') ||
    lower.includes('bullish') ||
    lower.includes('buy') ||
    lower.includes('green') ||
    lower.includes('oversold') ||
    lower.includes('higher low') ||
    lower.includes('crosses above') ||
    lower.includes('bottom')
  ) {
    return 'long'
  }

  // 看跌信号
  if (
    lower.includes('decreases') ||
    lower.includes('bearish') ||
    lower.includes('sell') ||
    lower.includes('red') ||
    lower.includes('overbought') ||
    lower.includes('lower high') ||
    lower.includes('crosses below') ||
    lower.includes('top')
  ) {
    return 'short'
  }

  // 检查 RSI 范围（RSI 0-70 通常是做多，RSI 80-100 通常是做空）
  const rsiMatch = lower.match(/rsi\s*(?:between\s*)?(\d+)\s*[-–]\s*(\d+)/)
  if (rsiMatch) {
    const low = parseInt(rsiMatch[1])
    const high = parseInt(rsiMatch[2])
    if (low <= 30) return 'long' // 超卖区间
    if (high >= 70) return 'short' // 超买区间
  }

  return 'both'
}

/**
 * 从条件文本推断触发类型
 */
function inferTriggerType(text: string): ConditionNode['triggerType'] {
  const lower = text.toLowerCase()

  if (lower.includes('cross')) return 'crossover'
  if (lower.includes('rsi') || lower.includes('macd') || lower.includes('bollinger')) return 'indicator'

  return 'signal'
}

/**
 * 从退出条件文本推断触发类型
 */
function inferExitTriggerType(text: string): ConditionNode['triggerType'] {
  const lower = text.toLowerCase()

  if (lower.includes('profit') || lower.includes('tp')) return 'take_profit'
  if (lower.includes('loss') || lower.includes('sl') || lower.includes('stop')) return 'stop_loss'
  if (lower.includes('reverse') || lower.includes('reversal')) return 'reversal'
  if (lower.includes('cross')) return 'crossover'

  return 'signal'
}

/**
 * 清理条件文本（移除前缀标签）
 */
function cleanConditionText(text: string): string {
  // 移除 "Long:" 或 "Short:" 等前缀
  return text.replace(/^(Long|Short|Entry|Exit):\s*/i, '').trim()
}

/**
 * 推断策略类型
 */
function inferStrategyType(name: string, vibe: string, config: StrategyConfig): string {
  const combined = `${name} ${vibe} ${JSON.stringify(config)}`.toLowerCase()

  // 网格策略
  if (combined.includes('grid')) return 'Grid Strategy'

  // 再平衡/因子策略
  if (combined.includes('rebalanc') || combined.includes('factor') || combined.includes('balancer'))
    return 'Factor Rebalancing'

  // 均值回归
  if (combined.includes('mean reversion') || combined.includes('snapper') || combined.includes('elastic'))
    return 'Mean Reversion'

  // 宏观/累积策略
  if (combined.includes('macro') || combined.includes('accumul')) return 'Macro Accumulation'

  // 区间交易（range hunter 才是区间策略）
  if (combined.includes('range hunter') || combined.includes('range trading')) return 'Range Trading'

  // 危机/恐慌交易
  if (
    combined.includes('crisis') ||
    combined.includes('panic') ||
    combined.includes('tariff') ||
    combined.includes('fear')
  )
    return 'Crisis Trading'

  // Golden Cross / Death Cross 策略
  if (combined.includes('golden cross') || combined.includes('death cross')) return 'MACD Crossover'

  // K线形态策略（3 green candles 等）
  if (
    combined.includes('green candle') ||
    combined.includes('red candle') ||
    combined.includes('engulfing') ||
    combined.includes('doji') ||
    combined.includes('hammer')
  )
    return 'Candlestick Pattern'

  // 超卖策略
  if (combined.includes('oversold') && combined.includes('hunter')) return 'Oversold Strategy'

  // MACD 策略
  if (combined.includes('macd')) return 'MACD Strategy'

  // RSI 策略（需要在其他策略之后检测，因为很多策略都用 RSI）
  if (combined.includes('rsi') && !combined.includes('stochrsi')) return 'RSI Strategy'

  // StochRSI 策略
  if (combined.includes('stochrsi')) return 'StochRSI Strategy'

  // 动量策略
  if (combined.includes('momentum') || combined.includes('scalp') || combined.includes('wave rider'))
    return 'Momentum Strategy'

  // Sniper 策略
  if (combined.includes('sniper')) return 'Sniper Strategy'

  // 交叉策略
  if (combined.includes('crossover') || combined.includes('cross')) return 'Crossover Strategy'

  // 布林带策略
  if (combined.includes('bollinger') || combined.includes('bbands')) return 'Bollinger Bands'

  // 突破策略
  if (combined.includes('breakout')) return 'Breakout Strategy'

  // 反转策略
  if (combined.includes('reversal')) return 'Reversal Strategy'

  // K线形态策略
  if (combined.includes('candle') || combined.includes('pattern')) return 'Candlestick Pattern'

  // 斐波那契策略
  if (combined.includes('fibonacci') || combined.includes('fib')) return 'Fibonacci Strategy'

  // CCI 策略
  if (combined.includes('cci')) return 'CCI Strategy'

  // 振荡器策略
  if (combined.includes('oscillator')) return 'Oscillator Strategy'

  // 多空策略
  if (combined.includes('short') && combined.includes('long')) return 'Long/Short Strategy'

  // 做空策略
  if (combined.includes('short') || combined.includes('bear')) return 'Short Strategy'

  return name || 'Trading Strategy'
}

export default strategyConfigToVisualization
