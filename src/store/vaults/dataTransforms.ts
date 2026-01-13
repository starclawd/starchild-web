import { VaultOverallStats, UserOverallStats } from 'api/vaults'
import { VaultLibraryStats, MyVaultStats } from './vaults'
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
    tvl: tvlValue === 0 ? '$0.00' : formatKMBNumber(Math.abs(tvlValue), 2, { showDollar: true }),
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
    myTvl: tvlValue === 0 ? '$0.00' : formatKMBNumber(Math.abs(tvlValue), 2, { showDollar: true }),
    myAllTimePnL: pnlValue === 0 ? '$0.00' : `${pnlValue > 0 ? '+' : '-'}$${formatKMBNumber(Math.abs(pnlValue), 2)}`,
    raw: data,
  }
}
