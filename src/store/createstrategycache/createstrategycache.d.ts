import { STRATEGY_TAB_INDEX } from 'store/createstrategy/createstrategy'

export interface CreateStrategyCacheState {
  // 记录每个策略的tab索引，key为strategy_id，value为tab索引
  strategyTabIndexMap: Record<string, STRATEGY_TAB_INDEX>
  // 左侧面板宽度
  leftWidth: number
}
