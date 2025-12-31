import { VaultPosition, VaultOpenOrder } from 'api/vaults'

// Symbol处理函数
export function extractBaseToken(symbol: string): string {
  // 处理PERP_SOL_USDC格式，提取SOL
  if (symbol.startsWith('PERP_')) {
    const parts = symbol.split('_')
    return parts.length >= 2 ? parts[1] : symbol
  }
  return symbol
}

export function formatSymbolDisplay(symbol: string): string {
  // 处理PERP_SOL_USDC格式，显示为SOL-USDC
  if (symbol.startsWith('PERP_')) {
    const parts = symbol.split('_')
    if (parts.length >= 3) {
      return `${parts[1]}-${parts[2]}`
    }
  }
  return symbol
}

// 生成symbol logo URL
export function getSymbolLogoUrl(token: string): string {
  return `https://oss.orderly.network/static/symbol_logo/${token.toUpperCase()}.png`
}

// 计算VaultPosition数据
export function calculateVaultPosition(rawPosition: {
  symbol: string
  position_qty: number
  average_open_price: number
  mark_price: number
  est_liq_price: number | undefined
  imr: number | undefined
}): VaultPosition {
  // 计算 position_side
  const position_side: 'long' | 'short' = rawPosition.position_qty > 0 ? 'long' : 'short'

  // 计算 value: abs(position_qty * mark_price)
  const value = Math.abs(rawPosition.position_qty * rawPosition.mark_price)

  // 计算价格变化
  const priceChange = rawPosition.mark_price - rawPosition.average_open_price

  // 计算 ROE (Return on Equity)
  // ROE = (mark_price - average_open_price) / average_open_price * 100
  // 对于short position，ROE的计算是相反的
  const roe =
    position_side === 'long'
      ? (priceChange / rawPosition.average_open_price) * 100
      : (-priceChange / rawPosition.average_open_price) * 100

  // 计算 PnL (Profit and Loss)
  // PnL = position_qty * (mark_price - average_open_price)
  // 对于 long position: 正的 position_qty，价格上涨时盈利
  // 对于 short position: 负的 position_qty，价格下跌时盈利
  const pnl = rawPosition.position_qty * priceChange

  // 处理symbol相关字段
  const token = extractBaseToken(rawPosition.symbol)
  const displaySymbol = formatSymbolDisplay(rawPosition.symbol)
  const logoUrl = getSymbolLogoUrl(token)
  const initial_margin = rawPosition.imr !== undefined ? value * (rawPosition.imr || 0) : undefined

  return {
    symbol: rawPosition.symbol,
    displaySymbol,
    token,
    logoUrl,
    position_qty: rawPosition.position_qty,
    value,
    average_open_price: rawPosition.average_open_price,
    mark_price: rawPosition.mark_price,
    pnl,
    roe,
    position_side,
    est_liq_price: rawPosition.est_liq_price,
    initial_margin,
  }
}

// 处理VaultOpenOrder数据
export function processVaultOpenOrder(rawOrder: any): VaultOpenOrder {
  // 处理symbol相关字段
  const token = extractBaseToken(rawOrder.symbol)
  const displaySymbol = formatSymbolDisplay(rawOrder.symbol)
  const logoUrl = getSymbolLogoUrl(token)

  return {
    ...rawOrder,
    displaySymbol,
    token,
    logoUrl,
  }
}

// 处理StrategyOrderHistoryItem数据
export function processStrategyOrderHistoryItem(rawOrder: any): any {
  // 处理symbol相关字段
  const token = extractBaseToken(rawOrder.symbol)
  const displaySymbol = formatSymbolDisplay(rawOrder.symbol)
  const logoUrl = getSymbolLogoUrl(token)
  const price = rawOrder.order_data?.average_executed_price
  const quantity = rawOrder.order_data?.quantity
  const executed_quantity = rawOrder.order_data?.total_executed_quantity
  return {
    ...rawOrder,
    displaySymbol,
    token,
    logoUrl,
    price,
    quantity,
    executed_quantity,
  }
}

// 处理VaultTradeHistory数据
export function processVaultTradeHistory(rawTradeHistory: any): any {
  // 处理symbol相关字段
  const token = extractBaseToken(rawTradeHistory.symbol)
  const displaySymbol = formatSymbolDisplay(rawTradeHistory.symbol)
  const logoUrl = getSymbolLogoUrl(token)
  const price = rawTradeHistory.executed_price
  const executed_quantity = rawTradeHistory.executed_quantity

  // 映射字段以保持与strategy订单一致的接口
  const quantity = rawTradeHistory.executed_quantity // vault没有total quantity，使用executed_quantity
  const updated_at = rawTradeHistory.executed_timestamp // 使用executed_timestamp作为updated_at

  return {
    ...rawTradeHistory,
    displaySymbol,
    token,
    logoUrl,
    price,
    executed_quantity,
    quantity,
    updated_at,
  }
}
