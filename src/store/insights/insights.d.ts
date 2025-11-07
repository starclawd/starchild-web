import { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import { BacktestDataType } from 'store/agentdetail/agentdetail'

export interface KlineSubInnerDataType {
  e: string
  E: number
  s: string
  k: {
    t: number
    T: number
    s: string
    i: string
    f: number
    L: number
    o: string
    c: string
    h: string
    l: string
    v: string
    n: number
    x: boolean
    q: string
    V: string
    Q: string
    B: string
  }
}

export interface KlineSubDataType {
  stream: string
  data: KlineSubInnerDataType
}

// 标记点容器组件的属性接口
interface MarkersProps {
  chartRef: React.RefObject<IChartApi>
  seriesRef: React.RefObject<ISeriesApi<'Area'>>
  chartContainerRef: React.RefObject<HTMLDivElement>
  chartData: Array<{ time: string | UTCTimestamp; value: number }>
}

export interface CoingeckoCoinIdMapDataType {
  id: string
  name: string
  symbol: string
}

export interface BinanceSymbolsDataType {
  symbol: string
  status: string
  baseAsset: string
  baseAssetPrecision: number
  quoteAsset: string
  quotePrecision: number
  quoteAssetPrecision: number
  baseCommissionPrecision: number
  quoteCommissionPrecision: number
  orderTypes: string[]
  icebergAllowed: boolean
  ocoAllowed: boolean
  otoAllowed: boolean
  quoteOrderQtyMarketAllowed: boolean
  allowTrailingStop: boolean
  cancelReplaceAllowed: boolean
  amendAllowed: boolean
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  filters: Array<{
    filterType: string
    minPrice?: string
    maxPrice?: string
    tickSize?: string
    minQty?: string
    maxQty?: string
    stepSize?: string
    limit?: number
    minTrailingAboveDelta?: number
    maxTrailingAboveDelta?: number
    minTrailingBelowDelta?: number
    maxTrailingBelowDelta?: number
    bidMultiplierUp?: string
    bidMultiplierDown?: string
    askMultiplierUp?: string
    askMultiplierDown?: string
    avgPriceMins?: number
    minNotional?: string
    applyMinToMarket?: boolean
    maxNotional?: string
    applyMaxToMarket?: boolean
    maxNumOrders?: number
    maxNumAlgoOrders?: number
  }>
  permissions: string[]
  permissionSets: string[][]
  defaultSelfTradePreventionMode: string
  allowedSelfTradePreventionModes: string[]
}

// 定义K线请求参数接口，添加timeZone字段
interface KlineDataParams {
  symbol: string
  interval: string
  limit?: number
  startTime?: number
  endTime?: number
  timeZone?: string
  coingeckoId: string
  isBinanceSupport: boolean
}

// Define chart data type that matches lightweight-charts requirements
export type ChartDataItem = {
  time: string | UTCTimestamp
  value?: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// 定义买卖标签数据类型
export interface TradeMarker {
  time: UTCTimestamp
  position: 'aboveBar' | 'belowBar'
  color: string
  shape: 'arrowUp' | 'arrowDown' | 'circle'
  text: string
  size: number
}

export interface CryptoChartProps {
  symbol?: string
  isBinanceSupport: boolean
  isMobileBackTestPage?: boolean
  backtestData: BacktestDataType
  showFullScreen?: boolean
  ref?: React.RefObject<CryptoChartRef>
}

// 定义暴露给父组件的方法接口
export interface CryptoChartRef {
  handleResize: () => void
}
