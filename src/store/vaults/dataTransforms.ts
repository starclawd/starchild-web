import { VaultInfo, VaultOverallStats, UserOverallStats } from 'api/vaults'
import { VaultLibraryStats, MyVaultStats, ProtocolVault, CommunityVault, NetworkInfo } from './vaults'

/**
 * 格式化数字为货币显示格式
 * @param value 数字值
 * @param options 格式化选项
 */
export function formatCurrency(
  value: number,
  options: {
    showSign?: boolean
    compact?: boolean
    decimals?: number
  } = {},
): string {
  const { showSign = false, compact = false, decimals = 2 } = options

  if (value === 0) {
    return '$0.00'
  }

  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : showSign && value > 0 ? '+' : ''

  if (compact && absValue >= 1000) {
    if (absValue >= 1_000_000_000) {
      return `${sign}$${(absValue / 1_000_000_000).toFixed(decimals)}B`
    } else if (absValue >= 1_000_000) {
      return `${sign}$${(absValue / 1_000_000).toFixed(decimals)}M`
    } else if (absValue >= 1_000) {
      return `${sign}$${(absValue / 1_000).toFixed(decimals)}K`
    }
  }

  return `${sign}$${absValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/**
 * 格式化APY显示
 */
export function formatApy(value: number): string {
  if (value === 0) return '-'
  return `${(value * 100).toFixed(2)}%`
}

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
  return {
    tvl: formatCurrency(data.strategy_vaults_tvl, { compact: true }),
    allTimePnL: formatCurrency(data.strategy_vaults_lifetime_net_pnl, {
      showSign: true,
      compact: true,
    }),
    vaultCount: data.strategy_vaults_count,
    raw: data,
  }
}

/**
 * 转换API数据到UI显示格式 - My Vault Stats
 * 注意：目前用户统计API暂时禁用，因为还没有钱包地址
 */
export function transformMyVaultStats(data: UserOverallStats): MyVaultStats {
  return {
    vaultCount: data.total_involved_vaults_count,
    myTvl: formatCurrency(data.total_vaults_tvl, { compact: true }),
    myAllTimePnL: formatCurrency(data.total_vaults_lifetime_net_pnl, { showSign: true, compact: true }),
    raw: data,
  }
}

/**
 * 转换API数据到UI显示格式 - Protocol Vault
 */
export function transformProtocolVault(data: VaultInfo): ProtocolVault {
  return {
    id: data.vault_id,
    name: data.vault_name,
    description: data.description,
    tvl: formatCurrency(data.tvl, { compact: true }),
    allTimeApy: formatApy(data.lifetime_apy),
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

  return {
    id: data.vault_id,
    name: data.vault_name,
    builder: data.broker_id,
    strategyProvider: data.sp_name || 'Unknown',
    networks,
    additionalNetworks,
    tvl: formatCurrency(data.tvl, { compact: true }),
    vaultAge: formatVaultAge(data.vault_age),
    allTimeApy: formatApy(data.lifetime_apy),
    allTimePnL: data.vault_lifetime_net_pnl,
    yourBalance: '-', // TODO: 需要用户余额数据
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
