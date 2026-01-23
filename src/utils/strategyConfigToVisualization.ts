/**
 * 将 strategy_config 转换为可视化数据
 *
 * 这是最准确的方案：直接使用源数据，不需要解析代码
 */

import type { ParsedStrategy, ConditionNode, DataSourceNode, IndicatorNode, AnalyzeStep } from './parseStrategyCode'

/**
 * 指标配置的对象形式
 */
interface IndicatorConfig {
  type?: string
  period?: number
  fast_period?: number
  slow_period?: number
  signal_period?: number
  fast?: number
  slow?: number
  oversold?: number
  overbought?: number
  symbol?: string
  symbols?: string[]
  timeframe?: string
  lookback?: number
  sma_period?: number
  [key: string]: unknown // 支持其他未知字段
}

/**
 * 入场/退出条件的对象形式
 */
interface ConditionConfig {
  long?: Record<string, boolean | string> | string // 支持字符串条件表达式
  short?: Record<string, boolean | string> | string // 支持字符串条件表达式
  condition?: string
  side?: string
  symbol?: string
  action?: string
}

/**
 * 止损/止盈的对象形式
 */
interface StopConfig {
  type?: string
  value?: number
  long?: string
  short?: string
  xrp_long?: string
  btc_short?: string
}

/**
 * 仓位大小的对象形式
 */
interface PositionSizingConfig {
  leverage?: number | string
  max_positions?: number
  base_position_percent?: number
  long_positions?: string
  short_positions?: string
  sizing_method?: string
  risk_per_trade?: number | { min: number; max: number }
  base_currency?: string
  // 新增字段支持 { base: "available_balance", type: "percentage", value: 100 }
  base?: string
  type?: string
  value?: number
}

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
    symbol?: string // 单个币种
    strategy_type?: string // 策略类型
    vibe_title?: string // 风格标题
    author?: string
    version?: string
  }
  data_layer?: {
    symbol?: string
    symbols?: string | string[] // 币种描述（可以是字符串或数组）
    timeframe?: string
    timeframes?: string[] // 多个时间周期
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
    monitoring_frequency?: string // 监控频率
    lookback_period?: number // 回看周期
    data_requirements?: string[] // 数据需求
    funding_rate_check?: boolean // 资金费率检查
    // 指标配置（对象形式）
    indicators?: Record<string, IndicatorConfig>
  }
  risk_layer?: {
    sl?: string | StopConfig
    tp?: string | StopConfig
    stop_loss?: string | StopConfig
    take_profit?: string | StopConfig
    hard_stop?: string[]
    emergency_exit?: string | { action?: string; account_risk_threshold?: number; account_drawdown?: number } // 紧急退出条件
    position_limits?: string | { no_hedging?: boolean; no_pyramiding?: boolean } // 仓位限制
    drawdown_priority?: string // 回撤优先级
    additional_risk?: string | string[] // 额外风险规则
    grid_risk_management?: string // 网格风险管理
    time_exit?: string // 时间退出
    market_neutral?: string // 市场中性说明
    funding_rate_check?: string // 资金费率检查
    max_drawdown?: number // 最大回撤
    max_positions?: number // 最大持仓数
    max_account_risk?: number // 最大账户风险
    account_protection?: {
      max_account_risk?: number
      daily_loss_limit?: number
      consecutive_loss_limit?: number
    }
    warning?: string // 风险警告
    additional_notes?: string // 额外说明
    position_limit?: string // 仓位限制（字符串形式）
    risk_per_trade?: string // 每次交易风险
    trend_protection?: string // 趋势保护
  }
  signal_layer?: {
    constraints?: string[] | Record<string, number | boolean>
    exit_trigger?: string[]
    entry_trigger?: string[]
    entry_long?: string[] | ConditionConfig // 做多入场条件
    entry_short?: string[] | ConditionConfig // 做空入场条件
    hold_condition?: string | string[] | ConditionConfig // 持仓条件
    exit_conditions?: string[] | Record<string, boolean | string> | ConditionConfig // 支持字符串条件
    entry_conditions?: string[] | Record<string, boolean | string> | ConditionConfig // 支持字符串条件
    selection_logic?: string[] // 选币逻辑
    rebalance_trigger?: string[] // 再平衡触发
    accumulation_logic?: string // 累积逻辑
    grid_logic?: string // 网格逻辑
    position_management?: string[] // 仓位管理规则
    signal_strength?: string[] // 信号强度描述
    add_position_trigger?: string[] // 加仓触发条件
    trading_symbol?: string // 交易币种
    filters?: {
      funding_rate_check?: boolean
      max_funding_rate?: number
    }
    market_regime_filters?: {
      fear_greed_index?: { min?: number; max?: number }
      funding_rate_threshold?: number
    }
  }
  capital_layer?: {
    leverage?: string | number
    position_sizing?: string | PositionSizingConfig
    position_size?: string // 仓位大小
    max_position?: string
    max_positions?: string | number // 最大持仓数量
    margin_type?: string // 保证金类型
    margin_usage?: string // 保证金使用方式 (dynamic/fixed)
    per_trade_risk?: number | string // 每交易风险百分比
    total_allocation?: number | string // 总分配百分比
    multi_symbol_allocation?: string // 多币种分配
    max_total_exposure?: string // 最大总敞口
    initial_position_size?: string // 初始仓位
    maximum_position_size?: string // 最大仓位
    add_on_condition?: string // 加仓条件
    add_position_size?: string // 加仓大小
    total_grid_allocation?: string // 网格总分配
    rebalance_rule?: string // 再平衡规则
    total_utilization?: string // 资金利用率
    per_symbol_allocation?: string // 每币种分配
    rebalancing?: string | { enabled?: boolean } // 再平衡说明
    accumulation_approach?: string // 累积方法
    capital_allocation?: string // 资金分配
    margin_management?: string // 保证金管理
    batching?: string // 分批建仓
    risk_per_trade?: string // 每交易风险
    max_position_per_token?: string // 每代币最大仓位
    max_concurrent_positions?: string // 最大并发持仓
    allocation?: Record<string, string> // 分配
    leverage_management?: {
      max_leverage?: number
      account_risk_limit?: number
    }
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
    order_types?: {
      entry?: string
      stop_loss?: string
      take_profit?: string
    }
    leverage?: string | number | Record<string, number> // 杠杆（可能按币种分配）
    position_sizing?: string | PositionSizingConfig // 仓位大小配置
    description?: string
    slippage_tolerance?: string | number
    execution_timing?: string // 执行时机
    exit_timing?: string // 退出时机
    entry_timing?: string // 入场时机
    exit_execution?: string // 退出执行说明
    accumulation_frequency?: string // 累积频率
    grid_management?: string // 网格管理
    timing?: string | { entry_timeout?: string; slippage_tolerance?: number } // 时机
    rebalance_mechanism?: string // 再平衡机制
    selection_execution?: string // 选币执行
    order_logic?: string // 订单逻辑
    execution_frequency?: string // 执行频率
    position_size?: string // 仓位大小
    signal_source?: string // 信号源
    target_symbol?: string // 目标交易对
    trading_symbol?: string // 交易币种
    platform?: string // 交易平台
    time_in_force?: string // 订单有效期
    execution_mode?: string // 执行模式
    execution_logic?: string // 执行逻辑
    signal_frequency?: string // 信号频率
    position_direction?: string // 仓位方向
    batching_strategy?: string // 分批策略
    position_tracking?: string // 仓位跟踪
    position_constraints?: {
      no_hedging?: boolean
      no_pyramiding?: boolean
    }
    timeframe?: string // 时间周期
  }
}

/**
 * 创建默认的 ParsedStrategy 对象（用于错误情况）
 */
function createDefaultParsedStrategy(): ParsedStrategy {
  return {
    name: 'Trading Strategy',
    strategyType: 'Trading Strategy',
    config: {
      name: 'Trading Strategy',
      signal_symbol: 'BTC',
      trading_symbol: 'BTC',
      timeframe: '1h',
      leverage: '1x',
      take_profit: '',
      stop_loss: '',
      polling_mode: 'adaptive',
    },
    dataSources: [],
    indicators: [],
    entryConditions: [],
    exitConditions: [],
    riskParams: {
      takeProfit: 'Dynamic',
      stopLoss: 'Dynamic',
      leverage: '1x',
      positionSize: '10%',
    },
    analyzeSteps: [],
    decisionLogic: {
      hasPosition: [{ condition: 'Exit condition met', action: 'CLOSE', description: 'Close existing position' }],
      noPosition: [{ condition: 'Entry signal triggered', action: 'OPEN', description: 'Open new position' }],
    },
    vibe: '',
  }
}

/**
 * 从 strategy_config 转换为 ParsedStrategy
 *
 * @param config - 策略配置数据
 * @returns ParsedStrategy 格式的数据
 */
export function strategyConfigToVisualization(config: StrategyConfig): ParsedStrategy {
  // 参数校验
  if (!config || typeof config !== 'object') {
    console.warn('[strategyConfigToVisualization] Invalid config, returning default')
    return createDefaultParsedStrategy()
  }

  try {
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
    const timeframe =
      config.basic_info?.timeframe ||
      config.data_layer?.timeframe ||
      config.execution_layer?.timeframe ||
      (config.data_layer?.timeframes?.length ? config.data_layer.timeframes[0] : undefined) ||
      '1h'

    // 提取数据源
    const dataSources: DataSourceNode[] = (config.data_layer?.data_sources || []).map((src, i) => {
      // 确保 src 是字符串类型
      const srcStr = typeof src === 'string' ? src : String(src || '')
      // 解析数据源字符串，例如 "Market Data (CoinGecko): BTC 1H OHLCV"
      const match = srcStr.match(/^([^(]+)\s*\(([^)]+)\):\s*(.+)$/)
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
        api: srcStr.split(':')[0] || srcStr,
        fields: [srcStr],
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

    // 提取指标（从 calculations 和 indicators 对象推断）
    const indicators: IndicatorNode[] = []

    // 从 calculations 数组提取
    if (config.data_layer?.calculations) {
      config.data_layer.calculations.forEach((calc, i) => {
        indicators.push({
          id: `ind-calc-${i}`,
          type: 'indicator' as const,
          name: extractIndicatorName(calc),
          params: calc,
        })
      })
    }

    // 从 indicators 对象提取（结构化的指标配置）
    if (config.data_layer?.indicators) {
      const indicatorEntries = Object.entries(config.data_layer.indicators)
      indicatorEntries.forEach(([key, value], i) => {
        const indicatorName = extractIndicatorNameFromConfig(key, value)
        const params = formatIndicatorParams(key, value)
        indicators.push({
          id: `ind-obj-${i}`,
          type: 'indicator' as const,
          name: indicatorName,
          params,
        })
      })
    }

    // 提取入场条件
    const entryConditions: ConditionNode[] = []

    // 从 signal_layer.entry_trigger 提取（数组形式）
    if (config.signal_layer?.entry_trigger && Array.isArray(config.signal_layer.entry_trigger)) {
      config.signal_layer.entry_trigger.forEach((trigger, i) => {
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
    }

    // 从 signal_layer.entry_conditions 提取（可能是数组或对象）
    if (config.signal_layer?.entry_conditions) {
      const entryConditionsConfig = config.signal_layer.entry_conditions
      if (Array.isArray(entryConditionsConfig)) {
        // 数组形式
        entryConditionsConfig.forEach((trigger, i) => {
          const direction = inferDirection(trigger)
          const triggerType = inferTriggerType(trigger)
          entryConditions.push({
            id: `entry-cond-${i}`,
            type: 'condition' as const,
            direction,
            category: 'entry' as const,
            triggerType,
            conditions: [cleanConditionText(trigger)],
            description: cleanConditionText(trigger),
          })
        })
      } else if (typeof entryConditionsConfig === 'object') {
        // 对象形式：{ long: {...} | string, short: {...} | string }
        const { long: longCond, short: shortCond } = entryConditionsConfig as ConditionConfig
        if (longCond) {
          // 支持字符串形式的条件（如 "crossover(BTC_MA5, BTC_MA10)"）
          if (typeof longCond === 'string') {
            entryConditions.push({
              id: 'entry-cond-long',
              type: 'condition' as const,
              direction: 'long',
              category: 'entry' as const,
              triggerType: inferTriggerType(longCond),
              conditions: [longCond],
              description: longCond,
            })
          } else {
            const conditions = extractConditionsFromObject(longCond)
            if (conditions.length > 0) {
              entryConditions.push({
                id: 'entry-cond-long',
                type: 'condition' as const,
                direction: 'long',
                category: 'entry' as const,
                triggerType: inferTriggerTypeFromConditions(conditions),
                conditions,
                description: conditions.join(' AND '),
              })
            }
          }
        }
        if (shortCond) {
          // 支持字符串形式的条件（如 "crossunder(BTC_MA5, BTC_MA10)"）
          if (typeof shortCond === 'string') {
            entryConditions.push({
              id: 'entry-cond-short',
              type: 'condition' as const,
              direction: 'short',
              category: 'entry' as const,
              triggerType: inferTriggerType(shortCond),
              conditions: [shortCond],
              description: shortCond,
            })
          } else {
            const conditions = extractConditionsFromObject(shortCond)
            if (conditions.length > 0) {
              entryConditions.push({
                id: 'entry-cond-short',
                type: 'condition' as const,
                direction: 'short',
                category: 'entry' as const,
                triggerType: inferTriggerTypeFromConditions(conditions),
                conditions,
                description: conditions.join(' AND '),
              })
            }
          }
        }
      }
    }

    // 从 signal_layer.entry_long 提取做多入场条件（可能是数组或对象）
    if (config.signal_layer?.entry_long) {
      const entryLong = config.signal_layer.entry_long
      if (Array.isArray(entryLong)) {
        // 数组形式
        entryLong.forEach((trigger, i) => {
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
      } else if (typeof entryLong === 'object') {
        // 对象形式：{ condition: "...", side: "Buy", symbol: "..." }
        const condConfig = entryLong as ConditionConfig
        const desc = condConfig.condition || `${condConfig.side || 'Long'} ${condConfig.symbol || ''}`
        entryConditions.push({
          id: 'entry-long-obj',
          type: 'condition' as const,
          direction: 'long',
          category: 'entry' as const,
          triggerType: inferTriggerType(desc),
          conditions: [desc],
          description: desc,
        })
      }
    }

    // 从 signal_layer.entry_short 提取做空入场条件（可能是数组或对象）
    if (config.signal_layer?.entry_short) {
      const entryShort = config.signal_layer.entry_short
      if (Array.isArray(entryShort)) {
        // 数组形式
        entryShort.forEach((trigger, i) => {
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
      } else if (typeof entryShort === 'object') {
        // 对象形式：{ condition: "...", side: "Sell", symbol: "..." }
        const condConfig = entryShort as ConditionConfig
        const desc = condConfig.condition || `${condConfig.side || 'Short'} ${condConfig.symbol || ''}`
        entryConditions.push({
          id: 'entry-short-obj',
          type: 'condition' as const,
          direction: 'short',
          category: 'entry' as const,
          triggerType: inferTriggerType(desc),
          conditions: [desc],
          description: desc,
        })
      }
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

    // 从 signal_layer.add_position_trigger 添加加仓条件
    if (config.signal_layer?.add_position_trigger) {
      config.signal_layer.add_position_trigger.forEach((trigger, i) => {
        const direction = inferDirection(trigger)
        entryConditions.push({
          id: `entry-add-${i}`,
          type: 'condition' as const,
          direction,
          category: 'entry' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(trigger)],
          description: `Add Position: ${cleanConditionText(trigger)}`,
        })
      })
    }

    // 从 signal_layer.signal_strength 添加信号强度描述
    if (config.signal_layer?.signal_strength) {
      config.signal_layer.signal_strength.forEach((strength, i) => {
        const direction = inferDirection(strength)
        entryConditions.push({
          id: `entry-strength-${i}`,
          type: 'condition' as const,
          direction,
          category: 'entry' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(strength)],
          description: cleanConditionText(strength),
        })
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

    // 从 signal_layer.exit_trigger 提取（数组形式）
    if (config.signal_layer?.exit_trigger && Array.isArray(config.signal_layer.exit_trigger)) {
      config.signal_layer.exit_trigger.forEach((trigger, i) => {
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
    }

    // 从 signal_layer.exit_conditions 提取（可能是数组或对象）
    if (config.signal_layer?.exit_conditions) {
      const exitConditionsConfig = config.signal_layer.exit_conditions
      if (Array.isArray(exitConditionsConfig)) {
        // 数组形式
        exitConditionsConfig.forEach((trigger, i) => {
          const direction = inferDirection(trigger)
          const triggerType = inferExitTriggerType(trigger)
          exitConditions.push({
            id: `exit-cond-${i}`,
            type: 'condition' as const,
            direction,
            category: 'exit' as const,
            triggerType,
            conditions: [cleanConditionText(trigger)],
            description: cleanConditionText(trigger),
          })
        })
      } else if (typeof exitConditionsConfig === 'object') {
        // 检查是否是 { long: string, short: string } 形式
        const exitObj = exitConditionsConfig as Record<string, boolean | string>
        if ('long' in exitObj || 'short' in exitObj) {
          // { long: "crossunder(...)", short: "crossover(...)" } 形式
          if (exitObj.long && typeof exitObj.long === 'string') {
            exitConditions.push({
              id: 'exit-cond-long',
              type: 'condition' as const,
              direction: 'long',
              category: 'exit' as const,
              triggerType: inferExitTriggerType(exitObj.long),
              conditions: [exitObj.long],
              description: `Exit Long: ${exitObj.long}`,
            })
          }
          if (exitObj.short && typeof exitObj.short === 'string') {
            exitConditions.push({
              id: 'exit-cond-short',
              type: 'condition' as const,
              direction: 'short',
              category: 'exit' as const,
              triggerType: inferExitTriggerType(exitObj.short),
              conditions: [exitObj.short],
              description: `Exit Short: ${exitObj.short}`,
            })
          }
        } else {
          // 对象形式：{ stop_loss_hit: true, take_profit_hit: true, opposite_signal: true }
          const conditions = extractConditionsFromObject(exitObj)
          if (conditions.length > 0) {
            exitConditions.push({
              id: 'exit-cond-obj',
              type: 'condition' as const,
              direction: 'both',
              category: 'exit' as const,
              triggerType: inferTriggerTypeFromConditions(conditions),
              conditions,
              description: conditions.join(' OR '),
            })
          }
        }
      }
    }

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
    const tpValue = extractStopValue(config.risk_layer?.tp || config.risk_layer?.take_profit)
    if (tpValue && tpValue !== 'N/A' && tpValue !== '') {
      exitConditions.push({
        id: 'exit-tp',
        type: 'condition' as const,
        direction: 'both',
        category: 'exit' as const,
        triggerType: 'take_profit',
        conditions: [`Take Profit: ${tpValue}`],
        description: `Take Profit: ${tpValue}`,
      })
    }

    const slValue = extractStopValue(config.risk_layer?.sl || config.risk_layer?.stop_loss)
    if (slValue && slValue !== 'N/A' && slValue !== '') {
      exitConditions.push({
        id: 'exit-sl',
        type: 'condition' as const,
        direction: 'both',
        category: 'exit' as const,
        triggerType: 'stop_loss',
        conditions: [`Stop Loss: ${slValue}`],
        description: `Stop Loss: ${slValue}`,
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
      const emergencyExitValue = formatEmergencyExit(config.risk_layer.emergency_exit)
      exitConditions.push({
        id: 'exit-emergency',
        type: 'condition' as const,
        direction: 'both',
        category: 'exit' as const,
        triggerType: 'stop_loss',
        conditions: [`Emergency Exit: ${emergencyExitValue}`],
        description: `Emergency Exit: ${emergencyExitValue}`,
      })
    }

    // 提取风险参数
    const leverage = extractLeverage(config)
    const positionSize = extractPositionSize(config)
    const takeProfit = extractStopValue(config.risk_layer?.tp || config.risk_layer?.take_profit) || 'Dynamic'
    const stopLoss = extractStopValue(config.risk_layer?.sl || config.risk_layer?.stop_loss) || 'Dynamic'
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
    if (maxPositions) additionalRiskParams.maxPositions = String(maxPositions)
    if (config.risk_layer?.position_limits) {
      const posLimits = config.risk_layer.position_limits
      if (typeof posLimits === 'string') {
        additionalRiskParams.positionLimits = posLimits
      } else {
        // 对象形式转换为字符串
        const parts = []
        if (posLimits.no_hedging) parts.push('No Hedging')
        if (posLimits.no_pyramiding) parts.push('No Pyramiding')
        if (parts.length > 0) additionalRiskParams.positionLimits = parts.join(', ')
      }
    }
    if (config.risk_layer?.drawdown_priority)
      additionalRiskParams.drawdownPriority = config.risk_layer.drawdown_priority
    if (config.risk_layer?.market_neutral) additionalRiskParams.marketNeutral = config.risk_layer.market_neutral
    if (config.risk_layer?.funding_rate_check)
      additionalRiskParams.fundingRateCheck = config.risk_layer.funding_rate_check

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
  } catch (error) {
    console.error('[strategyConfigToVisualization] Failed to convert config:', error)
    return createDefaultParsedStrategy()
  }
}

/**
 * 从结构化指标配置中提取指标名称
 */
function extractIndicatorNameFromConfig(key: string, config: IndicatorConfig): string {
  const lowerKey = key.toLowerCase()

  // 根据 key 名称确定指标类型
  if (lowerKey.includes('rsi')) return 'RSI'
  if (lowerKey.includes('macd')) return 'MACD'
  if (lowerKey.includes('ema')) return 'EMA'
  if (lowerKey.includes('sma') || lowerKey.includes('ma')) return 'SMA'
  if (lowerKey.includes('bollinger') || lowerKey.includes('bb')) return 'Bollinger Bands'
  if (lowerKey.includes('atr')) return 'ATR'
  if (lowerKey.includes('adx')) return 'ADX'
  if (lowerKey.includes('volume')) return 'Volume'
  if (lowerKey.includes('price')) return 'Price'
  if (lowerKey.includes('cci')) return 'CCI'

  // 根据 config.type 确定指标类型
  if (config.type) {
    const typeUpper = config.type.toUpperCase()
    if (['EMA', 'SMA', 'MA', 'RSI', 'MACD', 'ATR', 'ADX', 'CCI'].includes(typeUpper)) {
      return typeUpper
    }
  }

  // 如果 config 中有 MACD 特有的字段
  if (config.fast_period && config.slow_period && config.signal_period) {
    return 'MACD'
  }

  // 如果是 EMA 配置
  if (config.fast !== undefined || config.slow !== undefined) {
    return 'EMA'
  }

  // 如果有 oversold/overbought，可能是 RSI
  if (config.oversold !== undefined || config.overbought !== undefined) {
    return 'RSI'
  }

  // 默认返回 key 的格式化版本
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * 格式化指标参数为可读字符串
 */
function formatIndicatorParams(key: string, config: IndicatorConfig): string {
  const parts: string[] = []

  // 币种信息
  if (config.symbol) parts.push(config.symbol)
  if (config.symbols?.length) {
    if (Array.isArray(config.symbols)) {
      parts.push(config.symbols.join(', '))
    }
  }

  // 时间周期
  if (config.timeframe) parts.push(config.timeframe)

  // 周期参数
  if (config.period !== undefined) parts.push(`Period: ${config.period}`)
  if (config.fast_period !== undefined) parts.push(`Fast: ${config.fast_period}`)
  if (config.slow_period !== undefined) parts.push(`Slow: ${config.slow_period}`)
  if (config.signal_period !== undefined) parts.push(`Signal: ${config.signal_period}`)
  if (config.fast !== undefined) parts.push(`Fast: ${config.fast}`)
  if (config.slow !== undefined) parts.push(`Slow: ${config.slow}`)

  // RSI 阈值
  if (config.oversold !== undefined) parts.push(`Oversold: ${config.oversold}`)
  if (config.overbought !== undefined) parts.push(`Overbought: ${config.overbought}`)

  // Volume 相关
  if (config.sma_period !== undefined) parts.push(`SMA Period: ${config.sma_period}`)
  if (config.lookback !== undefined) parts.push(`Lookback: ${config.lookback}`)

  if (parts.length === 0) {
    // 如果没有识别的参数，返回 key 的格式化版本
    return key.replace(/_/g, ' ')
  }

  return parts.join(', ')
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
  if (lower.includes('adx')) return 'ADX'
  if (lower.includes('vfi')) return 'VFI'
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
  if (lower.includes('funding') && lower.includes('rate')) return 'Funding Rate'
  if (lower.includes('entry') && lower.includes('price')) return 'Entry Price'
  if (lower.includes('roi')) return 'ROI'
  if (lower.includes('position') && lower.includes('state')) return 'Position State'

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
  if (!text || typeof text !== 'string') return 'both'
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
  if (!text || typeof text !== 'string') return 'signal'
  const lower = text.toLowerCase()

  if (lower.includes('cross')) return 'crossover'
  if (lower.includes('rsi') || lower.includes('macd') || lower.includes('bollinger')) return 'indicator'

  return 'signal'
}

/**
 * 从对象形式的条件配置中提取条件列表
 */
function extractConditionsFromObject(obj: Record<string, boolean | string>): string[] {
  const conditions: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    if (value === true) {
      // 将 key 转换为可读格式，如 "macd_cross_above_signal" -> "MACD Cross Above Signal"
      const readable = key
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      conditions.push(readable)
    } else if (typeof value === 'string') {
      conditions.push(value)
    }
  }

  return conditions
}

/**
 * 从条件列表推断触发类型
 */
function inferTriggerTypeFromConditions(conditions: string[]): ConditionNode['triggerType'] {
  const combined = conditions.join(' ').toLowerCase()

  if (combined.includes('cross')) return 'crossover'
  if (combined.includes('macd') || combined.includes('rsi') || combined.includes('bollinger')) return 'indicator'
  if (combined.includes('profit') || combined.includes('tp')) return 'take_profit'
  if (combined.includes('loss') || combined.includes('sl') || combined.includes('stop')) return 'stop_loss'

  return 'signal'
}

/**
 * 格式化紧急退出条件（支持字符串和对象形式）
 */
function formatEmergencyExit(
  value: string | { action?: string; account_risk_threshold?: number; account_drawdown?: number } | undefined,
): string | undefined {
  if (!value) return undefined

  if (typeof value === 'string') {
    return value
  }

  // 对象形式: { action?: string; account_risk_threshold?: number; account_drawdown?: number }
  const parts: string[] = []
  if (value.action) {
    parts.push(value.action)
  }
  if (value.account_risk_threshold !== undefined) {
    parts.push(`Account Risk Threshold: ${value.account_risk_threshold}%`)
  }
  if (value.account_drawdown !== undefined) {
    parts.push(`Account Drawdown: ${value.account_drawdown}%`)
  }

  return parts.length > 0 ? parts.join(', ') : 'Enabled'
}

/**
 * 提取止损/止盈值（支持字符串和对象形式）
 */
function extractStopValue(value: string | StopConfig | undefined): string | undefined {
  if (!value) return undefined

  if (typeof value === 'string') {
    return value
  }

  // 对象形式
  if (value.type && value.value !== undefined) {
    // { type: "percentage", value: 0.02 } -> "2%"
    if (value.type === 'percentage') {
      return `${(value.value * 100).toFixed(1)}%`
    }
    return `${value.value}`
  }

  // { long: "8% ROI", short: "6% ROI" } 形式
  if (value.long || value.short) {
    const parts = []
    if (value.long) parts.push(`Long: ${value.long}`)
    if (value.short) parts.push(`Short: ${value.short}`)
    return parts.join(', ')
  }

  // { xrp_long: "12% ROI", btc_short: "8% ROI" } 形式
  if (value.xrp_long || value.btc_short) {
    const parts = []
    if (value.xrp_long) parts.push(`XRP Long: ${value.xrp_long}`)
    if (value.btc_short) parts.push(`BTC Short: ${value.btc_short}`)
    return parts.join(', ')
  }

  return undefined
}

/**
 * 提取杠杆倍数（支持字符串和数字形式）
 */
function extractLeverage(config: StrategyConfig): string {
  // 先检查 execution_layer.leverage（可能是 Record<string, number>）
  const execLeverage = config.execution_layer?.leverage
  if (execLeverage !== undefined) {
    if (typeof execLeverage === 'object' && execLeverage !== null) {
      // Record<string, number> 形式，如 { "ETH-PERP": 10 }
      const entries = Object.entries(execLeverage)
      if (entries.length === 1) {
        return `${entries[0][1]}x`
      }
      return entries.map(([symbol, lev]) => `${symbol}: ${lev}x`).join(', ')
    }
    if (typeof execLeverage === 'number') {
      return `${execLeverage}x`
    }
    if (typeof execLeverage === 'string') {
      if (execLeverage.includes('x') || execLeverage.includes('倍')) {
        return execLeverage
      }
      const num = parseFloat(execLeverage)
      if (!isNaN(num)) {
        return `${num}x`
      }
      return execLeverage
    }
  }

  const leverageValue =
    config.capital_layer?.leverage ||
    (config.capital_layer?.position_sizing as PositionSizingConfig | undefined)?.leverage ||
    config.capital_layer?.leverage_management?.max_leverage

  if (leverageValue === undefined) return '1x'

  if (typeof leverageValue === 'number') {
    return `${leverageValue}x`
  }

  // 如果已经包含 x，直接返回
  if (leverageValue.includes('x') || leverageValue.includes('倍')) {
    return leverageValue
  }

  // 尝试解析数字
  const num = parseFloat(leverageValue)
  if (!isNaN(num)) {
    return `${num}x`
  }

  return leverageValue
}

/**
 * 提取仓位大小（支持字符串和对象形式）
 */
function extractPositionSize(config: StrategyConfig): string {
  // 先检查 execution_layer.position_sizing（可能是对象形式）
  const execPositionSizing = config.execution_layer?.position_sizing
  if (execPositionSizing && typeof execPositionSizing === 'object') {
    const ps = execPositionSizing as PositionSizingConfig
    // 支持 { base: "available_balance", type: "percentage", value: 100 } 形式
    if (ps.type && ps.value !== undefined) {
      const baseStr = ps.base ? ` of ${ps.base.replace(/_/g, ' ')}` : ''
      if (ps.type === 'percentage') {
        return `${ps.value}%${baseStr}`
      }
      return `${ps.value} (${ps.type})${baseStr}`
    }
  }

  const positionSizing = config.capital_layer?.position_sizing

  // 字符串形式
  if (typeof positionSizing === 'string') {
    return positionSizing
  }

  // 对象形式
  if (positionSizing && typeof positionSizing === 'object') {
    const ps = positionSizing as PositionSizingConfig

    // 支持 { base: "available_balance", type: "percentage", value: 100 } 形式
    if (ps.type && ps.value !== undefined) {
      const baseStr = ps.base ? ` of ${ps.base.replace(/_/g, ' ')}` : ''
      if (ps.type === 'percentage') {
        return `${ps.value}%${baseStr}`
      }
      return `${ps.value} (${ps.type})${baseStr}`
    }

    // 如果有 long_positions 和 short_positions
    if (ps.long_positions || ps.short_positions) {
      const parts = []
      if (ps.long_positions) parts.push(`Long: ${ps.long_positions}`)
      if (ps.short_positions) parts.push(`Short: ${ps.short_positions}`)
      return parts.join(', ')
    }

    // base_position_percent
    if (ps.base_position_percent !== undefined) {
      return `${ps.base_position_percent}% of available margin`
    }

    // sizing_method
    if (ps.sizing_method) {
      if (ps.risk_per_trade) {
        const risk =
          typeof ps.risk_per_trade === 'object'
            ? `${ps.risk_per_trade.min}-${ps.risk_per_trade.max}%`
            : `${ps.risk_per_trade}%`
        return `${ps.sizing_method} (${risk} risk per trade)`
      }
      return ps.sizing_method
    }
  }

  // 其他字段
  return (
    config.capital_layer?.position_size ||
    config.execution_layer?.position_size ||
    config.capital_layer?.initial_position_size ||
    config.capital_layer?.per_symbol_allocation ||
    config.capital_layer?.max_position ||
    config.capital_layer?.risk_per_trade ||
    '10%'
  )
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

  // 使用 basic_info.strategy_type 如果存在
  if (config.basic_info?.strategy_type) {
    const strategyType = config.basic_info.strategy_type
    // 将下划线转换为空格并首字母大写
    return strategyType
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  // 网格策略
  if (combined.includes('grid')) return 'Grid Strategy'

  // 资金费率策略
  if (combined.includes('funding rate') || combined.includes('funding_rate')) return 'Funding Rate Strategy'

  // 多资产策略
  if (combined.includes('multi-asset') || combined.includes('multi asset') || combined.includes('cross asset'))
    return 'Multi-Asset Strategy'

  // 回调策略
  if (combined.includes('pullback')) return 'Pullback Strategy'

  // 摆动策略
  if (combined.includes('swing')) return 'Swing Strategy'

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
  if (combined.includes('oversold') && (combined.includes('hunter') || combined.includes('rebound')))
    return 'Oversold Strategy'

  // 多重信号确认策略
  if (combined.includes('signal confirmation') || combined.includes('multi-dimensional'))
    return 'Multi-Signal Confirmation'

  // EMA 策略
  if (combined.includes('ema') && (combined.includes('cross') || combined.includes('momentum'))) return 'EMA Strategy'

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

  // 对冲策略
  if (combined.includes('hedge') || combined.includes('hedg')) return 'Hedging Strategy'

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

  // 趋势跟随
  if (combined.includes('trend') && combined.includes('follow')) return 'Trend Following'

  // 多空策略
  if (combined.includes('long-short') || combined.includes('long short') || combined.includes('long/short'))
    return 'Long/Short Strategy'

  // MA 策略（最后检测）
  if (combined.includes(' ma ') || combined.includes('moving average')) return 'MA Strategy'

  // 只做多
  if (combined.includes('long only') || combined.includes('only long')) return 'Long Only Strategy'

  // 只做空
  if (combined.includes('short only') || combined.includes('only short')) return 'Short Only Strategy'

  return name || 'Trading Strategy'
}

export default strategyConfigToVisualization
