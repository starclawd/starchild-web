import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { formatNumber, formatKMBNumber, formatPercent } from 'utils/format'
import { useFetchVaultInfo, useVaultInfo } from 'store/vaultsdetail/hooks/useVaultInfo'
import { toFix } from 'utils/calc'

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
  color: ${({ theme }) => theme.textL3};
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
  `}
`

const StatValue = styled.span<{ $positive?: boolean }>`
  font-size: 16px;
  color: ${({ $positive, theme }) =>
    $positive === undefined ? theme.textL1 : $positive ? theme.jade10 : theme.ruby50};
  font-weight: 600;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

const VaultChartStats = memo(() => {
  // 获取 vault 信息
  const { isLoading: isLoadingVaultInfo } = useFetchVaultInfo()
  const [vaultInfo] = useVaultInfo()

  if (isLoadingVaultInfo || !vaultInfo) {
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
          <StatLabel>
            <Trans>30D APR</Trans>
          </StatLabel>
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
  const pnl = vaultInfo.vault_lifetime_net_pnl
  const apr30d = vaultInfo['30d_apy']
  const lifetimeApr = vaultInfo.lifetime_apy

  // 判断 PnL 和 APR 是否为正
  const isPnlPositive = pnl > 0
  const is30dAprPositive = apr30d > 0
  const isLifetimeAprPositive = lifetimeApr > 0

  return (
    <ChartStats>
      <StatItem>
        <StatLabel>
          <Trans>TVL</Trans>
        </StatLabel>
        <StatValue>{tvl === null || tvl === undefined ? '--' : `$${formatKMBNumber(tvl, 2)}`}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>Index</Trans>
        </StatLabel>
        <StatValue>{formatNumber(toFix(index, 8))}</StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>PnL</Trans>
        </StatLabel>
        <StatValue $positive={isPnlPositive}>
          {pnl === null || pnl === undefined ? '--' : `$${formatKMBNumber(pnl, 2)}`}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>30D APR</Trans>
        </StatLabel>
        <StatValue $positive={is30dAprPositive}>
          {apr30d === null || apr30d === undefined ? '--' : formatPercent({ value: apr30d, precision: 2 })}
        </StatValue>
      </StatItem>
      <StatItem>
        <StatLabel>
          <Trans>APR</Trans>
        </StatLabel>
        <StatValue $positive={isLifetimeAprPositive}>
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
