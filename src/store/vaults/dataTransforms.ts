import { VaultInfo, VaultOverallStats, UserOverallStats } from 'api/vaults'
import { StrategiesOverviewStrategy } from 'api/strategy'
import {
  VaultLibraryStats,
  MyVaultStats,
  ProtocolVault,
  CommunityVault,
  NetworkInfo,
  AllStrategiesOverview,
} from './vaults'
import { formatKMBNumber, formatPercent, formatNumber } from 'utils/format'

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
    vaultCount: data.total_involved_vaults_count,
    myTvl: tvlValue === 0 ? '$0.00' : `$${formatKMBNumber(Math.abs(tvlValue), 2)}`,
    myAllTimePnL: pnlValue === 0 ? '$0.00' : `${pnlValue > 0 ? '+' : '-'}$${formatKMBNumber(Math.abs(pnlValue), 2)}`,
    raw: data,
  }
}

/**
 * 转换API数据到UI显示格式 - Protocol Vault
 */
export function transformProtocolVault(data: VaultInfo): ProtocolVault {
  const tvlValue = data.tvl
  const apyValue = data.lifetime_apy

  return {
    id: data.vault_id,
    name: data.vault_name,
    description: data.description,
    tvl: tvlValue === 0 ? '$0.00' : `$${formatKMBNumber(Math.abs(tvlValue), 2)}`,
    allTimeApy: apyValue === 0 ? '-' : formatPercent({ value: apyValue, precision: 2, deleteZero: true }),
    depositors: data.lp_counts,
    raw: data,
  }
}

/**
 * 转换API数据到UI显示格式 - Community Vault
 */
export function transformCommunityVault(data: VaultInfo): CommunityVault {
  // 转换支持的网络信息
  const networks: NetworkInfo[] = data.supported_chains.slice(0, 3).map((chain) => ({
    id: chain.chain_id,
    name: chain.chain_name,
    icon: getNetworkIcon(chain.chain_name),
  }))

  const additionalNetworks = Math.max(0, data.supported_chains.length - 3)

  // FIXME: use real data to random select creator avatar
  const avatarOptions = ['/src/assets/vaults/test-user-avatar1.png', '/src/assets/vaults/test-user-avatar2.png']
  const creatorAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)]

  const tvlValue = data.tvl
  const apyValue = data.lifetime_apy

  return {
    id: data.vault_id,
    name: data.vault_name,
    builder: data.broker_id,
    strategyProvider: data.sp_name || 'Unknown',
    networks,
    additionalNetworks,
    tvl: tvlValue === 0 ? '$0.00' : `$${formatKMBNumber(Math.abs(tvlValue), 2)}`,
    vaultAge: formatVaultAge(data.vault_age),
    allTimeApy: apyValue === 0 ? '-' : formatPercent({ value: apyValue, precision: 2, deleteZero: true }),
    allTimePnL: data.vault_lifetime_net_pnl,
    yourBalance: '-', // TODO: 需要用户余额数据
    creatorAvatar,
    raw: data,
  }
}

/**
 * 批量转换Protocol Vaults
 */
export function transformProtocolVaults(data: VaultInfo[]): ProtocolVault[] {
  return data.map(transformProtocolVault)
}

/**
 * 批量转换Community Vaults
 */
export function transformCommunityVaults(data: VaultInfo[]): CommunityVault[] {
  return data.map(transformCommunityVault)
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
