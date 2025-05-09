import { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
export interface InsightsDataType {
  id: number
  marketId: string
  alertType: string
  alertOptions: {
    currentPrice: number
    movementType: string
    openPrice: number
    priceChange: number
  }
  alertQuery: string
  aiContent: string
  createdAt: number
  isRead: boolean
}

export interface InsightsListDataType {
  list: InsightsDataType[]
  totalSize: number
}

export interface TokenListDataType {
  symbol: string
  des: string
  size: number
}

export interface KlineSubDataType {
  stream: string
  data: {
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
}


// 标记点接口
export interface MarkerPoint {
  time: string | UTCTimestamp;
  originalTimestamps?: number[]; // 添加原始时间戳数组
}

// 单个标记点组件的属性接口
interface SingleMarkerProps {
  chartRef: React.RefObject<IChartApi>;
  seriesRef: React.RefObject<ISeriesApi<'Area'>>;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  markerData: MarkerPoint;
  chartData: Array<{ time: string | UTCTimestamp; value: number }>;
}

// 标记点容器组件的属性接口
interface MarkersProps {
  chartRef: React.RefObject<IChartApi>;
  seriesRef: React.RefObject<ISeriesApi<'Area'>>;
  chartContainerRef: React.RefObject<HTMLDivElement>;
  chartData: Array<{ time: string | UTCTimestamp; value: number }>;
}
