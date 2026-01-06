export enum MY_PORTFOLIO_TAB_KEY {
  VAULTS = 'vaults',
  STRATEGY = 'strategy',
}

export enum STRATEGY_TAB_KEY {
  LAUNCHED = 'launched',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

export interface MyStrategyCacheState {
  // 记录MyStrategy页面中tab的索引
  strategyTabKey: STRATEGY_TAB_KEY
  // 记录MyPortfolio页面中当前选中的tab
  activeTab: MY_PORTFOLIO_TAB_KEY
}
