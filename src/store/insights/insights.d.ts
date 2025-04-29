
export interface InsightsDataType {
  id: string
  symbol: string
  title: string
  content: string
  isLong: boolean
}

export interface InsightsListDataType {
  list: InsightsDataType[]
  totalSize: number
}

export interface TokenListDataType {
  symbol: string
  des: string
}