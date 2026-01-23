import { memo, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent } from 'utils/format'
import { useVaultPerformance } from 'store/vaultsdetail/hooks/useVaultPerformance'
import { useVaultInfo } from 'store/vaultsdetail/hooks/useVaultInfo'
import { useCurrentVaultId } from 'store/vaultsdetail/hooks'
import { CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail.d'
import { toFix } from 'utils/calc'
import { msg, t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react/macro'

const ChartStats = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 74px;
  border-top: 1px solid ${({ theme }) => theme.black800};
  border-bottom: 1px solid ${({ theme }) => theme.black800};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      width: 100%;
    `}
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 40px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const StatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.black200};
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
  `}
`

const StatValue = styled.span<{ value?: number | null; $showSignColor?: boolean }>`
  font-size: 16px;
  color: ${({ value, $showSignColor = false, theme }) => {
    if (value === null || value === undefined) return theme.black300
    if (!$showSignColor) return theme.black0
    if (value === 0) return theme.black0
    return value > 0 ? theme.jade10 : theme.ruby50
  }};
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

interface StatItemConfig {
  key: string
  label: string
  value: number | null | undefined
  showSignColor: boolean
  format: (val: number | null | undefined) => string
}

interface VaultChartStatsProps {
  chartTimeRange: CHAT_TIME_RANGE
}

const VaultChartStats = memo<VaultChartStatsProps>(({ chartTimeRange }) => {
  const { t } = useLingui()
  // 获取 vault 基础信息
  const vaultId = useCurrentVaultId()
  const { vaultInfo, isLoadingVaultInfo } = useVaultInfo({ vaultId })

  // 获取 vault performance 信息
  const { performanceData, isLoading: isLoadingPerformance } = useVaultPerformance(chartTimeRange)

  // 根据期间获取APY标签名称
  const periodApyLabel = useMemo(() => {
    switch (chartTimeRange) {
      case '24h':
        return t(msg`24H APR`)
      case '7d':
        return t(msg`7D APR`)
      case '30d':
        return t(msg`30D APR`)
      default:
        return t(msg`Period APR`)
    }
  }, [chartTimeRange, t])

  // 统计项配置
  const statsConfig: StatItemConfig[] = useMemo(() => {
    const tvl = vaultInfo?.tvl
    const index = vaultInfo ? vaultInfo.tvl / vaultInfo.total_main_shares : null
    const pnl = performanceData?.incremental_net_pnl ?? null
    const periodApy = vaultInfo?.['30d_apy'] ?? null
    const lifetimeApy = vaultInfo?.lifetime_apy ?? null

    return [
      {
        key: 'tvl',
        label: t(msg`TVL`),
        value: tvl,
        showSignColor: false,
        format: (val) => (val == null ? '--' : formatKMBNumber(val, 2, { showDollar: true })),
      },
      {
        key: 'index',
        label: t(msg`Index`),
        value: index,
        showSignColor: false,
        format: (val) => (val == null ? '--' : formatNumber(toFix(val, 8))),
      },
      {
        key: 'pnl',
        label: t(msg`PnL`),
        value: pnl,
        showSignColor: true,
        format: (val) => (val == null ? '--' : formatKMBNumber(val, 2, { showDollar: true })),
      },
      {
        key: 'periodApy',
        label: periodApyLabel,
        value: periodApy,
        showSignColor: true,
        format: (val) => (val == null ? '--' : formatPercent({ value: val, precision: 2 })),
      },
      {
        key: 'lifetimeApy',
        label: t(msg`All-time APR`),
        value: lifetimeApy,
        showSignColor: true,
        format: (val) => (val == null ? '--' : formatPercent({ value: val, precision: 2 })),
      },
    ]
  }, [vaultInfo, performanceData, periodApyLabel, t])

  const isLoading = isLoadingVaultInfo || isLoadingPerformance || !vaultInfo

  return (
    <ChartStats>
      {statsConfig.map((stat) => (
        <StatItem key={stat.key}>
          <StatLabel>{stat.label}</StatLabel>
          <StatValue value={isLoading ? null : stat.value} $showSignColor={stat.showSignColor}>
            {isLoading ? '--' : stat.format(stat.value)}
          </StatValue>
        </StatItem>
      ))}
    </ChartStats>
  )
})

VaultChartStats.displayName = 'VaultChartStats'

export default VaultChartStats
