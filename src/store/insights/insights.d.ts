
export interface InsightsDataType { 
  query: string
  type: string
  timestamp: number
  message: string
  market_id: string
}

export interface InsightsListDataType {
  list: InsightsDataType[]
  totalSize: number
}

export interface TokenListDataType {
  symbol: string
  des: string
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
