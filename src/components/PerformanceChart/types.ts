import { VaultChartType, VaultChartTimeRange } from 'store/vaultsdetail/vaultsdetail'

// 统一的图表数据接口
export interface ChartData {
  data: Array<{ timestamp: number; value: number }>
  isLoading: boolean
  isPositive?: boolean
  hasData: boolean
  chartType: VaultChartType
}

// MyStrategy的特殊数据结构（包含多个策略的数据）
export interface MultiStrategyChartData extends Omit<ChartData, 'data'> {
  data: Array<{
    strategyId: string
    strategyName: string
    data: Array<{ timestamp: number; value: number }>
  }>
  allStrategies: Array<{
    strategyId: string
    strategyName: string
  }>
}

// 图表配置接口
export interface ChartOptions {
  options: any
  chartJsData: any
  crossHairPlugin?: any
  initialEquityLinePlugin?: any
  glowEffectPlugin?: any
  resetHoverState?: (chart: any) => void
  plugins?: any[] // 合并后的plugins数组
}

// 图表状态管理接口
export interface ChartState {
  chartType: VaultChartType
  timeRange: VaultChartTimeRange
  setChartType: (type: VaultChartType) => void
  setTimeRange: (range: VaultChartTimeRange) => void
}

// 扩展的性能图表状态接口（包含模块特定状态）
export interface PerformanceChartState extends ChartState {
  moduleState?: {
    vaultId?: string | null
    setVaultId?: (id: string | null) => void
    strategyId?: string | null
    setStrategyId?: (id: string | null) => void
  }
}

// 图表模式类型
export type ChartMode = 'myvault' | 'mystrategy' | 'vaultsdetail'

// 向后兼容的别名
export type PerformanceChartModule = ChartMode

// PerformanceChart组件的props接口
export interface PerformanceChartProps {
  // 数据相关
  chartData: ChartData | MultiStrategyChartData
  chartOptions: ChartOptions

  // 空状态图表配置（可选）
  emptyChartData?: any
  emptyChartOptions?: any

  // 状态管理
  chartState: PerformanceChartState

  // UI组件（可选，通过render props模式注入）
  title?: React.ReactNode
  leftControls?: React.ReactNode
  rightControls?: React.ReactNode
  statsComponent?: React.ReactNode

  // 特殊配置
  chartMode: ChartMode
  strategyId?: string // 用于MyStrategy的strategyId过滤

  // 样式配置
  className?: string
  chartHeight?: number
  chartHeightMobile?: number
}
