import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent } from 'utils/format'
import { useVaultPerformance } from 'store/vaultsdetail/hooks/useVaultPerformance'
import { useVaultInfo } from 'store/vaultsdetail/hooks/useVaultInfo'
import { useCurrentVaultId } from 'store/vaultsdetail/hooks'
import { CHAT_TIME_RANGE } from 'store/vaultsdetail/vaultsdetail.d'
import { toFix } from 'utils/calc'
import { t } from '@lingui/core/macro'
import { isMatchCurrentRouter } from 'utils'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const ChartStats = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  width: 100%;

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

interface VaultChartStatsProps {
  chartTimeRange: CHAT_TIME_RANGE
}

const VaultChartStats = memo<VaultChartStatsProps>(({ chartTimeRange }) => {
  // 获取 vault 基础信息
  const vaultId = useCurrentVaultId()
  const currentRouter = useCurrentRouter()
  const { vaultInfo, isLoadingVaultInfo } = useVaultInfo({ vaultId })

  // 获取 vault performance 信息
  const { performanceData, isLoading: isLoadingPerformance } = useVaultPerformance(chartTimeRange)

  const isVaultDetailPage = isMatchCurrentRouter(currentRouter, ROUTER.VAULT_DETAIL)

  // 根据期间获取APR标签名称
  const getPeriodAprLabel = () => {
    switch (chartTimeRange) {
      case '24h':
        return t`24H APY`
      case '7d':
        return t`7D APY`
      case '30d':
        return t`30D APY`
      default:
        return t`Period APY`
    }
  }

  if (isLoadingVaultInfo || isLoadingPerformance || !vaultInfo) {
    return (
      <ChartStats>
        <StatItem>
          <StatLabel>
            <Trans>TVL</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>
            <Trans>Index</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>
            <Trans>PnL</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>{getPeriodAprLabel()}</StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>
            <Trans>APR</Trans>
          </StatLabel>
          <StatValue>--</StatValue>
        </StatItem>
      </ChartStats>
    )
  }

  // 计算显示数据
  const tvl = vaultInfo.tvl
  const index = vaultInfo.tvl / vaultInfo.total_main_shares
  const pnl = performanceData?.incremental_net_pnl || 0
  const apr30d = vaultInfo['30d_apy']
  const lifetimeApr = vaultInfo.lifetime_apy

  return (
    <ChartStats>
      <StatItem>
        <StatLabel>
          <Trans>TVL</Trans>
        </StatLabel>
        <StatValue value={tvl}>
          {tvl === null || tvl === undefined ? '--' : formatKMBNumber(tvl, 2, { showDollar: true })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Index</Trans>
        </StatLabel>
        <StatValue value={index}>{formatNumber(toFix(index, 8))}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>PnL</Trans>
        </StatLabel>
        <StatValue value={pnl} $showSignColor={true}>
          {pnl === null || pnl === undefined ? '--' : formatKMBNumber(pnl, 2, { showDollar: true })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>{getPeriodAprLabel()}</StatLabel>
        <StatValue value={apr30d} $showSignColor={true}>
          {apr30d === null || apr30d === undefined ? '--' : formatPercent({ value: apr30d, precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>All-time APY</Trans>
        </StatLabel>
        <StatValue value={lifetimeApr} $showSignColor={true}>
          {lifetimeApr === null || lifetimeApr === undefined
            ? '--'
            : formatPercent({ value: lifetimeApr, precision: 2 })}
        </StatValue>
      </StatItem>
    </ChartStats>
  )
})

VaultChartStats.displayName = 'VaultChartStats'

export default VaultChartStats
