/**
 * 将 strategy_config 转换为可视化数据
 *
 * 这是最准确的方案：直接使用源数据，不需要解析代码
 */

import type { ParsedStrategy, ConditionNode, DataSourceNode, IndicatorNode, AnalyzeStep } from './parseStrategyCode'

// ============================================
// 类型安全辅助函数
// ============================================

/**
 * 安全地将任意值转换为字符串
 * - 字符串直接返回
 * - 对象尝试提取常用字段（symbol, name, value, condition 等）或 JSON 序列化
 * - 其他类型转为字符串
 */
function safeString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') {
    // 尝试提取常用字段
    const obj = value as Record<string, unknown>
    if ('symbol' in obj && obj.symbol) return safeString(obj.symbol)
    if ('name' in obj && obj.name) return safeString(obj.name)
    if ('value' in obj && obj.value !== undefined) return safeString(obj.value)
    if ('condition' in obj && obj.condition) return safeString(obj.condition)
    if ('description' in obj && obj.description) return safeString(obj.description)
    // 最后尝试 JSON 序列化（限制长度）
    try {
      const json = JSON.stringify(value)
      return json.length > 100 ? json.substring(0, 97) + '...' : json
    } catch {
      return fallback
    }
  }
  return String(value)
}

/**
 * 安全地将值转换为字符串数组
 */
function safeStringArray(value: unknown): string[] {
  if (!value) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) {
    return value.map((item) => safeString(item)).filter(Boolean)
  }
  return []
}

/**
 * 检查值是否为非空数组
 */
function isNonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * 检查值是否为非空对象（非数组）
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 将 key 转换为可读标签（如 "max_loss" -> "Max Loss"）
 */
function formatKeyToLabel(key: string): string {
  if (!key || typeof key !== 'string') return ''
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

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

    // 提取交易品种（支持多币种，data_layer.symbols 可能是字符串描述或对象数组）
    const getSymbols = (): string[] => {
      // 辅助函数：将 symbol 数组转换为字符串数组
      const normalizeSymbols = (symbols: unknown[]): string[] => {
        return symbols.map((s) => {
          if (typeof s === 'string') return s
          // 如果是对象，尝试提取 symbol 字段
          if (s && typeof s === 'object' && 'symbol' in s) {
            return String((s as { symbol: unknown }).symbol)
          }
          return String(s)
        })
      }

      if (config.basic_info?.symbols) {
        return normalizeSymbols(config.basic_info.symbols)
      }
      if (config.execution_layer?.symbols) {
        return normalizeSymbols(config.execution_layer.symbols)
      }
      if (config.data_layer?.symbols) {
        // data_layer.symbols 可能是字符串描述（如 "Top 50 tokens by market cap"）
        if (typeof config.data_layer.symbols === 'string') {
          return [config.data_layer.symbols]
        }
        return normalizeSymbols(config.data_layer.symbols as unknown[])
      }
      if (config.data_layer?.symbol) {
        const sym = config.data_layer.symbol
        // symbol 也可能是对象
        if (typeof sym === 'string') return [sym]
        if (sym && typeof sym === 'object' && 'symbol' in sym) {
          return [String((sym as { symbol: unknown }).symbol)]
        }
        return [String(sym)]
      }
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
    const dataSources: DataSourceNode[] = []
    const rawDataSources = config.data_layer?.data_sources
    if (isNonEmptyArray(rawDataSources)) {
      rawDataSources.forEach((src, i) => {
        // 确保 src 是字符串类型
        const srcStr = safeString(src)
        if (!srcStr) return
        // 解析数据源字符串，例如 "Market Data (CoinGecko): BTC 1H OHLCV"
        const match = srcStr.match(/^([^(]+)\s*\(([^)]+)\):\s*(.+)$/)
        if (match) {
          dataSources.push({
            id: `ds-${i}`,
            type: 'datasource' as const,
            api: match[2], // CoinGecko
            fields: [match[3]], // BTC 1H OHLCV
          })
        } else {
          dataSources.push({
            id: `ds-${i}`,
            type: 'datasource' as const,
            api: srcStr.split(':')[0] || srcStr,
            fields: [srcStr],
          })
        }
      })
    }

    // 添加外部输入作为数据源（如地缘政治新闻）
    const externalInputs = config.data_layer?.external_inputs
    if (isNonEmptyArray(externalInputs)) {
      externalInputs.forEach((input, i) => {
        const inputStr = safeString(input)
        if (!inputStr) return
        dataSources.push({
          id: `ds-ext-${i}`,
          type: 'datasource' as const,
          api: 'External',
          fields: [inputStr],
        })
      })
    }

    // 添加宏观指标作为数据源
    const macroIndicators = config.data_layer?.macro_indicators
    if (isNonEmptyArray(macroIndicators)) {
      macroIndicators.forEach((indicator, i) => {
        const indicatorStr = safeString(indicator)
        if (!indicatorStr) return
        dataSources.push({
          id: `ds-macro-${i}`,
          type: 'datasource' as const,
          api: 'Macro',
          fields: [indicatorStr],
        })
      })
    }

    // 提取指标（从 calculations 和 indicators 对象推断）
    const indicators: IndicatorNode[] = []

    // 从 calculations 数组提取
    const calculations = config.data_layer?.calculations
    if (isNonEmptyArray(calculations)) {
      calculations.forEach((calc, i) => {
        const calcStr = safeString(calc)
        if (!calcStr) return
        indicators.push({
          id: `ind-calc-${i}`,
          type: 'indicator' as const,
          name: extractIndicatorName(calcStr),
          params: calcStr,
        })
      })
    }

    // 从 indicators 对象提取（结构化的指标配置）
    const indicatorsConfig = config.data_layer?.indicators
    if (isPlainObject(indicatorsConfig)) {
      const indicatorEntries = Object.entries(indicatorsConfig)
      indicatorEntries.forEach(([key, value], i) => {
        if (!key || !isPlainObject(value)) return
        const indicatorName = extractIndicatorNameFromConfig(key, value as IndicatorConfig)
        const params = formatIndicatorParams(key, value as IndicatorConfig)
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
    const entryTrigger = config.signal_layer?.entry_trigger
    if (isNonEmptyArray(entryTrigger)) {
      entryTrigger.forEach((trigger, i) => {
        const triggerStr = safeString(trigger)
        if (!triggerStr) return
        const direction = inferDirection(triggerStr)
        const triggerType = inferTriggerType(triggerStr)

        entryConditions.push({
          id: `entry-${i}`,
          type: 'condition' as const,
          direction,
          category: 'entry' as const,
          triggerType,
          conditions: [cleanConditionText(triggerStr)],
          description: cleanConditionText(triggerStr),
        })
      })
    }

    // 从 signal_layer.entry_conditions 提取（可能是数组或对象）
    const entryConditionsConfig = config.signal_layer?.entry_conditions
    if (entryConditionsConfig) {
      if (Array.isArray(entryConditionsConfig)) {
        // 数组形式
        entryConditionsConfig.forEach((trigger, i) => {
          const triggerStr = safeString(trigger)
          if (!triggerStr) return
          const direction = inferDirection(triggerStr)
          const triggerType = inferTriggerType(triggerStr)
          entryConditions.push({
            id: `entry-cond-${i}`,
            type: 'condition' as const,
            direction,
            category: 'entry' as const,
            triggerType,
            conditions: [cleanConditionText(triggerStr)],
            description: cleanConditionText(triggerStr),
          })
        })
      } else if (isPlainObject(entryConditionsConfig)) {
        const condConfigObj = entryConditionsConfig as Record<string, unknown>

        // 检查是否有 stage1_detection / stage2_confirmation 结构（Persistence Trader 格式）
        if ('stage1_detection' in condConfigObj || 'stage2_confirmation' in condConfigObj) {
          // 处理 stage1_detection
          const stage1 = condConfigObj.stage1_detection
          if (isPlainObject(stage1)) {
            const stage1Obj = stage1 as Record<string, unknown>
            // 提取 golden_cross (做多信号)
            if (stage1Obj.golden_cross && typeof stage1Obj.golden_cross === 'string') {
              entryConditions.push({
                id: 'entry-stage1-long',
                type: 'condition' as const,
                direction: 'long',
                category: 'entry' as const,
                triggerType: 'crossover',
                conditions: [`Stage 1: ${stage1Obj.golden_cross}`],
                description: `Stage 1 Detection: ${stage1Obj.golden_cross}`,
              })
            }
            // 提取 death_cross (做空信号)
            if (stage1Obj.death_cross && typeof stage1Obj.death_cross === 'string') {
              entryConditions.push({
                id: 'entry-stage1-short',
                type: 'condition' as const,
                direction: 'short',
                category: 'entry' as const,
                triggerType: 'crossover',
                conditions: [`Stage 1: ${stage1Obj.death_cross}`],
                description: `Stage 1 Detection: ${stage1Obj.death_cross}`,
              })
            }
          }
          // 处理 stage2_confirmation
          const stage2 = condConfigObj.stage2_confirmation
          if (isPlainObject(stage2)) {
            const stage2Obj = stage2 as Record<string, unknown>
            // 提取 long_conditions
            if (Array.isArray(stage2Obj.long_conditions)) {
              const longConds = safeStringArray(stage2Obj.long_conditions)
              if (longConds.length > 0) {
                entryConditions.push({
                  id: 'entry-stage2-long',
                  type: 'condition' as const,
                  direction: 'long',
                  category: 'entry' as const,
                  triggerType: 'indicator',
                  conditions: longConds,
                  description: `Stage 2 Confirmation (Long): ${longConds.slice(0, 2).join(', ')}${longConds.length > 2 ? '...' : ''}`,
                })
              }
            }
            // 提取 short_conditions
            if (Array.isArray(stage2Obj.short_conditions)) {
              const shortConds = safeStringArray(stage2Obj.short_conditions)
              if (shortConds.length > 0) {
                entryConditions.push({
                  id: 'entry-stage2-short',
                  type: 'condition' as const,
                  direction: 'short',
                  category: 'entry' as const,
                  triggerType: 'indicator',
                  conditions: shortConds,
                  description: `Stage 2 Confirmation (Short): ${shortConds.slice(0, 2).join(', ')}${shortConds.length > 2 ? '...' : ''}`,
                })
              }
            }
          }
        } else {
          // 标准对象形式：{ long: {...} | string, short: {...} | string }
          const condConfig = entryConditionsConfig as ConditionConfig
          const longCond = condConfig.long
          const shortCond = condConfig.short
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
            } else if (isPlainObject(longCond)) {
              const conditions = extractConditionsFromObject(longCond as Record<string, boolean | string>)
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
            } else if (isPlainObject(shortCond)) {
              const conditions = extractConditionsFromObject(shortCond as Record<string, boolean | string>)
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

          // 处理其他嵌套的条件对象（如 { max_loss: string, trailing_stop: string } 结构）
          // 遍历所有键，如果值是字符串，则作为条件添加
          for (const [key, value] of Object.entries(condConfigObj)) {
            if (key === 'long' || key === 'short') continue // 已经处理过
            if (typeof value === 'string') {
              const direction = inferDirection(value)
              entryConditions.push({
                id: `entry-cond-${key}`,
                type: 'condition' as const,
                direction,
                category: 'entry' as const,
                triggerType: inferTriggerType(value),
                conditions: [value],
                description: `${formatKeyToLabel(key)}: ${value}`,
              })
            }
          }
        }
      }
    }

    // 从 signal_layer.entry_long 提取做多入场条件（可能是数组或对象）
    const entryLong = config.signal_layer?.entry_long
    if (entryLong) {
      if (Array.isArray(entryLong)) {
        // 数组形式
        entryLong.forEach((trigger, i) => {
          const triggerStr = safeString(trigger)
          if (!triggerStr) return
          const triggerType = inferTriggerType(triggerStr)
          entryConditions.push({
            id: `entry-long-${i}`,
            type: 'condition' as const,
            direction: 'long',
            category: 'entry' as const,
            triggerType,
            conditions: [cleanConditionText(triggerStr)],
            description: cleanConditionText(triggerStr),
          })
        })
      } else if (isPlainObject(entryLong)) {
        // 对象形式：{ condition: "...", side: "Buy", symbol: "..." }
        const condConfig = entryLong as ConditionConfig
        const desc =
          safeString(condConfig.condition) || `${safeString(condConfig.side, 'Long')} ${safeString(condConfig.symbol)}`
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
    const entryShort = config.signal_layer?.entry_short
    if (entryShort) {
      if (Array.isArray(entryShort)) {
        // 数组形式
        entryShort.forEach((trigger, i) => {
          const triggerStr = safeString(trigger)
          if (!triggerStr) return
          const triggerType = inferTriggerType(triggerStr)
          entryConditions.push({
            id: `entry-short-${i}`,
            type: 'condition' as const,
            direction: 'short',
            category: 'entry' as const,
            triggerType,
            conditions: [cleanConditionText(triggerStr)],
            description: cleanConditionText(triggerStr),
          })
        })
      } else if (isPlainObject(entryShort)) {
        // 对象形式：{ condition: "...", side: "Sell", symbol: "..." }
        const condConfig = entryShort as ConditionConfig
        const desc =
          safeString(condConfig.condition) || `${safeString(condConfig.side, 'Short')} ${safeString(condConfig.symbol)}`
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
    const selectionLogic = config.signal_layer?.selection_logic
    if (isNonEmptyArray(selectionLogic)) {
      selectionLogic.forEach((logic, i) => {
        const logicStr = safeString(logic)
        if (!logicStr) return
        const direction = inferDirection(logicStr)
        entryConditions.push({
          id: `entry-selection-${i}`,
          type: 'condition' as const,
          direction,
          category: 'entry' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(logicStr)],
          description: cleanConditionText(logicStr),
        })
      })
    }

    // 从 signal_layer.grid_logic 添加网格逻辑
    const gridLogic = config.signal_layer?.grid_logic
    if (gridLogic) {
      const gridLogicStr = safeString(gridLogic)
      if (gridLogicStr) {
        entryConditions.push({
          id: 'entry-grid',
          type: 'condition' as const,
          direction: 'both',
          category: 'entry' as const,
          triggerType: 'signal',
          conditions: [gridLogicStr],
          description: gridLogicStr,
        })
      }
    }

    // 从 signal_layer.add_position_trigger 添加加仓条件
    const addPositionTrigger = config.signal_layer?.add_position_trigger
    if (isNonEmptyArray(addPositionTrigger)) {
      addPositionTrigger.forEach((trigger, i) => {
        const triggerStr = safeString(trigger)
        if (!triggerStr) return
        const direction = inferDirection(triggerStr)
        entryConditions.push({
          id: `entry-add-${i}`,
          type: 'condition' as const,
          direction,
          category: 'entry' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(triggerStr)],
          description: `Add Position: ${cleanConditionText(triggerStr)}`,
        })
      })
    }

    // 从 signal_layer.signal_strength 添加信号强度描述
    const signalStrength = config.signal_layer?.signal_strength
    if (isNonEmptyArray(signalStrength)) {
      signalStrength.forEach((strength, i) => {
        const strengthStr = safeString(strength)
        if (!strengthStr) return
        const direction = inferDirection(strengthStr)
        entryConditions.push({
          id: `entry-strength-${i}`,
          type: 'condition' as const,
          direction,
          category: 'entry' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(strengthStr)],
          description: cleanConditionText(strengthStr),
        })
      })
    }

    // 从 execution_layer 补充入场条件
    if (entryConditions.length === 0) {
      const longEntryCondition = config.execution_layer?.long_entry?.condition
      if (longEntryCondition) {
        const condStr = safeString(longEntryCondition)
        if (condStr) {
          entryConditions.push({
            id: 'entry-long',
            type: 'condition' as const,
            direction: 'long',
            category: 'entry' as const,
            triggerType: 'signal',
            conditions: [condStr],
            description: condStr,
          })
        }
      }
      const shortEntryCondition = config.execution_layer?.short_entry?.condition
      if (shortEntryCondition) {
        const condStr = safeString(shortEntryCondition)
        if (condStr) {
          entryConditions.push({
            id: 'entry-short',
            type: 'condition' as const,
            direction: 'short',
            category: 'entry' as const,
            triggerType: 'signal',
            conditions: [condStr],
            description: condStr,
          })
        }
      }
    }

    // 提取退出条件
    const exitConditions: ConditionNode[] = []

    // 从 signal_layer.exit_trigger 提取（数组形式）
    const exitTrigger = config.signal_layer?.exit_trigger
    if (isNonEmptyArray(exitTrigger)) {
      exitTrigger.forEach((trigger, i) => {
        const triggerStr = safeString(trigger)
        if (!triggerStr) return
        const direction = inferDirection(triggerStr)
        const triggerType = inferExitTriggerType(triggerStr)

        exitConditions.push({
          id: `exit-${i}`,
          type: 'condition' as const,
          direction,
          category: 'exit' as const,
          triggerType,
          conditions: [cleanConditionText(triggerStr)],
          description: cleanConditionText(triggerStr),
        })
      })
    }

    // 从 signal_layer.exit_conditions 提取（可能是数组或对象）
    const exitConditionsConfig = config.signal_layer?.exit_conditions
    if (exitConditionsConfig) {
      if (Array.isArray(exitConditionsConfig)) {
        // 数组形式
        exitConditionsConfig.forEach((trigger, i) => {
          const triggerStr = safeString(trigger)
          if (!triggerStr) return
          const direction = inferDirection(triggerStr)
          const triggerType = inferExitTriggerType(triggerStr)
          exitConditions.push({
            id: `exit-cond-${i}`,
            type: 'condition' as const,
            direction,
            category: 'exit' as const,
            triggerType,
            conditions: [cleanConditionText(triggerStr)],
            description: cleanConditionText(triggerStr),
          })
        })
      } else if (isPlainObject(exitConditionsConfig)) {
        // 检查是否是 { long: string, short: string } 形式
        const exitObj = exitConditionsConfig as Record<string, unknown>
        if ('long' in exitObj || 'short' in exitObj) {
          // { long: "crossunder(...)", short: "crossover(...)" } 形式
          const longVal = exitObj.long
          if (longVal && typeof longVal === 'string') {
            exitConditions.push({
              id: 'exit-cond-long',
              type: 'condition' as const,
              direction: 'long',
              category: 'exit' as const,
              triggerType: inferExitTriggerType(longVal),
              conditions: [longVal],
              description: `Exit Long: ${longVal}`,
            })
          }
          const shortVal = exitObj.short
          if (shortVal && typeof shortVal === 'string') {
            exitConditions.push({
              id: 'exit-cond-short',
              type: 'condition' as const,
              direction: 'short',
              category: 'exit' as const,
              triggerType: inferExitTriggerType(shortVal),
              conditions: [shortVal],
              description: `Exit Short: ${shortVal}`,
            })
          }
        } else {
          // 处理其他对象形式，如：
          // { max_loss: "Stop loss at -5%", trailing_stop: "...", opposite_cross: "..." }
          // 或 { stop_loss_hit: true, take_profit_hit: true }
          let hasStringValues = false
          for (const [key, value] of Object.entries(exitObj)) {
            if (typeof value === 'string') {
              hasStringValues = true
              const triggerType = inferExitTriggerType(value)
              exitConditions.push({
                id: `exit-cond-${key}`,
                type: 'condition' as const,
                direction: 'both',
                category: 'exit' as const,
                triggerType,
                conditions: [value],
                description: `${formatKeyToLabel(key)}: ${value}`,
              })
            }
          }

          // 如果没有字符串值，尝试提取布尔条件
          if (!hasStringValues) {
            const conditions = extractConditionsFromObject(exitObj as Record<string, boolean | string>)
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
    }

    // 从 signal_layer.rebalance_trigger 添加再平衡触发条件
    const rebalanceTrigger = config.signal_layer?.rebalance_trigger
    if (isNonEmptyArray(rebalanceTrigger)) {
      rebalanceTrigger.forEach((trigger, i) => {
        const triggerStr = safeString(trigger)
        if (!triggerStr) return
        exitConditions.push({
          id: `exit-rebalance-${i}`,
          type: 'condition' as const,
          direction: 'both',
          category: 'exit' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(triggerStr)],
          description: cleanConditionText(triggerStr),
        })
      })
    }

    // 从 signal_layer.position_management 添加仓位管理规则
    const positionManagement = config.signal_layer?.position_management
    if (isNonEmptyArray(positionManagement)) {
      positionManagement.forEach((rule, i) => {
        const ruleStr = safeString(rule)
        if (!ruleStr) return
        exitConditions.push({
          id: `exit-mgmt-${i}`,
          type: 'condition' as const,
          direction: 'both',
          category: 'exit' as const,
          triggerType: 'signal',
          conditions: [cleanConditionText(ruleStr)],
          description: cleanConditionText(ruleStr),
        })
      })
    }

    // 从 execution_layer 补充退出条件
    const exitCondition = config.execution_layer?.exit?.condition
    if (exitCondition) {
      const exitConditionStr = safeString(exitCondition)
      if (exitConditionStr) {
        exitConditions.push({
          id: 'exit-signal',
          type: 'condition' as const,
          direction: 'both',
          category: 'exit' as const,
          triggerType: 'signal',
          conditions: [exitConditionStr],
          description: exitConditionStr,
        })
      }
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
    const timeExit = config.risk_layer?.time_exit
    if (timeExit) {
      const timeExitStr = safeString(timeExit)
      if (timeExitStr) {
        exitConditions.push({
          id: 'exit-time',
          type: 'condition' as const,
          direction: 'both',
          category: 'exit' as const,
          triggerType: 'signal',
          conditions: [`Time Exit: ${timeExitStr}`],
          description: `Time Exit: ${timeExitStr}`,
        })
      }
    }

    // 添加紧急退出条件
    const emergencyExit = config.risk_layer?.emergency_exit
    if (emergencyExit) {
      const emergencyExitValue = formatEmergencyExit(emergencyExit)
      if (emergencyExitValue) {
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
    }

    // 提取风险参数
    const leverage = extractLeverage(config)
    const positionSize = extractPositionSize(config)
    const takeProfit = extractStopValue(config.risk_layer?.tp || config.risk_layer?.take_profit) || 'Dynamic'
    const stopLoss = extractStopValue(config.risk_layer?.sl || config.risk_layer?.stop_loss) || 'Dynamic'
    const hardStops = safeStringArray(config.risk_layer?.hard_stop)

    // 提取额外的资本层参数
    const marginType = config.capital_layer?.margin_type
    const maxExposure = config.capital_layer?.max_total_exposure
    const rebalanceRule = config.capital_layer?.rebalance_rule
    const maxPositions = config.capital_layer?.max_positions

    // 构建分析步骤
    const calcDescriptions = safeStringArray(config.data_layer?.calculations).slice(0, 3)
    const analyzeSteps: AnalyzeStep[] = [
      {
        id: 'step-1',
        label: 'Fetch Data',
        description: dataSources.map((ds) => ds.api).join(', ') || 'Market Data',
      },
      {
        id: 'step-2',
        label: 'Calculate',
        description: calcDescriptions.length > 0 ? calcDescriptions.join(', ') : 'Price Analysis',
      },
      {
        id: 'step-3',
        label: 'Check Signals',
        description: 'Evaluate entry/exit conditions',
      },
    ]

    // 如果有网格参数，添加网格步骤
    const gridParams = config.data_layer?.grid_parameters
    if (isPlainObject(gridParams)) {
      const gridLevels = typeof gridParams.grid_levels === 'number' ? gridParams.grid_levels : 10
      const gridSpacing = safeString(gridParams.grid_spacing, '2%')
      analyzeSteps.push({
        id: 'step-4',
        label: 'Grid Management',
        description: `${gridLevels} levels, ${gridSpacing} spacing`,
      })
    }

    // 如果有再平衡逻辑，添加再平衡步骤
    if (config.signal_layer?.rebalance_trigger || config.execution_layer?.rebalance_mechanism) {
      const updateFreq = safeString(config.data_layer?.update_frequency, 'Periodic rebalancing')
      analyzeSteps.push({
        id: 'step-rebalance',
        label: 'Rebalance',
        description: updateFreq,
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
      } else if (isPlainObject(posLimits)) {
        // 对象形式转换为字符串
        const parts: string[] = []
        const limitsObj = posLimits as Record<string, unknown>
        if (limitsObj.no_hedging) parts.push('No Hedging')
        if (limitsObj.no_pyramiding) parts.push('No Pyramiding')
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
  if (!key || typeof key !== 'string') return 'Indicator'
  if (!config || typeof config !== 'object') return key

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
  if (config.type && typeof config.type === 'string') {
    const typeUpper = config.type.toUpperCase()
    if (['EMA', 'SMA', 'MA', 'RSI', 'MACD', 'ATR', 'ADX', 'CCI'].includes(typeUpper)) {
      return typeUpper
    }
  }

  // 如果 config 中有 MACD 特有的字段
  if (
    typeof config.fast_period === 'number' &&
    typeof config.slow_period === 'number' &&
    typeof config.signal_period === 'number'
  ) {
    return 'MACD'
  }

  // 如果是 EMA 配置
  if (typeof config.fast === 'number' || typeof config.slow === 'number') {
    return 'EMA'
  }

  // 如果有 oversold/overbought，可能是 RSI
  if (typeof config.oversold === 'number' || typeof config.overbought === 'number') {
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
  if (!config || typeof config !== 'object') {
    return typeof key === 'string' ? key.replace(/_/g, ' ') : ''
  }

  const parts: string[] = []

  // 币种信息
  if (config.symbol && typeof config.symbol === 'string') {
    parts.push(config.symbol)
  }
  if (Array.isArray(config.symbols) && config.symbols.length > 0) {
    const symbolStrs = config.symbols.filter((s): s is string => typeof s === 'string')
    if (symbolStrs.length > 0) {
      parts.push(symbolStrs.join(', '))
    }
  }

  // 时间周期
  if (config.timeframe && typeof config.timeframe === 'string') {
    parts.push(config.timeframe)
  }

  // 周期参数
  if (typeof config.period === 'number') parts.push(`Period: ${config.period}`)
  if (typeof config.fast_period === 'number') parts.push(`Fast: ${config.fast_period}`)
  if (typeof config.slow_period === 'number') parts.push(`Slow: ${config.slow_period}`)
  if (typeof config.signal_period === 'number') parts.push(`Signal: ${config.signal_period}`)
  if (typeof config.fast === 'number') parts.push(`Fast: ${config.fast}`)
  if (typeof config.slow === 'number') parts.push(`Slow: ${config.slow}`)

  // RSI 阈值
  if (typeof config.oversold === 'number') parts.push(`Oversold: ${config.oversold}`)
  if (typeof config.overbought === 'number') parts.push(`Overbought: ${config.overbought}`)

  // Volume 相关
  if (typeof config.sma_period === 'number') parts.push(`SMA Period: ${config.sma_period}`)
  if (typeof config.lookback === 'number') parts.push(`Lookback: ${config.lookback}`)

  if (parts.length === 0) {
    // 如果没有识别的参数，返回 key 的格式化版本
    return typeof key === 'string' ? key.replace(/_/g, ' ') : ''
  }

  return parts.join(', ')
}

/**
 * 从计算描述中提取指标名称
 */
function extractIndicatorName(calc: unknown): string {
  if (!calc || typeof calc !== 'string') return 'Indicator'
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
function inferDirection(text: unknown): 'long' | 'short' | 'both' {
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
  if (rsiMatch && rsiMatch[1] && rsiMatch[2]) {
    const low = parseInt(rsiMatch[1], 10)
    const high = parseInt(rsiMatch[2], 10)
    if (!isNaN(low) && !isNaN(high)) {
      if (low <= 30) return 'long' // 超卖区间
      if (high >= 70) return 'short' // 超买区间
    }
  }

  return 'both'
}

/**
 * 从条件文本推断触发类型
 */
function inferTriggerType(text: unknown): ConditionNode['triggerType'] {
  if (!text || typeof text !== 'string') return 'signal'
  const lower = text.toLowerCase()

  if (lower.includes('cross')) return 'crossover'
  if (lower.includes('rsi') || lower.includes('macd') || lower.includes('bollinger')) return 'indicator'

  return 'signal'
}

/**
 * 从对象形式的条件配置中提取条件列表
 */
function extractConditionsFromObject(obj: unknown): string[] {
  const conditions: string[] = []

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return conditions
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (!key || typeof key !== 'string') continue

    if (value === true) {
      // 将 key 转换为可读格式，如 "macd_cross_above_signal" -> "MACD Cross Above Signal"
      const readable = key
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      conditions.push(readable)
    } else if (typeof value === 'string' && value) {
      conditions.push(value)
    }
  }

  return conditions
}

/**
 * 从条件列表推断触发类型
 */
function inferTriggerTypeFromConditions(conditions: unknown): ConditionNode['triggerType'] {
  if (!Array.isArray(conditions)) return 'signal'

  const combined = conditions
    .filter((c): c is string => typeof c === 'string')
    .join(' ')
    .toLowerCase()

  if (combined.includes('cross')) return 'crossover'
  if (combined.includes('macd') || combined.includes('rsi') || combined.includes('bollinger')) return 'indicator'
  if (combined.includes('profit') || combined.includes('tp')) return 'take_profit'
  if (combined.includes('loss') || combined.includes('sl') || combined.includes('stop')) return 'stop_loss'

  return 'signal'
}

/**
 * 格式化紧急退出条件（支持字符串和对象形式）
 */
function formatEmergencyExit(value: unknown): string | undefined {
  if (!value) return undefined

  if (typeof value === 'string') {
    return value
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return String(value)
  }

  // 对象形式: { action?: string; account_risk_threshold?: number; account_drawdown?: number }
  const obj = value as Record<string, unknown>
  const parts: string[] = []

  if (obj.action && typeof obj.action === 'string') {
    parts.push(obj.action)
  }
  if (typeof obj.account_risk_threshold === 'number') {
    parts.push(`Account Risk Threshold: ${obj.account_risk_threshold}%`)
  }
  if (typeof obj.account_drawdown === 'number') {
    parts.push(`Account Drawdown: ${obj.account_drawdown}%`)
  }

  return parts.length > 0 ? parts.join(', ') : 'Enabled'
}

/**
 * 提取止损/止盈值（支持字符串和对象形式）
 */
function extractStopValue(value: unknown): string | undefined {
  if (!value) return undefined

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return String(value)
  }

  const obj = value as Record<string, unknown>

  // 对象形式
  if (typeof obj.type === 'string' && typeof obj.value === 'number') {
    // { type: "percentage", value: 0.02 } -> "2%"
    if (obj.type === 'percentage') {
      return `${(obj.value * 100).toFixed(1)}%`
    }
    return `${obj.value}`
  }

  // { long: "8% ROI", short: "6% ROI" } 形式
  if (obj.long || obj.short) {
    const parts: string[] = []
    if (obj.long && typeof obj.long === 'string') parts.push(`Long: ${obj.long}`)
    if (obj.short && typeof obj.short === 'string') parts.push(`Short: ${obj.short}`)
    if (parts.length > 0) return parts.join(', ')
  }

  // { xrp_long: "12% ROI", btc_short: "8% ROI" } 形式
  if (obj.xrp_long || obj.btc_short) {
    const parts: string[] = []
    if (obj.xrp_long && typeof obj.xrp_long === 'string') parts.push(`XRP Long: ${obj.xrp_long}`)
    if (obj.btc_short && typeof obj.btc_short === 'string') parts.push(`BTC Short: ${obj.btc_short}`)
    if (parts.length > 0) return parts.join(', ')
  }

  return undefined
}

/**
 * 提取杠杆倍数（支持字符串和数字形式）
 */
function extractLeverage(config: StrategyConfig): string {
  // 先检查 execution_layer.leverage（可能是 Record<string, number | string>）
  const execLeverage = config.execution_layer?.leverage
  if (execLeverage !== undefined) {
    if (typeof execLeverage === 'object' && execLeverage !== null && !Array.isArray(execLeverage)) {
      // Record<string, number | string> 形式，如 { "ETH-PERP": 10 } 或 { "BTC-PERP": "3x" }
      // 强制转换为通用类型以支持字符串值
      const leverageObj = execLeverage as Record<string, unknown>
      const entries = Object.entries(leverageObj)
      if (entries.length === 0) {
        // 空对象，继续检查其他来源
      } else if (entries.length === 1) {
        const [, lev] = entries[0]
        // 值可能是数字或字符串
        const levStr = safeString(lev)
        if (levStr.includes('x') || levStr.includes('倍')) {
          return levStr
        }
        const num = parseFloat(levStr)
        if (!isNaN(num)) {
          return `${num}x`
        }
        return levStr || '1x'
      } else {
        // 多个币种的杠杆，合并显示
        const formatted = entries.map(([symbol, lev]) => {
          const levStr = safeString(lev)
          if (levStr.includes('x') || levStr.includes('倍')) {
            return `${symbol}: ${levStr}`
          }
          const num = parseFloat(levStr)
          if (!isNaN(num)) {
            return `${symbol}: ${num}x`
          }
          return `${symbol}: ${levStr}`
        })
        // 如果所有杠杆都相同，只显示一个
        const uniqueLeverages = [...new Set(entries.map(([, lev]) => safeString(lev)))]
        if (uniqueLeverages.length === 1) {
          const levStr = uniqueLeverages[0]
          if (levStr.includes('x') || levStr.includes('倍')) {
            return levStr
          }
          const num = parseFloat(levStr)
          if (!isNaN(num)) {
            return `${num}x`
          }
          return levStr || '1x'
        }
        return formatted.join(', ')
      }
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
      if (ps.risk_per_trade !== undefined) {
        let risk = ''
        if (typeof ps.risk_per_trade === 'number') {
          risk = `${ps.risk_per_trade}%`
        } else if (isPlainObject(ps.risk_per_trade)) {
          const riskObj = ps.risk_per_trade as Record<string, unknown>
          const minVal = typeof riskObj.min === 'number' ? riskObj.min : 0
          const maxVal = typeof riskObj.max === 'number' ? riskObj.max : 0
          risk = `${minVal}-${maxVal}%`
        } else {
          risk = safeString(ps.risk_per_trade)
        }
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
function inferExitTriggerType(text: unknown): ConditionNode['triggerType'] {
  if (!text || typeof text !== 'string') return 'signal'

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
function cleanConditionText(text: unknown): string {
  if (!text || typeof text !== 'string') return ''
  // 移除 "Long:" 或 "Short:" 等前缀
  return text.replace(/^(Long|Short|Entry|Exit):\s*/i, '').trim()
}

/**
 * 推断策略类型
 */
function inferStrategyType(name: unknown, vibe: unknown, config: StrategyConfig): string {
  const nameStr = typeof name === 'string' ? name : ''
  const vibeStr = typeof vibe === 'string' ? vibe : ''

  let configStr = ''
  try {
    configStr = JSON.stringify(config)
  } catch {
    configStr = ''
  }

  const combined = `${nameStr} ${vibeStr} ${configStr}`.toLowerCase()

  // 使用 basic_info.strategy_type 如果存在
  const strategyTypeRaw = config?.basic_info?.strategy_type
  if (strategyTypeRaw && typeof strategyTypeRaw === 'string') {
    // 将下划线转换为空格并首字母大写
    return strategyTypeRaw
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

  return nameStr || 'Trading Strategy'
}

export default strategyConfigToVisualization
