import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useVaultOverviewData } from 'store/vaults/hooks/useVaultData'
import Pending from 'components/Pending'

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
  padding: 24px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  font-weight: 500;
`

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
`

const ProfitValue = styled(StatValue)<{ $isProfit?: boolean }>`
  color: ${({ theme, $isProfit }) => ($isProfit ? theme.green100 : theme.ruby50)};
  display: flex;
  align-items: center;
  gap: 4px;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
`

const VaultOverview = memo(() => {
  const { vaultLibraryStats, isLoadingLibraryStats } = useVaultOverviewData()

  console.log('VaultOverview render:', { vaultLibraryStats, isLoadingLibraryStats })

  if (isLoadingLibraryStats) {
    return (
      <OverviewContainer>
        <LoadingContainer>
          <Pending isFetching />
        </LoadingContainer>
      </OverviewContainer>
    )
  }

  if (!vaultLibraryStats && !isLoadingLibraryStats) {
    // 如果没有数据且不在加载中，显示默认值
    const defaultStats = {
      tvl: '--',
      allTimePnL: '--',
      vaultCount: 0,
    }

    return (
      <OverviewContainer>
        <StatsGrid>
          <StatItem>
            <StatLabel>
              <Trans>TVL</Trans>
            </StatLabel>
            <StatValue>{defaultStats.tvl}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>All-time PnL</Trans>
            </StatLabel>
            <StatValue>{defaultStats.allTimePnL}</StatValue>
          </StatItem>

          <StatItem>
            <StatLabel>
              <Trans>Vaults</Trans>
            </StatLabel>
            <StatValue>{defaultStats.vaultCount}</StatValue>
          </StatItem>
        </StatsGrid>
      </OverviewContainer>
    )
  }

  // 确保 vaultLibraryStats 存在后再使用
  if (!vaultLibraryStats) {
    return null // 这种情况下前面的默认状态应该已经处理了
  }

  // 判断是否为正收益
  const isProfitPositive =
    vaultLibraryStats.allTimePnL.includes('+') ||
    (!vaultLibraryStats.allTimePnL.includes('-') && vaultLibraryStats.allTimePnL !== '$0.00')

  return (
    <OverviewContainer>
      <StatsGrid>
        <StatItem>
          <StatLabel>
            <Trans>TVL</Trans>
          </StatLabel>
          <StatValue>{vaultLibraryStats.tvl}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>All-time PnL</Trans>
          </StatLabel>
          <ProfitValue $isProfit={isProfitPositive}>{vaultLibraryStats.allTimePnL}</ProfitValue>
        </StatItem>

        <StatItem>
          <StatLabel>
            <Trans>Vaults</Trans>
          </StatLabel>
          <StatValue>{vaultLibraryStats.vaultCount}</StatValue>
        </StatItem>
      </StatsGrid>
    </OverviewContainer>
  )
})

VaultOverview.displayName = 'VaultOverview'

export default VaultOverview
