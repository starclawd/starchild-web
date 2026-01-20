import { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateOrderlyAvailableSymbols, setLoadingOrderlySymbols } from '../reducer'
import { useGetOrderlyAvailableSymbolsQuery, OrderlyAvailableSymbolsDataType } from 'api/vaults'

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
    if (data?.rows) {
      dispatch(updateOrderlyAvailableSymbols(data.rows))
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
  const orderlyAvailableSymbols = useSelector((state: RootState) => state.vaults.orderlyAvailableSymbols)

  return useMemo(() => {
    if (!orderlyAvailableSymbols || !symbolName) return null
    return orderlyAvailableSymbols.find((s) => s.symbol === symbolName) || null
  }, [orderlyAvailableSymbols, symbolName])
}

/**
 * 获取 symbol 精度信息的 hook
 * 返回一个函数，根据 symbol 名称获取价格精度和数量精度
 */
export function useSymbolPrecision() {
  const orderlyAvailableSymbols = useSelector((state: RootState) => state.vaults.orderlyAvailableSymbols)

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

  // 获取价格精度
  const getPricePrecision = useCallback(
    (symbol: string): number => {
      return precisionMap[symbol]?.pricePrecision ?? 2
    },
    [precisionMap],
  )

  // 获取数量精度
  const getQtyPrecision = useCallback(
    (symbol: string): number => {
      return precisionMap[symbol]?.qtyPrecision ?? 4
    },
    [precisionMap],
  )

  // 格式化价格
  const formatPrice = useCallback(
    (price: number | string, symbol: string): string => {
      const precision = getPricePrecision(symbol)
      const num = Number(price)
      if (isNaN(num)) return '--'
      return num.toFixed(precision)
    },
    [getPricePrecision],
  )

  // 格式化数量
  const formatQty = useCallback(
    (qty: number | string, symbol: string): string => {
      const precision = getQtyPrecision(symbol)
      const num = Number(qty)
      if (isNaN(num)) return '--'
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
