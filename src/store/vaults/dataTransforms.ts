import { VaultOverallStats, UserOverallStats } from 'api/vaults'
import { StrategiesOverviewStrategy } from 'api/strategy'
import { VaultLibraryStats, MyVaultStats, AllStrategiesOverview } from './vaults'
import { formatKMBNumber } from 'utils/format'

/**
 * 格式化vault年龄显示
 */
export function formatVaultAge(ageInDays: number): string {
  if (ageInDays < 1) {
    return '< 1 day'
  } else if (ageInDays === 1) {
    return '1 day'
  } else {
    return `${Math.floor(ageInDays)} days`
  }
}

/**
 * 获取网络图标 (placeholder实现)
 */
function getNetworkIcon(chainName: string): string {
  // TODO: 根据实际需求实现网络图标获取逻辑
  return ''
}

/**
 * 转换API数据到UI显示格式 - Vault Library Stats
 */
export function transformVaultLibraryStats(data: VaultOverallStats): VaultLibraryStats {
  const tvlValue = data.strategy_vaults_tvl
  const pnlValue = data.strategy_vaults_lifetime_net_pnl

  return {
    tvl: tvlValue === 0 ? '$0.00' : `$${formatKMBNumber(Math.abs(tvlValue), 2)}`,
    allTimePnL: pnlValue === 0 ? '$0.00' : `${pnlValue > 0 ? '+' : ''}$${formatKMBNumber(Math.abs(pnlValue), 2)}`,
    vaultCount: data.strategy_vaults_count,
    raw: data,
  }
}

/**
 * 转换API数据到UI显示格式 - My Vault Stats
 * 注意：目前用户统计API暂时禁用，因为还没有钱包地址
 */
export function transformMyVaultStats(data: UserOverallStats): MyVaultStats {
  const tvlValue = data.total_vaults_tvl
  const pnlValue = data.total_vaults_lifetime_net_pnl

  return {
    vaultCount: data.total_involved_vaults_count.toString(),
    myTvl: tvlValue === 0 ? '$0.00' : `$${formatKMBNumber(Math.abs(tvlValue), 2)}`,
    myAllTimePnL: pnlValue === 0 ? '$0.00' : `${pnlValue > 0 ? '+' : '-'}$${formatKMBNumber(Math.abs(pnlValue), 2)}`,
    raw: data,
  }
}

/**
 * 转换策略概览数据
 */
export function transformAllStrategiesOverview(apiData: StrategiesOverviewStrategy[]): AllStrategiesOverview[] {
  return apiData.map((strategy) => ({
    strategyId: strategy.strategy_id,
    vaultId: strategy.vault_id,
    period: strategy.period,
    pnl: strategy.pnl,
    pnlPercentage: strategy.pnl_percentage,
    apr: strategy.apr,
    allTimeApr: strategy.all_time_apr,
    maxDrawdown: strategy.max_drawdown,
    sharpeRatio: strategy.sharpe_ratio,
    startBalance: strategy.start_balance,
    initialBalance: strategy.initial_balance,
    endBalance: strategy.end_balance,
    dataPoints: strategy.data_points,
    ageDays: strategy.age_days,
    strategyName: strategy.strategy_name,
    strategyType: strategy.strategy_type,
    userInfo: strategy.userInfo,
    // 保存原始数据
    raw: strategy,
  }))
}
