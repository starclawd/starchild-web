import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateOrderlyAvailableSymbols, setLoadingOrderlySymbols } from '../reducer'
import { useGetOrderlyAvailableSymbolsQuery, OrderlyAvailableSymbolsDataType } from 'api/orderly'

/**
 * 根据 tick 值计算小数位数
 * 例如：0.01 -> 2, 0.0001 -> 4, 0.1 -> 1, 1 -> 0
 */
export function getDecimalPlacesFromTick(tick: number): number {
  if (!tick || tick <= 0) return 2 // 默认2位小数
  if (tick >= 1) return 0

  const tickStr = tick.toString()
  // 处理科学计数法
  if (tickStr.includes('e-')) {
    const exp = parseInt(tickStr.split('e-')[1], 10)
    return exp
  }
  // 处理普通小数
  const decimalPart = tickStr.split('.')[1]
  return decimalPart ? decimalPart.length : 0
}

/**
 * Orderly 可用交易对数据管理和 API 获取 hook
 */
export function useOrderlyAvailableSymbols() {
  const dispatch = useDispatch()
  const orderlyAvailableSymbols = useSelector((state: RootState) => state.vaults.orderlyAvailableSymbols)
  const isLoadingOrderlySymbols = useSelector((state: RootState) => state.vaults.isLoadingOrderlySymbols)

  const { data, isLoading, error, refetch } = useGetOrderlyAvailableSymbolsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if ((data as any)?.data?.rows) {
      dispatch(updateOrderlyAvailableSymbols((data as any).data.rows))
    }
  }, [data, dispatch])

  useEffect(() => {
    dispatch(setLoadingOrderlySymbols(isLoading))
  }, [isLoading, dispatch])

  return {
    orderlyAvailableSymbols,
    isLoading: isLoadingOrderlySymbols,
    error,
    refetch,
  }
}

/**
 * 根据 symbol 名称获取单个交易对信息
 */
export function useOrderlySymbolByName(symbolName: string): OrderlyAvailableSymbolsDataType | null {
  const { orderlyAvailableSymbols } = useOrderlyAvailableSymbols()

  return useMemo(() => {
    if (!orderlyAvailableSymbols || !symbolName) return null
    return orderlyAvailableSymbols.find((s) => s.symbol === symbolName) || null
  }, [orderlyAvailableSymbols, symbolName])
}

/**
 * 将新格式 symbol（如 BTC）转换为 orderly 格式（如 PERP_BTC_USDC）
 * 用于在 precisionMap 中查找精度信息
 */
function normalizeSymbolForPrecision(symbol: string): string {
  // 如果已经是 orderly 格式（包含 PERP_ 或 SPOT_），直接返回
  if (symbol.includes('_')) {
    return symbol
  }
  // 新格式（如 BTC），转换为 PERP_BTC_USDC 格式尝试匹配
  return `PERP_${symbol}_USDC`
}

/**
 * 检查 symbol 是否为旧格式（如 PERP_BTC_USDC）
 */
export function isOldSymbolFormat(symbol: string): boolean {
  return symbol.includes('_')
}

/**
 * 根据数据格式生成 Symbol 显示文本
 * 新格式：BTC SPOT 或 BTC PERP · 10x
 * 旧格式：保持原有格式（如 BTC-USDC PERP · 10x）
 */
export function getSymbolDisplayText(
  symbol: string,
  displaySymbol: string,
  type?: 'spot' | 'perp',
  leverage?: number,
): string {
  // 检查是否为旧格式（包含下划线）
  if (isOldSymbolFormat(symbol)) {
    // 旧格式：从 displaySymbol 提取基础文本，类型固定为 PERP
    const baseText = displaySymbol.replace(' PERP', '').replace(/ · \d+x$/, '')
    const leverageText = leverage ? ` · ${leverage}x` : ''
    return `${baseText} PERP${leverageText}`
  }

  // 新格式：直接使用 token/displaySymbol 和 type
  const baseText = displaySymbol || symbol
  const typeText = type === 'spot' ? 'SPOT' : 'PERP'
  // spot 类型不显示杠杆，perp 和 undefined（默认 perp）都显示杠杆
  const leverageText = type !== 'spot' && leverage ? ` · ${leverage}x` : ''

  return `${baseText} ${typeText}${leverageText}`
}

/**
 * 获取 symbol 精度信息的 hook
 * 返回一个函数，根据 symbol 名称获取价格精度和数量精度
 * 支持新格式（BTC）和旧格式（PERP_BTC_USDC）
 */
export function useSymbolPrecision() {
  const { orderlyAvailableSymbols } = useOrderlyAvailableSymbols()

  // 创建 symbol -> precision 映射
  const precisionMap = useMemo(() => {
    const map: Record<string, { pricePrecision: number; qtyPrecision: number }> = {}
    if (orderlyAvailableSymbols) {
      orderlyAvailableSymbols.forEach((s) => {
        map[s.symbol] = {
          pricePrecision: getDecimalPlacesFromTick(s.quote_tick),
          qtyPrecision: getDecimalPlacesFromTick(s.base_tick),
        }
      })
    }
    return map
  }, [orderlyAvailableSymbols])

  // 获取价格精度，返回 null 表示没有匹配到
  const getPricePrecision = useCallback(
    (symbol: string): number | null => {
      const normalizedSymbol = normalizeSymbolForPrecision(symbol)
      return precisionMap[normalizedSymbol]?.pricePrecision ?? precisionMap[symbol]?.pricePrecision ?? null
    },
    [precisionMap],
  )

  // 获取数量精度，返回 null 表示没有匹配到
  const getQtyPrecision = useCallback(
    (symbol: string): number | null => {
      const normalizedSymbol = normalizeSymbolForPrecision(symbol)
      return precisionMap[normalizedSymbol]?.qtyPrecision ?? precisionMap[symbol]?.qtyPrecision ?? null
    },
    [precisionMap],
  )

  // 格式化价格
  // 如果匹配不到 orderly 精度数据，直接返回原值（后端已处理精度）
  const formatPrice = useCallback(
    (price: number | string, symbol: string): string => {
      const num = Number(price)
      if (isNaN(num)) return '--'

      const precision = getPricePrecision(symbol)
      // 如果匹配不到精度数据，说明是新数据，后端已处理精度，直接返回
      if (precision === null) {
        return String(price)
      }
      return num.toFixed(precision)
    },
    [getPricePrecision],
  )

  // 格式化数量
  // 如果匹配不到 orderly 精度数据，直接返回原值（后端已处理精度）
  const formatQty = useCallback(
    (qty: number | string, symbol: string): string => {
      const num = Number(qty)
      if (isNaN(num)) return '--'

      const precision = getQtyPrecision(symbol)
      // 如果匹配不到精度数据，说明是新数据，后端已处理精度，直接返回
      if (precision === null) {
        return String(qty)
      }
      return num.toFixed(precision)
    },
    [getQtyPrecision],
  )

  return {
    precisionMap,
    getPricePrecision,
    getQtyPrecision,
    formatPrice,
    formatQty,
  }
}
